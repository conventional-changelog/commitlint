const types = [
	'chore',
	'docs',
	'feat',
	'fix',
	'perf',
	'refactor',
	'style',
	'test'
];

module.exports.rules = {
	'type-enum': [2, 'always', types]
};

module.exports.value = () => types;
