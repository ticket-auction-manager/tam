import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, primaryKey, sqliteView } from 'drizzle-orm/sqlite-core';

export const prefixes = sqliteTable('prefixes', {
	prefix: text('prefix').primaryKey(),
	color: text('color'),
	weight: integer('weight')
});

export const tickets = sqliteTable(
	'tickets',
	{
		prefix: text('prefix'),
		t_id: integer('t_id'),
		first_name: text('first_name'),
		last_name: text('last_name'),
		phone_number: text('phone_number'),
		pref: text('pref')
	},
	(t) => [primaryKey({ columns: [t.prefix, t.t_id] })]
);

export const baskets = sqliteTable(
	'baskets',
	{
		prefix: text('prefix'),
		b_id: integer('b_id'),
		description: text('description'),
		donors: text('donors'),
		winning_ticket: integer('winning_ticket')
	},
	(b) => [primaryKey({ columns: [b.prefix, b.b_id] })]
);

export const drawing = sqliteView('drawing', {
	prefix: text('prefix'),
	b_id: integer('b_id'),
	description: text('description'),
	winning_ticket: integer('winning_ticket'),
	last_name: text('last_name'),
	first_name: text('first_name'),
	phone_number: text('phone_number')
})
	.as(sql`SELECT b.prefix, b.b_id, b.description, b.winning_ticket, t.last_name, t.first_name, t.phone_number
  FROM baskets b LEFT JOIN tickets t ON b.prefix = t.prefix AND b.winning_ticket = t.t_id
  ORDER BY b.prefix, b.b_id`);

export const reportByName = sqliteView('report_by_name', {
	last_name: text('last_name'),
	first_name: text('first_name'),
	phone_number: text('phone_number'),
	pref: text('pref'),
	prefix: text('prefix'),
	b_id: integer('b_id'),
	description: text('description'),
	donors: text('donors'),
	winning_ticket: integer('winning_ticket')
})
	.as(sql`SELECT t.last_name, t.first_name, t.phone_number, t.pref, b.prefix, b.b_id, b.description, b.donors, b.winning_ticket
  FROM baskets b LEFT JOIN tickets t ON b.prefix = t.prefix AND b.winning_ticket = t.t_id
  ORDER BY t.last_name, t.first_name, t.phone_number, b.prefix, b.b_id`);

export const reportByBasket = sqliteView('report_by_basket', {
	prefix: text('prefix'),
	b_id: integer('b_id'),
	description: text('description'),
	donors: text('donors'),
	winning_ticket: integer('winning_ticket'),
	last_name: text('last_name'),
	first_name: text('first_name'),
	phone_number: text('phone_number'),
	pref: text('pref')
})
	.as(sql`SELECT b.prefix, b.b_id, b.description, b.donors, b.winning_ticket, t.last_name, t.first_name, t.phone_number, t.pref
  FROM baskets b LEFT JOIN tickets t on b.prefix = t.prefix AND b.winning_ticket = t.t_id
  ORDER BY b.prefix, b.b_id`);
