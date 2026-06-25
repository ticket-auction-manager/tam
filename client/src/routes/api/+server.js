import { getSettings, getPath } from '$lib/server/settings';
import { json, error } from '@sveltejs/kit';

export const GET = async () => {
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = await res.json();
			return json(data);
		} catch {
			const data = { whoami: 'TAM Server', authenticated: false, healthy: false };
			return json(data);
		}
	} else {
		const data = { whoami: 'TAM Client' };
		return json(data);
	}
};
