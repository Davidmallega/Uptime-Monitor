// hooks/useTema.js
import { useState, useEffect } from 'react';

export function useTema() {
  const [oscuro, setOscuro] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  useEffect(() => {
    const html = document.documentElement;
    oscuro ? html.classList.add('dark') : html.classList.remove('dark');
  }, [oscuro]);
  return { oscuro, alternar: () => setOscuro((v) => !v) };
}
