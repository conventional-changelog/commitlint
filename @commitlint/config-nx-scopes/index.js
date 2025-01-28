import {RuleConfigSeverity} from '@commitlint/types';
import {getProjects as getNXProjects} from 'nx/src/generators/utils/project-configuration.js';
import {FsTree} from 'nx/src/generators/tree.js';

export default {
	utils: {getProjects},
	rules: {
		'scope-enum': (ctx) =>
			Promise.resolve([RuleConfigSeverity.Error, 'always', getProjects(ctx)]),
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
		.map((project) => project.name)
		.map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
}
