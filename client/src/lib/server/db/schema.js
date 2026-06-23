import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const prefixes = sqliteTable('prefixes', {
  prefix: text('prefix').primaryKey(),
  color: text('color'),
  weight: integer('weight')
});

export const tickets = sqliteTable('tickets', {
  prefix: text('prefix'),
  t_id: integer('t_id'),
  first_name: text('first_name'),
  last_name: text('last_name'),
  phone_number: text('phone_number'),
  pref: text('pref')
}, (t) => [primaryKey({columns: [t.prefix, t.t_id]})])
