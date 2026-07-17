import { getSettings } from "$lib/server/settings/index.js"

export const load = async () => {
  const s = getSettings();
  return { remoteServer: s.remote_server };
}
