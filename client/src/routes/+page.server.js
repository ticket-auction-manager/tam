import { getSettings } from '$lib/server/settings';

export const load = async ({ fetch }) => {
	const settings = getSettings();
	const disableAttrib = settings.disable_attrib || false;
	const res = await fetch('/api');
	const data = await res.json();
	const resPrefixes = await fetch('/api/prefixes');
	const dataPrefixes = await resPrefixes.json();
	return { ...data, venueName: settings.venue_name, prefixes: dataPrefixes, disableAttrib };
};
