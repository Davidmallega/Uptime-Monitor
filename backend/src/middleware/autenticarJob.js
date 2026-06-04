// Token compartido: solo Cloud Scheduler conoce el valor enviado en X-Job-Token.
let TOKEN_ESPERADO = null;

export function configurar(token) {
  TOKEN_ESPERADO = token;
}

export function autenticarJob(req, res, next) {
  if (!TOKEN_ESPERADO) {
    // El backend arrancó sin token: rechazo todo por seguridad.
    return res.status(503).json({ error: 'Servicio sin token de jobs configurado.' });
  }
  const enviado = req.headers['x-job-token'];
  if (enviado !== TOKEN_ESPERADO) {
    return res.status(403).json({ error: 'Token de job inválido.' });
  }
  next();
}
