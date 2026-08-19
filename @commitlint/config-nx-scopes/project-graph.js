/**
 * Reads the nx project graph and reports every project it contains back to the
 * parent over the IPC channel opened by `child_process.fork`.
 *
 * This runs as a child process on purpose. Nx derives the workspace root from
 * `process.cwd()` when it is first loaded and bakes that value into its cache
 * paths and its daemon client, so the only reliable way to read the graph of an
 * arbitrary directory is to be a process whose cwd is that directory.
 */
import { createProjectGraphAsync } from "nx/src/project-graph/project-graph.js";

const graph = await createProjectGraphAsync({ exitOnError: false });

const projects = Object.entries(graph.nodes ?? {}).map(([name, node]) => ({
	name,
	projectType: node.data?.projectType,
	tags: node.data?.tags ?? [],
}));

// Nx keeps the daemon connection and its file watchers alive, so ask for the
// process to end once the payload has been flushed to the parent.
process.send(projects, () => process.exit(0));
