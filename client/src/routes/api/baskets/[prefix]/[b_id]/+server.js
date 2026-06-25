import { db } from '$lib/server/db/index.js';
import { baskets } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const [prefix, b_id] = [params.prefix, parseInt(params.b_id)];
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/tickets/${prefix}/${b_id}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const [data] = await res.json();
			if (data) {
				return json(data);
			} else {
				return json({ prefix, b_id, description: '', donors: '', winning_ticket: 0 });
			}
		} catch {
			return json({ prefix, b_id, description: '', donors: '', winning_ticket: 0 });
		}
	} else {
		const [data] = await db
			.select()
			.from(baskets)
			.where(and(eq(baskets.prefix, prefix), eq(baskets.b_id, b_id)))
			.orderBy(baskets.prefix, baskets.b_id);
		if (data) {
			return json(data);
		} else {
			return json({ prefix, b_id, descrption: '', donors: '', winning_ticket: 0 });
		}
	}
};
