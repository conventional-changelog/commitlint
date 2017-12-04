const core = require('@commitlint/core');
const getSeed = require('./get-seed').getSeed;

module.exports.config = config;

async function config(_, flags) {
	const loaded = await core.load(getSeed(flags), {cwd: flags.cwd});
	switch (flags.format) {
		case 'commitlint':
			return console.log(loaded);
		case 'json':
			return console.log(JSON.stringify(loaded));
		default: {
			const err = new Error(`unknown format: ${flags.format}`);
			err.type = 'commitlint';
			err.help = true;
			throw err;
		}
	}
}
