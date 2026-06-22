import { getSettings } from "$lib/server/settings";

export const load = () => {
  const settings = getSettings();
  return { settings };
}
