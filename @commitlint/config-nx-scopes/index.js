import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { RuleConfigSeverity } from "@commitlint/types";

const projectGraphReader = fileURLToPath(new URL("./project-graph.js", import.meta.url));

/**
 * Stdio slot the graph reader writes its payload to. Nx, its daemon and the
 * worker processes it runs plugins in all write to stdout, so the payload gets
 * a pipe of its own instead of sharing one with them.
 *
 * This is the only place the descriptor is declared: the reader is told which
 * one to write to on its command line, so the two sides cannot drift apart.
 */
const payloadFd = 3;

export default {
	utils: { getProjects },
	rules: {
		"scope-enum": (ctx) => Promise.resolve([RuleConfigSeverity.Error, "always", getProjects(ctx)]),
	},
};

/**
 * @param {(params: Pick<Nx.ProjectConfiguration, 'name' | 'projectType' | 'tags'>) => boolean} selector
 */
function getProjects(context, selector = () => true) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	return readProjectGraph(cwd)
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
	const { status, error, stdout, stderr, output } = spawnSync(
		process.execPath,
		[projectGraphReader, String(payloadFd)],
		{
			cwd,
			encoding: "utf8",
			// stdin, stdout, stderr, then the payload pipe at `payloadFd`.
			stdio: ["ignore", "pipe", "pipe", "pipe"],
			// A workspace with a lot of projects or a chatty plugin must not run
			// into the default 1 MB cap, which aborts the read.
			maxBuffer: Infinity,
		},
	);

	const payload = output[payloadFd];
	if (error || status !== 0 || !payload) {
		const reason = error ? error.message : stderr || stdout;
		throw new Error(`Unable to read the nx project graph in "${cwd}".\n${reason}`.trim());
	}

	return JSON.parse(payload);
}
