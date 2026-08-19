import { fork } from "node:child_process";
import { fileURLToPath } from "node:url";

import { RuleConfigSeverity } from "@commitlint/types";

const projectGraphReader = fileURLToPath(new URL("./project-graph.js", import.meta.url));

export default {
	utils: { getProjects },
	rules: {
		"scope-enum": async (ctx) => [RuleConfigSeverity.Error, "always", await getProjects(ctx)],
	},
};

/**
 * @param {(params: Pick<Nx.ProjectConfiguration, 'name' | 'projectType' | 'tags'>) => boolean} selector
 */
async function getProjects(context, selector = () => true) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	const projects = await readProjectGraph(cwd);
	return projects
		.filter((project) =>
			selector({
				name: project.name,
				projectType: project.projectType,
				tags: project.tags,
			}),
		)
		.map((project) => project.name)
		.map((name) => (name.charAt(0) === "@" ? name.split("/")[1] : name));
}

/**
 * Nx picks its workspace root from the cwd of the process that loads it, so the
 * graph is read in a child process started in the directory we care about.
 */
function readProjectGraph(cwd) {
	return new Promise((resolve, reject) => {
		const child = fork(projectGraphReader, {
			cwd,
			stdio: ["ignore", "pipe", "pipe", "ipc"],
		});

		let projects;
		let output = "";

		child.stdout.on("data", (chunk) => {
			output += chunk;
		});
		child.stderr.on("data", (chunk) => {
			output += chunk;
		});
		child.on("message", (message) => {
			projects = message;
		});
		child.on("error", reject);
		child.on("close", () => {
			if (projects !== undefined) {
				resolve(projects);
				return;
			}

			reject(new Error(`Unable to read the nx project graph in "${cwd}".\n${output}`.trim()));
		});
	});
}
