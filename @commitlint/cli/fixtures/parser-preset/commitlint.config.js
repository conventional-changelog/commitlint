module.exports = {
	parserOpts: {
		parserPreset: './parser-preset'
	},
	rules: {
		'type-enum': [2, 'always', ['type']],
		'scope-enum': [2, 'always', ['scope']],
		'subject-empty': [2, 'never']
	}
};
