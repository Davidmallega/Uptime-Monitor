// controllers/dashboardController.js
// Sirve los datos del dashboard combinando Firestore (lista de URLs) con
// BigQuery (analíticas históricas).

import { urlsRepo } from '../services/urlsRepo.js';
import { pingsRepo } from '../services/pingsRepo.js';

// GET /api/dashboard
// Devuelve KPIs globales + lista de URLs con sus métricas de las últimas 24h.
export async function dashboard(req, res) {
  try {
    const horas = Number(req.query.horas) || 24;

    // Las tres llamadas en paralelo: dos a BigQuery, una a Firestore.
    const [kpis, resumen, urls] = await Promise.all([
      pingsRepo.kpisGlobales(horas),
      pingsRepo.resumenPorUrl(horas),
      urlsRepo.listar(),
    ]);

    // Combinamos: cada URL configurada lleva pegado su resumen (si hay pings).
    const urlsConMetricas = urls.map((url) => {
      const metricas = resumen.find((r) => r.url_id === url.id);
      return {
        ...url,
        uptime_pct: metricas?.uptime_pct ?? null,
        latencia_promedio: metricas?.latencia_promedio ?? null,
        total_pings: metricas?.total_pings ?? 0,
        ultimo_ping: metricas?.ultimo_ping ?? null,
      };
    });

    res.status(200).json({
      kpis,
      urls: urlsConMetricas,
      ventana_horas: horas,
    });
  } catch (error) {
    console.error('Error en dashboard:', error.message);
    res.status(500).json({ error: 'No se pudo cargar el dashboard.' });
  }
}

// GET /api/dashboard/urls/:id/historico
// Detalle de una URL: lista de pings recientes para graficar.
export async function historico(req, res) {
  try {
    const horas = Number(req.query.horas) || 24;
    const historial = await pingsRepo.historicoPorUrl(req.params.id, horas);
    res.status(200).json({ historial });
  } catch (error) {
    console.error('Error en histórico:', error.message);
    res.status(500).json({ error: 'No se pudo cargar el histórico.' });
  }
}
