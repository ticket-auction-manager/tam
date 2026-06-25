import { db } from '$lib/server/db/index.js';
import { baskets } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { and, between, eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const s = getSettings();
	const [prefix, id_from, id_to] = [
		params.prefix,
		parseInt(params.id_from),
		parseInt(params.id_to)
	];
	const rtnData = {};
	for (let i = id_from; i <= id_to; i++) {
		rtnData[i] = { prefix, b_id: i, description: '', donors: '', winning_ticket: 0 };
	}
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/baskets/${prefix}/${id_from}/${id_to}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = Array.from(await res.json());
			data.forEach((b) => (rtnData[b.b_id] = b));
		} catch {
			return json([]);
		}
	} else {
		const data = await db
			.select()
			.from(baskets)
			.where(and(eq(baskets.prefix, prefix), between(baskets.b_id, id_from, id_to)))
			.orderBy(baskets.prefix, baskets.b_id);
		data.forEach((b) => (rtnData[b.b_id] = b));
	}
	return json(Object.values(rtnData));
};
