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
	'test'
];

module.exports.rules = {
	'type-enum': [2, 'always', types]
};

module.exports.value = () => types;
