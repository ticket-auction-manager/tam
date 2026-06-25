export const load = async ({ fetch }) => {
	const res = await fetch('/api/prefixes');
	const prefixes = await res.json();
	return { prefixes };
};
