// controllers/urlsController.js
import { urlsRepo } from '../services/urlsRepo.js';

export async function listar(req, res) {
  try {
    const urls = await urlsRepo.listar();
    res.status(200).json({ urls });
  } catch (error) {
    console.error('Error al listar URLs:', error.message);
    res.status(500).json({ error: 'No se pudieron listar las URLs.' });
  }
}

export async function crear(req, res) {
  try {
    const { url, nombre } = req.body;
    if (!url || !/^https?:\/\/.+\..+/.test(url)) {
      return res.status(400).json({ error: 'URL inválida. Debe empezar con http:// o https://' });
    }
    const nueva = await urlsRepo.crear({ url, nombre });
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear URL:', error.message);
    res.status(500).json({ error: 'No se pudo crear la URL.' });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const existe = await urlsRepo.buscarPorId(id);
    if (!existe) return res.status(404).json({ error: 'URL no encontrada.' });
    await urlsRepo.eliminar(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar URL:', error.message);
    res.status(500).json({ error: 'No se pudo eliminar.' });
  }
}
