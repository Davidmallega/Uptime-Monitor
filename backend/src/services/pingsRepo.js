import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery();
const DATASET_ID = process.env.DATASET_ID || 'uptime';
const TABLE_ID = process.env.TABLE_ID || 'pings';

const tablaCompleta = () =>
  `\`${process.env.GOOGLE_CLOUD_PROJECT}.${DATASET_ID}.${TABLE_ID}\``;

const tabla = () => bigquery.dataset(DATASET_ID).table(TABLE_ID);

export const pingsRepo = {
  insertarLote: async (pings) => {
    if (pings.length === 0) return;
    await tabla().insert(pings);
  },

  historicoPorUrl: async (urlId, horas = 24) => {
    const query = `
      SELECT timestamp, status_code, latencia_ms, exitoso, error
      FROM ${tablaCompleta()}
      WHERE url_id = @urlId
        AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @horas HOUR)
      ORDER BY timestamp DESC
      LIMIT 200
    `;
    const [filas] = await bigquery.query({
      query,
      params: { urlId, horas },
    });
    return filas;
  },

  resumenPorUrl: async (horas = 24) => {
    const query = `
      SELECT
        url_id,
        url,
        COUNT(*) AS total_pings,
        COUNTIF(exitoso) AS pings_exitosos,
        ROUND(SAFE_DIVIDE(COUNTIF(exitoso), COUNT(*)) * 100, 2) AS uptime_pct,
        ROUND(AVG(IF(exitoso, latencia_ms, NULL)), 0) AS latencia_promedio,
        MAX(timestamp) AS ultimo_ping
      FROM ${tablaCompleta()}
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @horas HOUR)
      GROUP BY url_id, url
    `;
    const [filas] = await bigquery.query({
      query,
      params: { horas },
    });
    return filas;
  },

  kpisGlobales: async (horas = 24) => {
    const query = `
      SELECT
        COUNT(*) AS total_pings,
        COUNTIF(exitoso) AS exitosos,
        COUNTIF(NOT exitoso) AS fallos,
        ROUND(SAFE_DIVIDE(COUNTIF(exitoso), COUNT(*)) * 100, 2) AS uptime_global,
        ROUND(AVG(IF(exitoso, latencia_ms, NULL)), 0) AS latencia_promedio
      FROM ${tablaCompleta()}
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @horas HOUR)
    `;
    const [filas] = await bigquery.query({ query, params: { horas } });
    return filas[0] || null;
  },
};
