// An Nx plugin that prints to stdout while it infers a project, the way a
// plugin that logs its progress does. Nx runs plugins in worker processes that
// inherit stdout, so everything written here shows up on the stdout of the
// process reading the graph.
const fs = require("node:fs");
const path = require("node:path");

console.log("noisy-plugin: loaded");
// Written straight to the file descriptor, so it survives even if the reading
// process replaces `console` or `process.stdout`.
fs.writeSync(1, '[{"name":"not-a-project"}]\n');

module.exports = {
	name: "noisy-plugin",
	createNodes: [
		"nx/*/noisy.marker",
		(markerFiles) => {
			console.log(`noisy-plugin: inferring ${markerFiles.length} project(s)`);
			return markerFiles.map((markerFile) => {
				const root = path.dirname(markerFile);
				return [
					markerFile,
					{
						projects: {
							[root]: {
								name: `fixture-noisy-${path.basename(root)}`,
								root,
								projectType: "library",
								tags: [],
							},
						},
					},
				];
			});
		},
	],
};
