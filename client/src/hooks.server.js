import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';

export const init = async () => {
	env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
	env.BODY_SIZE_LIMIT = 'Infinity';
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
