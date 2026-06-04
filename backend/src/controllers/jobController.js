import { urlsRepo } from '../services/urlsRepo.js';
import { pingsRepo } from '../services/pingsRepo.js';
import { pingear } from '../services/pinger.js';

// Protegido por el middleware autenticarJob.
export async function pingearTodas(req, res) {
  const inicioJob = Date.now();
  try {
    const urls = await urlsRepo.listarActivas();
    if (urls.length === 0) {
      return res.status(200).json({ mensaje: 'No hay URLs activas.', total: 0 });
    }

    console.log(`🏥 Job: pingeando ${urls.length} URL(s) en paralelo...`);

    // Promise.all: todas las URLs en paralelo — 10 URLs tardan lo que la más lenta, no 10×.
    const timestamp = new Date().toISOString();
    const resultados = await Promise.all(
      urls.map(async (urlDoc) => {
        const ping = await pingear(urlDoc.url);
        return {
          url_id: urlDoc.id,
          url: urlDoc.url,
          timestamp,
          ...ping,
        };
      })
    );

    await pingsRepo.insertarLote(resultados);

    const exitosos = resultados.filter((r) => r.exitoso).length;
    const fallos = resultados.length - exitosos;
    const duracion = Date.now() - inicioJob;
    console.log(`   ✓ ${exitosos} OK | ✗ ${fallos} fallidos | ⏱  ${duracion}ms`);

    res.status(200).json({
      total: resultados.length,
      exitosos,
      fallos,
      duracion_ms: duracion,
    });
  } catch (error) {
    console.error('❌ Error en el job:', error.message);
    res.status(500).json({ error: 'Error al ejecutar el job.' });
  }
}
