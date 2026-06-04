import express from 'express';
import cors from 'cors';
import { leerSecreto } from './src/services/secretos.js';
import { configurar as configurarJob } from './src/middleware/autenticarJob.js';
import router from './src/routes/index.js';

const app = express();

const origenesPermitidos = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://uptime-monitor-3d060.web.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origenesPermitidos.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ estado: 'ok', servicio: 'uptime-api' });
});

app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Token leído una vez al arrancar — si falla, el proceso termina inmediatamente.
const PORT = process.env.PORT || 8080;
const NOMBRE_SECRETO_TOKEN = process.env.NOMBRE_SECRETO_TOKEN || 'uptime-job-token';

async function arrancar() {
  try {
    console.log(`🔐 Leyendo "${NOMBRE_SECRETO_TOKEN}" desde Secret Manager...`);
    const token = await leerSecreto(NOMBRE_SECRETO_TOKEN);
    configurarJob(token);
    console.log(`✅ Token del job cargado (${token.length} caracteres, no se mostrará).`);

    app.listen(PORT, () => {
      console.log(`🏥 Uptime Monitor API corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo cargar el token:', error.message);
    console.error('   ¿Existe el secreto y la cuenta tiene permiso?');
    process.exit(1);
  }
}

arrancar();
