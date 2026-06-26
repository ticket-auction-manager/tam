import { db } from '$lib/server/db/index.js';
import { reportByName } from '$lib/server/db/schema.js';
import { getPath, getSettings } from '$lib/server/settings';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
  const { prefix } = params;
  const s = getSettings();
  if (s.remote_server) {
    const connStr = getPath(s);
    try {
      const res = await fetch(`${connStr}/api/reports/byname/${prefix}`, {headers: {'TAM-KEY': s.remote_key}});
      if (!res.ok) throw error(res.status);
      const data = await res.json();
      return json(data);
    } catch {
      return json([]);
    }
  } else {
    const data = await db.select().from(reportByName).where(eq(reportByName.prefix, prefix));
    return json(data);
  }
}
