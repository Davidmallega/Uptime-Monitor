// components/KpisGlobales.jsx
export function KpisGlobales({ kpis }) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 animate-pulse rounded-md bg-surface-2" />)}
      </div>
    );
  }

  const colorUptime = kpis.uptime_global >= 99 ? 'text-success'
                    : kpis.uptime_global >= 95 ? 'text-warning'
                    : 'text-error';

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <KpiCard etiqueta="Uptime global" valor={`${kpis.uptime_global ?? '—'}%`} acento={colorUptime} />
      <KpiCard etiqueta="Pings totales" valor={kpis.total_pings?.toLocaleString('es-CL') ?? '0'} />
      <KpiCard etiqueta="Latencia prom." valor={`${kpis.latencia_promedio ?? '—'} ms`} />
      <KpiCard etiqueta="Fallos (24h)" valor={kpis.fallos ?? 0} acento={kpis.fallos > 0 ? 'text-error' : ''} />
    </div>
  );
}

function KpiCard({ etiqueta, valor, acento }) {
  return (
    <div className="rounded-md border border-border bg-surface p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-text-muted">{etiqueta}</p>
      <p className={`mt-2 text-3xl font-semibold ${acento || 'text-text'}`}>{valor}</p>
    </div>
  );
}
