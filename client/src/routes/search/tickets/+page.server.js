export const load = async ({ fetch }) => {
	const prefix = {
		prefix: '',
		color: 'gray',
		weight: 0
	};
	const res = await fetch('/api/prefixes');
	const prefixes = await res.json();
	return { prefix, prefixes };
};
