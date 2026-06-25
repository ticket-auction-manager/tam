import { defineConfig } from 'drizzle-kit';

const dbURL = (process.env.TAM_DATA_DIR || './data') + '/tam-local.db';

export default defineConfig({
	schema: './src/lib/server/db/schema.js',
	dialect: 'sqlite',
	dbCredentials: { url: dbURL },
	verbose: true,
	strict: true
});
