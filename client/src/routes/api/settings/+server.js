import { setSettings } from '$lib/server/settings';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const newSettings = await request.json();
	setSettings(newSettings);
	return json(newSettings);
};
