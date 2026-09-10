import { env } from "$env/dynamic/public"

export const load = async () => {
  const tamClientID = `${env.PUBLIC_TAM_CLIENT_ID}`;
  return { tamClientID }
}
