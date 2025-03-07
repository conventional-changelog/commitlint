export default {
	type: {
		description: "<type> holds information about the goal of a change.",
		enumerables: {
			feat: {
				description: "Adds a new feature.",
			},
			fix: {
				description: "Solves a bug.",
			},
			chore: {
				description: "Other changes that don't modify src or test files",
			},
			docs: {
				description: "Adds or alters documentation.",
			},
			style: {
				description: "Improves formatting, white-space.",
			},
			refactor: {
				description:
					"Rewrites code without feature, performance or bug changes.",
			},
			perf: {
				description: "Improves performance.",
			},
			test: {
				description: "Adds or modifies tests.",
			},
			build: {
				description: "Affects the build system or external dependencies.",
			},
			ci: {
				description: "Changes CI configuration files and scripts.",
			},
			revert: {
				description: "Reverts a previous commit.",
			},
		},
	},
	scope: {
		description: "<scope> marks which sub-component of the project is affected",
	},
	subject: {
		description: "<subject> is a short, high-level description of the change",
	},
	body: {
		description: "<body> holds additional information about the change",
		multiline: true,
	},
	footer: {
		description:
			"<footer> holds further meta data, such as breaking changes and issue ids",
		multiline: true,
	},
};
