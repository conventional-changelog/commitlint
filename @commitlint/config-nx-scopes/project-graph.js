/**
 * Reads the nx project graph and writes every project it contains to the file
 * descriptor named by its first argument, where the parent process picks it up.
 * The parent owns that number and passes it down, so there is nothing here to
 * keep in step with it by hand.
 *
 * This runs as a child process on purpose. Nx derives the workspace root from
 * `process.cwd()` when it is first loaded and bakes that value into its cache
 * paths and its daemon client, so the only reliable way to read the graph of an
 * arbitrary directory is to be a process whose cwd is that directory.
 *
 * The payload does not go to stdout because nx does not leave stdout alone:
 * progress output, the daemon and plugins all write to it, and plugins run in
 * worker processes that inherit it, so it cannot be kept clean from in here.
 */
import { writeSync } from "node:fs";

import { createProjectGraphAsync } from "nx/src/project-graph/project-graph.js";

const payloadFd = Number(process.argv[2]);
if (!Number.isInteger(payloadFd) || payloadFd < 3) {
	throw new Error(
		`Expected the payload file descriptor as the first argument, got "${process.argv[2]}".`,
	);
}

const graph = await createProjectGraphAsync({ exitOnError: false });

const projects = Object.entries(graph.nodes ?? {}).map(([name, node]) => ({
	name,
	projectType: node.data?.projectType,
	tags: node.data?.tags ?? [],
}));

const payload = Buffer.from(JSON.stringify(projects));
for (let written = 0; written < payload.length;) {
	written += writeSync(payloadFd, payload, written);
}

// Nx keeps the daemon connection and its file watchers alive, so ask for the
// process to end now that the payload is out.
process.exit(0);
