// Función «contacto» de Supabase: recibe el formulario de la web de VERTIAN SOLUTIONS.
//
// 1. Guarda la solicitud en la tabla public.solicitudes.
// 2. Envía el aviso a AVISOS (por defecto, la misma cuenta de Gmail).
// 3. Envía al cliente una confirmación en su idioma desde esa cuenta de Gmail.
//
// Secretos necesarios (Edge Functions → Secrets):
//   GMAIL_USER          vertianmail@gmail.com
//   GMAIL_APP_PASSWORD  contraseña de aplicación de Google (16 letras)
//   AVISOS              opcional: otro correo para los avisos
//   ORIGENES            opcional: dominios permitidos separados por comas (p. ej. https://www.vertian.es)
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los pone Supabase automáticamente.

import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6.9.16';

export type Solicitud = {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  pagina: string;
  idioma: 'es' | 'en';
};

export type Correo = { to: string; replyTo: string; subject: string; text: string };

export type Deps = {
  // Cuántas solicitudes ha enviado este correo en la última hora.
  recientes: (email: string) => Promise<number>;
  guardar: (s: Solicitud) => Promise<void>;
  enviar: (c: Correo) => Promise<void>;
  avisos: string;
  origenes: string[];
};

const LIMITE_POR_HORA = 3;

const CONFIRMACION = {
  es: {
    asunto: 'Hemos recibido tu solicitud · VERTIAN SOLUTIONS',
    texto: (s: Solicitud) =>
      `Hola, ${s.nombre}:\n\n` +
      `Hemos recibido tu solicitud sobre «${s.servicio}». Ya estamos trabajando en ella y te responderemos lo antes posible, como máximo en 24 horas en día laborable.\n\n` +
      `Si quieres añadir algo, responde a este correo.\n\n` +
      `Gracias por confiar en nosotros.\nVERTIAN SOLUTIONS`,
  },
  en: {
    asunto: 'We have received your request · VERTIAN SOLUTIONS',
    texto: (s: Solicitud) =>
      `Hello ${s.nombre},\n\n` +
      `We have received your request about “${s.servicio}”. We are already working on it and will reply as soon as possible, within one working day at the latest.\n\n` +
      `If you would like to add anything, just reply to this email.\n\n` +
      `Thank you for your trust.\nVERTIAN SOLUTIONS`,
  },
};

// Texto recortado, sin saltos de línea donde no deben ir (evita inyectar cabeceras de correo).
const linea = (v: unknown, max: number) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
const texto = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export function validar(d: Record<string, unknown>): Solicitud | null {
  const s: Solicitud = {
    nombre: linea(d.nombre, 120),
    email: linea(d.email, 200).toLowerCase(),
    telefono: linea(d.telefono, 40),
    servicio: linea(d.servicio, 120),
    mensaje: texto(d.mensaje, 5000),
    pagina: linea(d.pagina, 80),
    idioma: d.idioma === 'en' ? 'en' : 'es',
  };
  if (!s.nombre || !s.servicio || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) || d.privacidad !== 'aceptada') return null;
  return s;
}

function cors(origen: string | null, permitidos: string[]) {
  const permitido = !permitidos.length ? '*' : origen && permitidos.includes(origen) ? origen : permitidos[0];
  return {
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, authorization, apikey, x-client-info',
    'Vary': 'Origin',
  };
}

export async function handle(req: Request, deps: Deps): Promise<Response> {
  const h = cors(req.headers.get('origin'), deps.origenes);
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { ...h, 'Content-Type': 'application/json' } });

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
  if (req.method !== 'POST') return json({ ok: false, error: 'metodo' }, 405);

  let d: Record<string, unknown>;
  try {
    d = await req.json();
  } catch {
    return json({ ok: false, error: 'json' }, 400);
  }

  // Trampa para bots: el campo oculto «web» solo lo rellenan programas automáticos.
  if (d.web) return json({ ok: true });

  const s = validar(d);
  if (!s) return json({ ok: false, error: 'datos' }, 400);

  if ((await deps.recientes(s.email)) >= LIMITE_POR_HORA) return json({ ok: false, error: 'limite' }, 429);

  await deps.guardar(s);

  // La solicitud ya está guardada: si falla un correo, se registra pero no se pierde nada.
  const correos: Correo[] = [
    {
      to: deps.avisos,
      replyTo: s.email,
      subject: `Nueva solicitud · ${s.servicio} · ${s.nombre}`,
      text:
        `Nombre: ${s.nombre}\nCorreo: ${s.email}\nTeléfono: ${s.telefono || '—'}\nServicio: ${s.servicio}\n` +
        `Página: ${s.pagina} (${s.idioma})\n\nMensaje:\n${s.mensaje || '—'}\n\n` +
        `Responde a este correo para contestar directamente al cliente.`,
    },
    {
      to: s.email,
      replyTo: deps.avisos,
      subject: CONFIRMACION[s.idioma].asunto,
      text: CONFIRMACION[s.idioma].texto(s),
    },
  ];
  const envios = await Promise.allSettled(correos.map(deps.enviar));
  envios.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`No se pudo enviar el correo ${i ? 'al cliente' : 'de aviso'}:`, r.reason);
  });

  return json({ ok: true });
}

if (import.meta.main) {
  const env = (k: string) => Deno.env.get(k) ?? '';
  const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
  const gmail = env('GMAIL_USER');
  // Gmail por SSL (puerto 465): Supabase no permite salir por el 587.
  const smtp = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gmail, pass: env('GMAIL_APP_PASSWORD').replace(/\s/g, '') },
  });

  const deps: Deps = {
    avisos: env('AVISOS') || gmail,
    origenes: env('ORIGENES').split(',').map((o) => o.trim()).filter(Boolean),
    recientes: async (email) => {
      const desde = new Date(Date.now() - 3600_000).toISOString();
      const { count, error } = await db.from('solicitudes').select('id', { count: 'exact', head: true }).eq('email', email).gte('creado', desde);
      if (error) throw error;
      return count ?? 0;
    },
    guardar: async (s) => {
      const { error } = await db.from('solicitudes').insert(s);
      if (error) throw error;
    },
    enviar: async (c) => {
      await smtp.sendMail({ from: `VERTIAN SOLUTIONS <${gmail}>`, ...c });
    },
  };

  Deno.serve(async (req) => {
    try {
      return await handle(req, deps);
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ ok: false, error: 'servidor' }), {
        status: 500,
        headers: { ...cors(req.headers.get('origin'), deps.origenes), 'Content-Type': 'application/json' },
      });
    }
  });
}
