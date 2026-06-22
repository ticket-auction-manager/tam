import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const prefixes = sqliteTable('prefixes', {
  prefix: text('prefix').primaryKey(),
  color: text('color'),
  weight: integer('weight')
});
