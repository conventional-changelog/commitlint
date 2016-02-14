export default configuration => {
	const lines = Object.entries(configuration.description)
		.map(entry => {
			const [name, desc] = entry;
			const alias = Object.entries(configuration.alias)
				.find(entry => entry[1] === name)
				.map(entry => entry[0])[0];
			const defaults = configuration.default[name];
			return [[name, alias].filter(Boolean), desc, defaults].filter(Boolean);
		});

	const longest = lines
		.map(line => {
			const [flags] = line;
			return flags.reduce((sum, flag) => sum + flag.length, 0);
		})
		.sort(Number)[0];

	return lines
		.map(line => {
			const [flags, desc, defaults] = line;
			const fs = flags.map(flag => flag.length > 1 ? `--${flag}` : `-${flag}`);
			const ds = defaults ? `, defaults to: ${defaults}` : '';
			const length = flags.reduce((sum, flag) => sum + flag.length, 0);
			return `${fs.join(',')}${' '.repeat(4 + longest - length)}${desc}${ds}`;
		})
		.join('\n');
};
