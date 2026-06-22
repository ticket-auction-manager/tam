import { getSettings, getPath } from "$lib/server/settings";
import { json, error } from "@sveltejs/kit";

export const GET = async ({ request }) => {
  const tamPwd = request.headers.get('TAM-PWD');
  const s = getSettings();
  if (s.remote_server) {
    const connStr = getPath(s);
    try {
      const res = await fetch(`${connStr}/api/auth`, {
        headers: { 'TAM-PW': tamPwd }
      });
      if (!res.ok) throw error(res.status);
      const data = await res.json();
      return json(data);
    } catch {
      throw error(502)
    }
  } else {
    throw error(500, 'Not configured.')
  }
}

export const POST = async ({ request }) => {
  const tamPwd = request.headers.get('TAM-PWD');
  const reqBody = await request.json();
  const s = getSettings();
  if (s.remote_server) {
    const connStr = getPath(s);
    try {
      const res = await fetch(`${connStr}/api/auth`, {
        headers: { 'TAM-PW': tamPwd, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(reqBody)
      });
      if (!res.ok) throw error(res.status);
      const data = await res.json();
      return json(data);
    } catch {
      throw error(502);
    }
  } else {
    throw error(500, 'Not configured.')
  }
}

export const DELETE = async ({ request, url }) => {
  const tamPwd = request.headers.get('TAM-PWD');
  const keyToDel = url.searchParams.get('key_to_del');
  const s = getSettings();
  if (s.remote_server) {
    const connStr = getPath(s);
    try {
      const res = await fetch(`${connStr}/api/auth?key_to_del=${keyToDel}`, {
        headers: { 'TAM-PW': tamPwd },
        method: 'DELETE'
      })
      if (!res.ok) throw error(res.status)
      const data = await res.json();
      return json(data);
    } catch {
      throw error(502);
    }
  } else {
    throw error(500, 'Not configured.')
  }
}
