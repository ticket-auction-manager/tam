import { db } from '$lib/server/db/index.js';
import { baskets } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const { prefix } = params;
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const req = await fetch(`${connStr}/api/baskets/${prefix}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!req.ok) throw error(req.status);
			const data = await req.json();
			return json(data);
		} catch {
			return json([]);
		}
	} else {
		const data = await db
			.select()
			.from(baskets)
			.where(eq(baskets.prefix, prefix))
			.orderBy(baskets.prefix, baskets.b_id);
		return json(data);
	}
};
