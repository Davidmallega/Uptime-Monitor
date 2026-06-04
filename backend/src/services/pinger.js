const TIMEOUT_MS = 10_000;

export async function pingear(url) {
  const inicio = Date.now();
  try {
    // AbortController con timeout — evita que una URL caída cuelgue el job entero.
    const controlador = new AbortController();
    const timeoutId = setTimeout(() => controlador.abort(), TIMEOUT_MS);

    const respuesta = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controlador.signal,
      headers: { 'User-Agent': 'Uptime-Monitor/1.0' },
    });
    clearTimeout(timeoutId);

    const latencia = Date.now() - inicio;
    // 2xx y 3xx son exitosos — la URL respondió aunque redirija.
    const exitoso = respuesta.status < 400;

    return {
      status_code: respuesta.status,
      latencia_ms: latencia,
      exitoso,
      error: null,
    };
  } catch (error) {
    return {
      status_code: null,
      latencia_ms: Date.now() - inicio,
      exitoso: false,
      error: error.name === 'AbortError' ? 'Timeout (10s)' : error.message,
    };
  }
}
