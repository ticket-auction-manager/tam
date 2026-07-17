import { db } from '$lib/server/db/index.js';
import { baskets, prefixes, tickets } from '$lib/server/db/schema';
import { getPath, getSettings } from '$lib/server/settings/index.js';
import { error } from '@sveltejs/kit';

export const HEAD = async ({ params }) => {
	const target = params.target;
	const pushData = {};
	if (target === 'prefixes') {
		pushData.prefixes = await db.select().from(prefixes);
	} else if (target === 'tickets') {
		pushData.tickets = await db.select().from(tickets);
	} else if (target === 'baskets') {
		pushData.baskets = await db.select().from(baskets);
	} else {
		throw error(400, 'Can only push prefixes, tickets, or baskets.');
	}

	const s = getSettings();
	if (s.remote_server) {
		const connStr = getPath(s);
		const res = await fetch(`${connStr}/api/backuprestore`, {
			method: 'POST',
			headers: { 'TAM-KEY': s.remote_key, 'Content-Type': 'application/json' },
			body: JSON.stringify(pushData)
		});
		if (!res.ok) throw error(res.status, res.statusText);
		return new Response(null, { status: 200, statusText: 'Data pushed successfully.' });
	} else {
		throw error(500, 'Server not set.');
	};
};
