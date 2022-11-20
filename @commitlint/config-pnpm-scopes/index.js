const {findWorkspacePackages} = require('@pnpm/find-workspace-packages');

module.exports = {
	utils: {getProjects},
	rules: {
		'scope-enum': (ctx) =>
			getProjects(ctx).then((packages) => [2, 'always', packages]),
	},
};

function getProjects(context) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	return findWorkspacePackages(cwd).then((projects) => {
		return projects.reduce((projects, project) => {
			const name = project.manifest.name;

			if (name && project.dir !== cwd) {
				projects.push(name.charAt(0) === '@' ? name.split('/')[1] : name);
			}

			return projects;
		}, []);
	});
}
