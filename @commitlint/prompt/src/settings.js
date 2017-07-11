export default {
	type: {
		description: '<type> holds information about the goal of a change.',
		enumerables: {
			feat: {
				description: 'Adds a new feature.'
			},
			fix: {
				description: 'Solves a bug.'
			},
			docs: {
				description: 'Adds or alters documentation.'
			},
			style: {
				description: 'Improves formatting, white-space.'
			},
			refactor: {
				description:
					'Rewrites code without feature, performance or bug changes.'
			},
			perf: {
				description: 'Improves performance.'
			},
			test: {
				description: 'Adds or modifies tests.'
			},
			chore: {
				description: 'Change build process, tooling or dependencies.'
			}
		}
	},
	scope: {
		description: '<scope> marks which sub-component of the project is affected'
	},
	subject: {
		description: '<subject> is a short, high-level description of the change'
	},
	body: {
		description: '<body> holds additional information about the change',
		multline: true
	},
	footer: {
		description:
			'<footer> holds further meta data, such as breaking changes and issue ids',
		multiline: true
	}
};
