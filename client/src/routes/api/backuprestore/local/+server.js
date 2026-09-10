import { db } from '$lib/server/db';
import { baskets, prefixes, tickets } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

const chunk_size = 300;

export const GET = async () => {
	const data = {};
	data.prefixes = await db.select().from(prefixes);
	data.baskets = await db.select().from(baskets);
	data.tickets = await db.select().from(tickets);
	return json(data);
};

export const POST = async ({ request }) => {
	const reqData = await request.json();
	if (reqData.prefixes) {
  	for (let i = 0; i < reqData.prefixes.length; i += chunk_size) {
  		const chunk = reqData.prefixes.slice(i, i + chunk_size);
  		await db
  			.insert(prefixes)
  			.values(chunk)
  			.onConflictDoUpdate({
  				target: prefixes.prefix,
  				set: { color: sql`EXCLUDED.color`, weight: sql`EXCLUDED.weight` }
  			});
  	};
	};
	if (reqData.baskets) {
  	for (let i = 0; i < reqData.baskets.length; i += chunk_size) {
  		const chunk = reqData.baskets.slice(i, i + chunk_size);
  		await db
  			.insert(baskets)
  			.values(chunk)
  			.onConflictDoUpdate({
  				target: [baskets.prefix, baskets.b_id],
  				set: {
  					description: sql`EXCLUDED.description`,
  					donors: sql`EXCLUDED.donors`,
  					winning_ticket: sql`EXCLUDED.winning_ticket`
  				}
  			});
  	};
	};
	if (reqData.tickets) {
  	for (let i = 0; i < reqData.tickets.length; i += chunk_size) {
  		const chunk = reqData.tickets.slice(i, i + chunk_size);
  		await db
  			.insert(tickets)
  			.values(chunk)
  			.onConflictDoNothing({
  				target: [tickets.prefix, tickets.t_id],
  				set: {
  					first_name: sql`EXCLUDED.first_name`,
  					last_name: sql`EXCLUDED.last_name`,
  					phone_number: sql`EXCLUDED.phone_number`,
  					pref: sql`EXCLUDED.pref`
  				}
  			});
  	};
	};
	return json({ details: 'Data loaded successfully.' });
};
