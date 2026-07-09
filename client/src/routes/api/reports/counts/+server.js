import { db } from '$lib/server/db';
import { reportCounts } from '$lib/server/db/schema';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';

export const GET = async () => {
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/reports/counts`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = await res.json();
			return json(data);
		} catch {
			return json([]);
		}
	} else {
		const data = await db.select().from(reportCounts);
		return json(data);
	}
};
