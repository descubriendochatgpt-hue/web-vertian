// Pruebas de la función «contacto» sin base de datos ni correo reales.
// Ejecutar: deno test supabase/functions/contacto/
import { assertEquals } from 'jsr:@std/assert@1';
import { type Correo, type Deps, handle, type Solicitud } from './index.ts';

function falsos(opts: { previas?: number; correoFalla?: boolean; origenes?: string[] } = {}) {
  const filas: Solicitud[] = [];
  const correos: Correo[] = [];
  const deps: Deps = {
    avisos: 'vertianmail@gmail.com',
    origenes: opts.origenes ?? [],
    recientes: () => Promise.resolve(opts.previas ?? 0),
    guardar: (s) => { filas.push(s); return Promise.resolve(); },
    enviar: (c) => opts.correoFalla ? Promise.reject(new Error('smtp')) : (correos.push(c), Promise.resolve()),
  };
  return { deps, filas, correos };
}

const valida = {
  nombre: 'Ana García', email: 'Ana@Example.com', telefono: '600 000 000', servicio: 'Certificado · Piso o apartamento',
  mensaje: 'Datos de la calculadora:\n· Precio: 90 €', pagina: 'certificado-energetico-gijon', idioma: 'es', privacidad: 'aceptada',
};
const post = (body: unknown, origin = 'https://vertian.netlify.app') =>
  new Request('https://x.supabase.co/functions/v1/contacto', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body) });

Deno.test('guarda la solicitud y envía aviso y confirmación', async () => {
  const f = falsos();
  const res = await handle(post(valida), f.deps);
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { ok: true });
  assertEquals(f.filas.length, 1);
  assertEquals(f.filas[0].email, 'ana@example.com');
  assertEquals(f.correos.map((c) => [c.to, c.replyTo]), [['vertianmail@gmail.com', 'ana@example.com'], ['ana@example.com', 'vertianmail@gmail.com']]);
  assertEquals(f.correos[1].subject, 'Hemos recibido tu solicitud · VERTIAN SOLUTIONS');
  assertEquals(f.correos[1].text.startsWith('Hola, Ana García:'), true);
});

Deno.test('la confirmación sale en inglés desde las páginas en inglés', async () => {
  const f = falsos();
  await handle(post({ ...valida, idioma: 'en' }), f.deps);
  assertEquals(f.correos[1].subject, 'We have received your request · VERTIAN SOLUTIONS');
});

Deno.test('rechaza datos incompletos sin guardar nada', async () => {
  for (const malo of [{ ...valida, email: 'no-es-correo' }, { ...valida, nombre: ' ' }, { ...valida, privacidad: '' }]) {
    const f = falsos();
    const res = await handle(post(malo), f.deps);
    assertEquals(res.status, 400);
    assertEquals(f.filas.length + f.correos.length, 0);
  }
});

Deno.test('los bots reciben ok pero no se guarda ni se envía nada', async () => {
  const f = falsos();
  const res = await handle(post({ ...valida, web: 'http://spam' }), f.deps);
  assertEquals(res.status, 200);
  assertEquals(f.filas.length + f.correos.length, 0);
});

Deno.test('límite de 3 solicitudes por correo y hora', async () => {
  const f = falsos({ previas: 3 });
  const res = await handle(post(valida), f.deps);
  assertEquals(res.status, 429);
  assertEquals(f.filas.length, 0);
});

Deno.test('si falla el correo, la solicitud queda guardada', async () => {
  const f = falsos({ correoFalla: true });
  const res = await handle(post(valida), f.deps);
  assertEquals(res.status, 200);
  assertEquals(f.filas.length, 1);
});

Deno.test('no se pueden inyectar cabeceras de correo con saltos de línea', async () => {
  const f = falsos();
  await handle(post({ ...valida, nombre: 'Ana\r\nBcc: victima@x.com', servicio: 'X\nBcc: y@z.com' }), f.deps);
  assertEquals(f.correos[0].subject.includes('\n'), false);
});

Deno.test('responde al permiso previo del navegador (CORS)', async () => {
  const res = await handle(new Request('https://x/', { method: 'OPTIONS', headers: { origin: 'https://www.vertian.es' } }), falsos({ origenes: ['https://www.vertian.es'] }).deps);
  assertEquals(res.status, 204);
  assertEquals(res.headers.get('access-control-allow-origin'), 'https://www.vertian.es');
});
