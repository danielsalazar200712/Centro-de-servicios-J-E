/**
 * Cliente REST nativo para Supabase (PostgREST v1)
 * Conecta el Frontend de Centro de Servicios J&E con PostgreSQL en Supabase
 * usando VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY sin requerir paquetes pesados adicionales.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '')
  .trim()
  .replace(/\/rest\/v1\/?$/i, '')
  .replace(/\/$/, '');
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('TU_PROYECTO_ID') &&
  SUPABASE_URL.startsWith('http')
);

const getHeaders = (extra = {}) => {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...extra
  };
  if (SUPABASE_ANON_KEY.startsWith('eyJ')) {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  return headers;
};

export const supabaseRest = {
  isConfigured: isSupabaseConfigured,

  async selectAll(table, orderBy = 'created_at.desc') {
    if (!isSupabaseConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=${orderBy}`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.warn(`[Supabase] Error consultando ${table}:`, err.message);
      return null;
    }
  },

  async upsert(table, payload, onConflict = 'id') {
    if (!isSupabaseConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
        method: 'POST',
        headers: getHeaders({
          Prefer: 'resolution=merge-duplicates,return=representation'
        }),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.warn(`[Supabase] Error guardando en ${table}:`, err.message);
      return null;
    }
  },

  async update(table, id, payload) {
    if (!isSupabaseConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getHeaders({
          Prefer: 'return=representation'
        }),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.warn(`[Supabase] Error actualizando ${table}:`, err.message);
      return null;
    }
  },

  async remove(table, id) {
    if (!isSupabaseConfigured) return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.ok;
    } catch (err) {
      console.warn(`[Supabase] Error eliminando de ${table}:`, err.message);
      return false;
    }
  }
};
