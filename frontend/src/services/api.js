// services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE = `${API_URL}/api`;

async function manejarRespuesta(r) {
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.error || `Error HTTP ${r.status}`);
  }
  if (r.status === 204) return null;
  return r.json();
}

export const api = {
  // Dashboard (KPIs + lista con métricas)
  dashboard: () => fetch(`${BASE}/dashboard`).then(manejarRespuesta),

  // Histórico de una URL
  historico: (id) => fetch(`${BASE}/dashboard/urls/${id}/historico`).then(manejarRespuesta),

  // Gestión de URLs
  crearUrl: (datos) => fetch(`${BASE}/urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }).then(manejarRespuesta),

  eliminarUrl: (id) => fetch(`${BASE}/urls/${id}`, { method: 'DELETE' }).then(manejarRespuesta),
};
