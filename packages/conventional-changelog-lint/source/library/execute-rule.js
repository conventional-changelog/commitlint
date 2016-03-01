export default async entry => {
	const [name, config] = entry;
	return typeof config === 'function' ?
		[name, await config()] :
		[name, await config];
};
