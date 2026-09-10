import { db } from '$lib/server/db';
import { env } from '$env/dynamic/public';
import { randomUUID } from 'crypto';

export const init = async () => {
  env.PUBLIC_TAM_CLIENT_ID = randomUUID();
	await db.run(`CREATE TABLE IF NOT EXISTS baskets (
    prefix text,
    b_id integer,
    description text,
    donors text,
    winning_ticket integer,
    PRIMARY KEY(prefix, b_id)
	)`);
	await db.run(`CREATE TABLE IF NOT EXISTS prefixes (
	prefix text PRIMARY KEY NOT NULL,
	color text,
	weight integer
  )`);
	await db.run(`CREATE TABLE IF NOT EXISTS tickets (
	prefix text,
	t_id integer,
	first_name text,
	last_name text,
	phone_number text,
	pref text,
	PRIMARY KEY(prefix, t_id)
  )`);
	await db.run(`CREATE VIEW IF NOT EXISTS drawing AS SELECT b.prefix, b.b_id, b.description, b.winning_ticket, t.last_name, t.first_name, t.phone_number
    FROM baskets b LEFT JOIN tickets t ON b.prefix = t.prefix AND b.winning_ticket = t.t_id
    ORDER BY b.prefix, b.b_id`);
	await db.run(`CREATE VIEW IF NOT EXISTS report_by_basket AS SELECT b.prefix, b.b_id, b.description, b.donors, b.winning_ticket, t.last_name, t.first_name, t.phone_number, t.pref
    FROM baskets b LEFT JOIN tickets t on b.prefix = t.prefix AND b.winning_ticket = t.t_id
    ORDER BY b.prefix, b.b_id`);
	await db.run(`CREATE VIEW IF NOT EXISTS report_by_name AS SELECT t.last_name, t.first_name, t.phone_number, t.pref, b.prefix, b.b_id, b.description, b.donors, b.winning_ticket
    FROM baskets b LEFT JOIN tickets t ON b.prefix = t.prefix AND b.winning_ticket = t.t_id
    ORDER BY t.last_name, t.first_name, t.phone_number, b.prefix, b.b_id`);
	await db.run(`CREATE VIEW IF NOT EXISTS report_counts AS SELECT prefix, COUNT(DISTINCT(CONCAT(first_name, last_name, phone_number))) AS unique_buyers, COUNT(*) AS total_buys
    FROM tickets
    GROUP BY prefix
    UNION ALL
    SELECT 'Total', COUNT(DISTINCT(CONCAT(first_name, last_name, phone_number))), COUNT(*)
    FROM tickets`);
};

export const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api')) {
    const clientID = event.request.headers.get('TAM-CLIENT-ID');
    if (env.PUBLIC_TAM_CLIENT_ID == clientID) {
      const response = await resolve(event);
      return response;
    } else {
      return new Response(JSON.stringify({detail: "Unauthorized"}), { status: 401 })
    }
  } else {
    const response = await resolve(event);
    return response;
  }
}

export const handleFetch = async ({ request, fetch }) => {
  request.headers.set('TAM-CLIENT-ID', env.PUBLIC_TAM_CLIENT_ID);
  return fetch(request);
}
