import { getSettings, getPath } from '$lib/server/settings';
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tickets } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export const GET = async () => {
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/tickets`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = await res.json();
			return json(data);
		} catch {
			return json([]);
		}
	} else {
		const data = await db.select().from(tickets).orderBy(tickets.prefix, tickets.t_id);
		return json(data);
	}
};

export const POST = async ({ request }) => {
	const reqData = await request.json();
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		const res = await fetch(`${connStr}/api/tickets`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'TAM-KEY': s.remote_key },
			body: JSON.stringify(reqData)
		});
		if (!res.ok) throw error(res.status);
	}
	await db
		.insert(tickets)
		.values(reqData)
		.onConflictDoUpdate({
			target: [tickets.prefix, tickets.t_id],
			set: {
				first_name: sql`EXCLUDED.first_name`,
				last_name: sql`EXCLUDED.last_name`,
				phone_number: sql`EXCLUDED.phone_number`,
				pref: sql`EXCLUDED.pref`
			}
		});
	return json(reqData);
};
