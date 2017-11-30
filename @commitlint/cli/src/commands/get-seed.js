module.exports.getSeed = getSeed;

function getSeed(seed) {
	const e = Array.isArray(seed.extends) ? seed.extends : [seed.extends];
	const n = e.filter(i => typeof i === 'string');
	return n.length > 0
		? {extends: n, parserPreset: seed.parserPreset}
		: {parserPreset: seed.parserPreset};
}
