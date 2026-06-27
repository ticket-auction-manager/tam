import { db } from '$lib/server/db/index.js';
import { drawing } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

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
	const [prefix, b_id] = [params.prefix, parseInt(params.b_id)];
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/drawing/${prefix}/${b_id}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const [data] = await res.json();
			if (data) {
				return json(data);
			} else {
				return json(placeholder_data(prefix, b_id));
			}
		} catch {
			return json(placeholder_data(prefix, b_id));
		}
	} else {
		const [data] = await db
			.select()
			.from(drawing)
			.where(and(eq(drawing.prefix, prefix), eq(drawing.b_id, b_id)))
			.orderBy(drawing.prefix, drawing.b_id);
		if (data) {
			return json(data);
		} else {
			return json(placeholder_data(prefix, b_id));
		}
	}
};
