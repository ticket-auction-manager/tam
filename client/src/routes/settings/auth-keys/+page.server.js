import { getSettings } from '$lib/server/settings';

export const load = () => {
	const s = getSettings();
	return { authKey: s.remote_key };
};
