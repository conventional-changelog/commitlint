const {Workspaces} = require('nx/src/config/workspaces');

module.exports = {
	utils: {getProjects},
	rules: {
		'scope-enum': (ctx) =>
			getProjects(ctx).then((packages) => [2, 'always', packages]),
	},
};

/**
 * @param {(params: Pick<Nx.ProjectConfiguration, 'name' | 'projectType' | 'tags'>) => boolean} selector
 */
function getProjects(context, selector = () => true) {
	return Promise.resolve()
		.then(() => {
			const ctx = context || {};
			const cwd = ctx.cwd || process.cwd();
			const ws = new Workspaces(cwd);
			const workspace = ws.readWorkspaceConfiguration();
			return Object.entries(workspace.projects || {}).map(
				([name, project]) => ({
					name,
					...project,
				})
			);
		})
		.then((projects) => {
			return projects
				.filter((project) =>
					selector({
						name: project.name,
						projectType: project.projectType,
						tags: project.tags,
					})
				)
				.filter((project) => project.targets)
				.map((project) => project.name)
				.map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
		});
}
