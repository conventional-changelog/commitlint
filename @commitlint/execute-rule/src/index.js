export default async entry => {
	if (!Array.isArray(entry)) {
		return null;
	}
	const [name, config] = entry;
	return typeof config === 'function'
		? [name, await config()]
		: [name, await config];
};
