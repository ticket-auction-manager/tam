import { db } from '$lib/server/db/index.js';
import { tickets } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { and, between, eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const s = getSettings();
	const { prefix } = params,
		[id_from, id_to] = [parseInt(params.id_from), parseInt(params.id_to)];
	const rtnData = {};
	for (let i = id_from; i <= id_to; i++) {
		rtnData[i] = {
			prefix,
			t_id: i,
			first_name: '',
			last_name: '',
			phone_number: '',
			pref: s.default_pref
		};
	}
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/tickets/${prefix}/${id_from}/${id_to}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = Array.from(await res.json());
			data.forEach((t) => (rtnData[t.t_id] = t));
		} catch {
			return json([]);
		}
  } else {
    const data = await db.select().from(tickets).where(and(eq(tickets.prefix, prefix), between(tickets.t_id, id_from, id_to))).orderBy(tickets.prefix, tickets.t_id);
		data.forEach((t) => (rtnData[t.t_id] = t));
	}
	return json(Object.values(rtnData));
};
