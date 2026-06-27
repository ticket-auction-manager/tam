import { db } from '$lib/server/db/index.js';
import { drawing } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { and, between, eq } from 'drizzle-orm';

const placeholder_data = (prefix, b_id) => {
	return {
		prefix,
		b_id,
		description: '',
		winning_ticket: 0,
		last_name: '',
		first_name: '',
		phone_number: ''
	};
};

export const GET = async ({ params }) => {
	const [prefix, id_from, id_to] = [
		params.prefix,
		parseInt(params.id_from),
		parseInt(params.id_to)
	];
	const s = getSettings();
	const rtnData = {};
	for (let i = id_from; i <= id_to; i++) {
		rtnData[i] = { ...placeholder_data(prefix, i) };
	}
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/drawing/${prefix}/${id_from}/${id_to}`, {
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
			.from(drawing)
			.where(and(eq(drawing.prefix, prefix), between(drawing.b_id, id_from, id_to)))
			.orderBy(drawing.prefix, drawing.b_id);
		data.forEach((b) => (rtnData[b.b_id] = b));
	}
	return json(Object.values(rtnData));
};
