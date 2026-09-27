import { db } from '$lib/server/db/index.js';
import { tickets } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings/index.js';
import { error, json } from '@sveltejs/kit';
import { and, like, sql } from 'drizzle-orm';

const chunk_size = 300;

// A LIKE pattern that matches the text literally: the wildcard characters a
// user may type are escaped (see ESCAPE in the query).
const wild = (s) => '%' + s.replace(/[\\%_]/g, (c) => '\\' + c) + '%';

export const GET = async ({ url }) => {
	const sParams = {
		first_name: url.searchParams.get('first_name') || '',
		last_name: url.searchParams.get('last_name') || '',
		phone_number: url.searchParams.get('phone_number') || ''
	};
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		const strParams = new URLSearchParams(sParams).toString();
		try {
			const res = await fetch(`${connStr}/api/search/tickets?${strParams}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = await res.json();
			return json(data);
		} catch {
			return json([]);
		}
	} else {
		const data = await db
			.select()
			.from(tickets)
			.where(
				and(
					sql`${tickets.first_name} LIKE ${wild(sParams.first_name)} ESCAPE '\\'`,
					sql`${tickets.last_name} LIKE ${wild(sParams.last_name)} ESCAPE '\\'`,
					sql`${tickets.phone_number} LIKE ${wild(sParams.phone_number)} ESCAPE '\\'`,
				)
			)
			.orderBy(tickets.prefix, tickets.t_id);
		return json(data);
	}
};

export const POST = async ({ request }) => {
	const reqData = await request.json();
	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		const res = await fetch(`${connStr}/api/search/tickets`, {
			method: 'POST',
			headers: { 'TAM-KEY': s.remote_key, 'Content-Type': 'application/json' },
			body: JSON.stringify(reqData)
		});
		if (!res.ok) throw error(res.status);
	}
	for (let i = 0; i < reqData.length; i += chunk_size) {
		await db
			.insert(tickets)
			.values(reqData.slice(i, i + chunk_size))
			.onConflictDoUpdate({
				target: [tickets.prefix, tickets.t_id],
				set: {
					first_name: sql`EXCLUDED.first_name`,
					last_name: sql`EXCLUDED.last_name`,
					phone_number: sql`EXCLUDED.phone_number`,
					pref: sql`EXCLUDED.pref`
				}
			});
	}
	return json(reqData);
};
