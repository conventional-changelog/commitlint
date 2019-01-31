module.exports = flags => {
	const lines = Object.entries(flags).map(entry => {
		const name = entry[0];
		const value = entry[1];
		return [
			[name, value.alias].filter(Boolean),
			value.description,
			value.default
		].filter(Boolean);
	});

	const longest = lines
		.map(line => {
			const flags = line[0];
			return flags.reduce((sum, flag) => sum + flag.length, 0);
		})
		.sort((a, b) => b - a)[0];

	return lines
		.map(line => {
			const flags = line[0];
			const desc = line[1];
			const defaults = line[2];
			const fs = flags.map(flag =>
				flag.length > 1 ? `--${flag}` : ` -${flag}`
			);
			const ds = defaults ? `, defaults to: ${defaults}` : '';
			const length = flags.reduce((sum, flag) => sum + flag.length, 0);
			return `${fs.join(',')}${' '.repeat(
				Math.max(4 + longest - length, 0)
			)}${desc}${ds}`;
		})
		.join('\n');
};
