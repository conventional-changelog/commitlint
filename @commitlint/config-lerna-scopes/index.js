import importFrom from 'import-from';

export default {
	utils: {
		getPackages,
	},
	rules: {
		'scope-enum': (ctx) =>
			getPackages(ctx).then((packages) => [2, 'always', packages]),
	},
};

async function getPackages(context) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	// https://lerna.js.org/docs/api-reference/utilities#detectprojects
	const {detectProjects} = importFrom(cwd, 'lerna/utils');
	// https://github.com/lerna/lerna/blob/main/libs/core/src/lib/project-graph-with-packages.ts#L14
	const projectGraph = await detectProjects(cwd);
	const packages = Object.values(projectGraph.nodes)
		.map((node) => node.package)
		.filter(Boolean);

	console.log('>>>>>> PACKAGES', packages);

	return packages
		.map((pkg) => pkg.name)
		.filter(Boolean)
		.map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
}
