// components/TarjetaUrl.jsx
// Tarjeta tipo "status page": semáforo según uptime, métricas y acciones.

function formatearTiempoRelativo(timestamp) {
  if (!timestamp) return 'sin pings aún';
  const fecha = new Date(timestamp.value || timestamp);
  const minutos = Math.round((Date.now() - fecha.getTime()) / 60000);
  if (minutos < 1) return 'hace segundos';
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  return fecha.toLocaleDateString('es-CL');
}

function colorUptime(pct) {
  if (pct === null || pct === undefined) return 'text-text-subtle';
  if (pct >= 99) return 'text-success';
  if (pct >= 95) return 'text-warning';
  return 'text-error';
}

function semaforo(pct) {
  if (pct === null || pct === undefined) return 'bg-text-subtle';
  if (pct >= 99) return 'bg-success';
  if (pct >= 95) return 'bg-warning';
  return 'bg-error';
}

export function TarjetaUrl({ url, onEliminar }) {
  return (
    <div className="rounded-md border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`h-3 w-3 flex-shrink-0 rounded-full ${semaforo(url.uptime_pct)} ${url.uptime_pct >= 99 ? 'animate-pulse' : ''}`} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{url.nombre}</h3>
            <p className="truncate font-mono text-xs text-text-muted">{url.url}</p>
          </div>
        </div>
        <button
          onClick={() => onEliminar(url.id)}
          className="rounded p-1 text-xs text-text-subtle transition-colors hover:bg-error-bg hover:text-error"
          aria-label="Eliminar"
        >
          🗑
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-subtle">Uptime 24h</p>
          <p className={`text-lg font-semibold ${colorUptime(url.uptime_pct)}`}>
            {url.uptime_pct !== null ? `${url.uptime_pct}%` : '—'}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-subtle">Latencia</p>
          <p className="text-lg font-semibold">
            {url.latencia_promedio ? `${url.latencia_promedio}ms` : '—'}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-subtle">Pings</p>
          <p className="text-lg font-semibold">{url.total_pings || 0}</p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-text-subtle">
        Último ping {formatearTiempoRelativo(url.ultimo_ping)}
      </p>
    </div>
  );
}
