export const load = async ({ params, fetch }) => {
	const { prefix } = params;
	const res = await fetch('/api/prefixes');
	const prefixes = await res.json();
	const prefixObj = Array.from(prefixes).find((p) => p.prefix == prefix);
	return { prefix: prefixObj, prefixes };
};
