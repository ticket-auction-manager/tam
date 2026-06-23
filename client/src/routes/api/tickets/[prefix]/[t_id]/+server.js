import { db } from '$lib/server/db/index.js';
import { tickets } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const s = getSettings();
	const { prefix, t_id } = params;
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/tickets/${prefix}/${t_id}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const [data] = await res.json();
			if (data) {
				return json(data);
			} else {
				return json({
					prefix,
					t_id,
					first_name: '',
					last_name: '',
					phone_number: '',
					pref: s.default_pref
				});
			}
		} catch {
			return json({
				prefix,
				t_id,
				first_name: '',
				last_name: '',
				phone_number: '',
				pref: s.default_pref
			});
		}
	} else {
		const [data] = await db
			.select()
			.from(tickets)
			.where(and(eq(tickets.prefix, prefix), eq(tickets.t_id, t_id)))
			.orderBy(tickets.prefix, tickets.t_id);
		if (data) {
			return json(data);
		} else {
			return json({
				prefix,
				t_id,
				first_name: '',
				last_name: '',
				phone_number: '',
				pref: s.default_pref
			});
		}
	}
};
