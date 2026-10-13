module.exports = {
	extends: ['./first', './second'],
	plugins: ['example', '@scope/example'],
	rules: {
		'type-enum': [2, 'always', ['a', 'b', 'c', 'd']]
	}
};
