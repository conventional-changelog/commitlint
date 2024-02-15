const types = [
	'build',
	'ci',
	'docs',
	'feat',
	'fix',
	'perf',
	'refactor',
	'revert',
	'style',
	'test',
];

export default {
	rules: {
		'type-enum': [2, 'always', types],
	},
	value: () => types,
};
