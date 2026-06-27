import { getSettings } from '$lib/server/settings/index.js';

export const load = async ({ params, fetch }) => {
	const prefixRes = await fetch('/api/prefixes');
	const prefixes = await prefixRes.json();
	const prefix = Array.from(prefixes).find((p) => p.prefix == params.prefix);
	const reportRes = await fetch(`/api/reports/byname/${params.prefix}`);
	const reportLines = await reportRes.json();
	const { venue_name } = getSettings();
	return { prefixes, prefix, reportLines, venueName: venue_name };
};
