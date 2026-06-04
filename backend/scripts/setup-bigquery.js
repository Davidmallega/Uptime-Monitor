// scripts/setup-bigquery.js
// Crea el dataset y la tabla de pings en BigQuery. Se corre UNA vez.

import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery();
const DATASET_ID = process.env.DATASET_ID || 'uptime';
const TABLE_ID = process.env.TABLE_ID || 'pings';

const ESQUEMA = [
  { name: 'url_id', type: 'STRING', mode: 'REQUIRED' },
  { name: 'url', type: 'STRING', mode: 'REQUIRED' },
  { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
  { name: 'status_code', type: 'INTEGER', mode: 'NULLABLE' },
  { name: 'latencia_ms', type: 'INTEGER', mode: 'NULLABLE' },
  { name: 'exitoso', type: 'BOOLEAN', mode: 'REQUIRED' },
  { name: 'error', type: 'STRING', mode: 'NULLABLE' },
];

async function main() {
  console.log(`\n📊 Configurando BigQuery: ${DATASET_ID}.${TABLE_ID}\n`);

  // 1. Crear dataset si no existe.
  const [datasets] = await bigquery.getDatasets();
  if (!datasets.some((d) => d.id === DATASET_ID)) {
    console.log(`📦 Creando dataset "${DATASET_ID}"...`);
    await bigquery.createDataset(DATASET_ID, { location: 'us-central1' });
  } else {
    console.log(`📦 Dataset "${DATASET_ID}" ya existe.`);
  }

  // 2. Crear tabla si no existe.
  const dataset = bigquery.dataset(DATASET_ID);
  const [tablas] = await dataset.getTables();
  if (tablas.some((t) => t.id === TABLE_ID)) {
    console.log(`✓ Tabla "${TABLE_ID}" ya existe. No la tocamos para preservar datos.`);
  } else {
    console.log(`🛠️  Creando tabla "${TABLE_ID}" particionada por día...`);
    await dataset.createTable(TABLE_ID, {
      schema: ESQUEMA,
      // Partición por DÍA: optimiza queries que filtren por rango temporal,
      // que es exactamente lo que hace un uptime monitor.
      timePartitioning: { type: 'DAY', field: 'timestamp' },
    });
  }

  console.log(`\n✅ Listo. Ya puedes arrancar la API y el scheduler.\n`);
}

main().catch((err) => {
  console.error('❌ Error en el setup:', err.message);
  process.exit(1);
});
