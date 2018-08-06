const importFrom = require('import-from');

module.exports = {
	utils: {getPackages},
	rules: {
		'scope-enum': async ctx => [2, 'always', await getPackages(ctx)]
	}
};

async function getPackages(context) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	const Project = importFrom(cwd, '@lerna/project');

	const project = new Project(cwd);
	const packages = await project.getPackages();

	return packages
		.map(pkg => pkg.name)
		.map(name => (name.charAt(0) === '@' ? name.split('/')[1] : name));
}
