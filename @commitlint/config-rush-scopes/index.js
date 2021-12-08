const Path = require('path');
const util = require('util');
const fs = require('fs');
const jsonc = require('jsonc');

const readFilePromisifed = util.promisify(fs.readFile);

module.exports = {
	utils: {getPackages},
	rules: {
		'scope-enum': (ctx) =>
			getPackages(ctx).then((packages) => [2, 'always', packages]),
	},
};

function getPackages(context) {
	return Promise.resolve()
		.then(() => {
			const ctx = context || {};
			const cwd = ctx.cwd || process.cwd();

			return readFilePromisifed(Path.join(cwd, 'rush.json'), {encoding: 'utf8'})
				.then((content) => jsonc.parse(content))
				.then(({projects}) => projects)
				.catch(() => []);
		})
		.then((packages) => {
			return packages
				.map((pkg) => pkg.packageName)
				.filter(Boolean)
				.map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
		});
}
