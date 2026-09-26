import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';

export const GET = async () => {
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/backuprestore`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = await res.json();
			return json(data);
		} catch {
			return json({});
		}
	} else {
		return json({});
	}
};

export const POST = async ({ request }) => {
	const resData = await request.json();
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		const res = await fetch(`${connStr}/api/backuprestore`, {
			method: 'POST',
			headers: { 'TAM-KEY': s.remote_key, 'Content-Type': 'application/json' },
			body: JSON.stringify(resData)
		});
		if (!res.ok) throw error(res.status);
		return json([]);
	}
};
