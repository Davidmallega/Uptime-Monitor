import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({ projectId: process.env.GOOGLE_CLOUD_PROJECT, databaseId: 'default' });
const COLECCION = 'urls';

export const urlsRepo = {
  listar: async () => {
    const snap = await db.collection(COLECCION).orderBy('creada', 'desc').get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  crear: async ({ url, nombre }) => {
    const doc = await db.collection(COLECCION).add({
      url: url.trim(),
      nombre: nombre?.trim() || url,
      creada: new Date().toISOString(),
      activa: true,
    });
    return { id: doc.id, url, nombre };
  },

  eliminar: async (id) => {
    await db.collection(COLECCION).doc(id).delete();
  },

  buscarPorId: async (id) => {
    const doc = await db.collection(COLECCION).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  // Solo las URLs activas (las que el scheduler debe monitorear).
  listarActivas: async () => {
    const snap = await db.collection(COLECCION).where('activa', '==', true).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};
