import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

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
