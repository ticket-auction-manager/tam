import { db } from '$lib/server/db';
import { baskets } from '$lib/server/db/schema';
import { getSettings, getPath } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET = async () => {
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/baskets`, { headers: { 'TAM-KEY': s.remote_key } });
			if (!res.ok) throw error(res.status);
			const data = await res.json();
			return json(data);
		} catch {
			return json([]);
		}
	} else {
		const data = await db.select().from(baskets).orderBy(baskets.prefix, baskets.b_id);
		return json(data);
	}
};

export const POST = async ({ request }) => {
	const reqData = await request.json();
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		const res = await fetch(`${connStr}/api/baskets`, {
			method: 'POST',
			headers: { 'TAM-KEY': s.remote_key, 'Content-Type': 'application/json' },
			body: JSON.stringify(reqData)
		});
		if (!res.ok) throw error(res.status);
	}
	await db
		.insert(baskets)
		.values(reqData)
		.onConflictDoUpdate({
			target: [baskets.prefix, baskets.b_id],
			set: { description: sql`EXCLUDED.description`, donors: sql`EXCLUDED.donors` }
		});
	return json(reqData);
};
