import { getSettings, getPath } from "$lib/server/settings"
import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { prefixes } from "$lib/server/db/schema";
import { sql, eq } from "drizzle-orm";

export const GET = async () => {
  const s = getSettings();
  if (s.remote_server) {
    const connStr = getPath(s);
    try {
      const res = await fetch(`${connStr}/api/prefixes`, {
        headers: { 'TAM-KEY': s.remote_key }
      });
      if (!res.ok) throw error(res.status);
      const data = await res.json();
      return json(data);
    } catch {
      return json([]);
    }
  } else {
    const data = await db.select().from(prefixes).orderBy(prefixes.weight, prefixes.prefix);
    return json(data);
  }
}

export const POST = async ({ request }) => {
  const reqData = await request.json();
  const s = getSettings();
  if (s.remote_server) {
    const connStr = getPath(s);
    const res = await fetch(`${connStr}/api/prefixes`, {
      method: 'POST',
      headers: { 'TAM-KEY': s.remote_key, 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    })
    if (!res.ok) throw error(res.status);
  }
  await db.insert(prefixes).values(reqData).onConflictDoUpdate({ target: prefixes.prefix, set: { color: sql`EXCLUDED.color`, weight: sql`EXCLUDED.weight` } });
  return json(reqData);
}

export const DELETE = async ({ url }) => {
  const p = url.searchParams.get('p');
  const s = getSettings();
  if (s.remote_server) {
    const connStr = getPath(s);
    const res = await fetch(`${connStr}/api/prefixes?p=${p}`, {
      method: 'DELETE',
      headers: { 'TAM-KEY': s.remote_key }
    });
    if (!res.ok) throw error(res.status);
  }
  await db.delete(prefixes).where(eq(prefixes.prefix, p));
  return json({ message: "Deleted successfully."});
}
