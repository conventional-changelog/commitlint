const {
	getProjects: getNXProjects,
} = require('nx/src/generators/utils/project-configuration');
const {FsTree} = require('nx/src/generators/tree');

module.exports = {
	utils: {getProjects},
	rules: {
		'scope-enum': (ctx) => Promise.resolve([2, 'always', getProjects(ctx)]),
	},
};

/**
 * @param {(params: Pick<Nx.ProjectConfiguration, 'name' | 'projectType' | 'tags'>) => boolean} selector
 */
function getProjects(context, selector = () => true) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	const projects = getNXProjects(new FsTree(cwd, false));
	return Array.from(projects.entries())
		.map(([name, project]) => ({
			name,
			...project,
		}))
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
}
