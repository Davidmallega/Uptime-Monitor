import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();
const cache = new Map();

export async function leerSecreto(nombre, version = 'latest') {
  const clave = `${nombre}:${version}`;
  if (cache.has(clave)) return cache.get(clave);

  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) throw new Error('Falta GOOGLE_CLOUD_PROJECT.');

  const path = `projects/${projectId}/secrets/${nombre}/versions/${version}`;
  const [respuesta] = await client.accessSecretVersion({ name: path });
  const valor = respuesta.payload.data.toString('utf8');

  cache.set(clave, valor);
  return valor;
}
