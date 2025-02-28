import {createRequire} from 'node:module';
import Path from 'node:path';

import {globSync} from 'glob';

const require = createRequire(import.meta.url);

export default {
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

			const {workspaces} = require(Path.join(cwd, 'package.json'));
			if (!Array.isArray(workspaces)) {
				// no workspaces configured, skipping
				return [];
			}

			const wsGlobs = workspaces.flatMap((ws) => {
				const path = Path.posix.join(ws, 'package.json');
				return globSync(path, {cwd, ignore: ['**/node_modules/**']});
			});

			return wsGlobs.sort().map((pJson) => require(Path.join(cwd, pJson)));
		})
		.then((packages) => {
			return packages
				.map((pkg) => pkg.name)
				.filter(Boolean)
				.map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
		});
}
