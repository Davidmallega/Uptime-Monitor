// hooks/useDashboard.js
// Carga el dashboard y se autoactualiza cada 60 segundos para que el usuario
// vea cuando llegan nuevos pings sin tener que recargar.
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

const AUTOREFRESH_MS = 60_000;

export function useDashboard() {
  const [kpis, setKpis] = useState(null);
  const [urls, setUrls] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setError(null);
      const datos = await api.dashboard();
      setKpis(datos.kpis);
      setUrls(datos.urls);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, AUTOREFRESH_MS);
    return () => clearInterval(intervalo);
  }, [cargar]);

  const agregarUrl = async (datos) => {
    await api.crearUrl(datos);
    await cargar();
  };

  const eliminarUrl = async (id) => {
    await api.eliminarUrl(id);
    await cargar();
  };

  return { kpis, urls, cargando, error, cargar, agregarUrl, eliminarUrl };
}
