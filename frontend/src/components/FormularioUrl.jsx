// components/FormularioUrl.jsx
import { useState } from 'react';

export function FormularioUrl({ onAgregar }) {
  const [url, setUrl] = useState('');
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    if (!/^https?:\/\/.+\..+/.test(url)) {
      return setError('URL inválida. Debe empezar con http:// o https://');
    }
    try {
      setEnviando(true);
      await onAgregar({ url: url.trim(), nombre: nombre.trim() });
      setUrl('');
      setNombre('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const inputClase = 'w-full rounded-sm border border-border bg-surface px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

  return (
    <form onSubmit={enviar} className="rounded-md border border-border bg-surface p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Agregar sitio a monitorear</h2>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_auto]">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://tu-sitio.com"
          className={inputClase}
        />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre (opcional)"
          className={inputClase}
        />
        <button
          type="submit"
          disabled={enviando || !url}
          className="rounded-sm bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? '...' : 'Agregar'}
        </button>
      </div>
      {error && (
        <p className="mt-2 rounded-sm bg-error-bg px-3 py-1.5 text-xs text-error">{error}</p>
      )}
    </form>
  );
}
