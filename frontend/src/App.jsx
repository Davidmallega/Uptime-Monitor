import { useDashboard } from './hooks/useDashboard.js';
import { useTema } from './hooks/useTema.js';
import { KpisGlobales } from './components/KpisGlobales.jsx';
import { TarjetaUrl } from './components/TarjetaUrl.jsx';
import { FormularioUrl } from './components/FormularioUrl.jsx';

export default function App() {
  const { kpis, urls, cargando, error, cargar, agregarUrl, eliminarUrl } = useDashboard();
  const { oscuro, alternar } = useTema();

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-600 text-lg text-white">
              🏥
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Uptime Monitor</h1>
              <p className="font-mono text-xs text-text-muted">Cloud Scheduler</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-text-muted sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Pingea cada 15 min
            </span>
            <button onClick={cargar} className="rounded-md border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2">
              ↻
            </button>
            <button
              onClick={alternar}
              className="rounded-md border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2"
            >
              {oscuro ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {error && (
          <div className="rounded-md border border-error/30 bg-error-bg p-4 text-sm text-error">
            {error}
          </div>
        )}

        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
            Últimas 24h
          </h2>
          <KpisGlobales kpis={kpis} />
        </section>

        <FormularioUrl onAgregar={agregarUrl} />

        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
            Sitios monitoreados {!cargando && `(${urls.length})`}
          </h2>

          {cargando ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => <div key={i} className="h-44 animate-pulse rounded-md bg-surface-2" />)}
            </div>
          ) : urls.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-surface py-16 text-center">
              <div className="mb-3 text-4xl">🌐</div>
              <p className="text-sm font-medium">Aún no hay sitios monitoreados</p>
              <p className="mt-1 text-xs text-text-muted">Agrega tu primera URL arriba.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {urls.map((url) => (
                <TarjetaUrl key={url.id} url={url} onEliminar={eliminarUrl} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
