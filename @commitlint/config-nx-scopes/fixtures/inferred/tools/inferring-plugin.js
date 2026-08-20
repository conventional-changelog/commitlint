// A minimal Nx plugin that infers a project from a marker file. Projects created
// this way exist only in the project graph: there is no project.json and no
// package.json on disk for Nx's generator utilities to read.
const path = require("node:path");

module.exports = {
	name: "inferring-plugin",
	createNodes: [
		"nx/*/inferred.marker",
		(markerFiles) =>
			markerFiles.map((markerFile) => {
				const root = path.dirname(markerFile);
				return [
					markerFile,
					{
						projects: {
							[root]: {
								name: `fixture-inferred-${path.basename(root)}`,
								root,
								projectType: "library",
								tags: ["inferred"],
							},
						},
					},
				];
			}),
	],
};
