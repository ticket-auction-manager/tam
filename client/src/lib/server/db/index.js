import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const dbURL = (env.TAM_DATA_DIR || "./data") + "/tam-local.db";

const client = new Database(dbURL);

export const db = drizzle(client, { schema });
