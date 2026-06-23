import { db } from '$lib/server/db/index.js';
import { tickets } from '$lib/server/db/schema.js';
import { getSettings, getPath } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const s = getSettings();
	const { prefix } = params;
	if (s.remote_server) {
		const connStr = getPath(s);
		try {
			const res = await fetch(`${connStr}/api/tickets/${prefix}`, {
				headers: { 'TAM-KEY': s.remote_key }
			});
			if (!res.ok) throw error(res.status);
			const data = await res.json();
			return json(data);
		} catch {
			return json([]);
		}
	} else {
		const data = await db.select().from(tickets).where(eq(tickets.prefix, prefix));
		return json(data);
	}
};
