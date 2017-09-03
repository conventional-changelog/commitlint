module.exports = configuration => {
	const lines = Object.entries(configuration.description).map(entry => {
		const name = entry[0];
		const desc = entry[1];
		const alias = Object.entries(configuration.alias)
			.find(entry => entry[1] === name)
			.map(entry => entry[0])[0];
		const defaults = configuration.default[name];
		return [[name, alias].filter(Boolean), desc, defaults].filter(Boolean);
	});

	const longest = lines
		.map(line => {
			const flags = line[0];
			return flags.reduce((sum, flag) => sum + flag.length, 0);
		})
		.sort(Number)[0];

	return lines
		.map(line => {
			const flags = line[0];
			const desc = line[1];
			const defaults = line[2];
			const fs = flags.map(
				flag => (flag.length > 1 ? `--${flag}` : ` -${flag}`)
			);
			const ds = defaults ? `, defaults to: ${defaults}` : '';
			const length = flags.reduce((sum, flag) => sum + flag.length, 0);
			return `${fs.join(',')}${' '.repeat(4 + longest - length)}${desc}${ds}`;
		})
		.join('\n');
};
