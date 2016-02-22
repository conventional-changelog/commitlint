module.exports = {
	rules: {
		'type-enum': [2,
			'always',
			[
				'feat',
				'fix',
				'docs',
				'style',
				'refactor',
				'test',
				'chore',
				'revert'
			]
		],
		'type-case': [2,
			'always',
			'lowerCase'
		],
		'type-empty': [2,
			'never'
		],
		'scope-case': [2,
			'always',
			'lowerCase'
		],
		'subject-empty': [2,
			'never'
		],
		'subject-full-stop': [2,
			'never',
			'.'
		],
		'body-leading-blank': [1,
			'always'
		],
		'header-max-length': [2,
			'always',
			72
		],
		'lang': [1,
			'always',
			'eng'
		]
	},
	wildcards: {
		merge: [
			'^(Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?))$)'
		],
		release: [
			'^\\d.\\d.\\d$'
		],
		revert: [
			'^revert: (.*)'
		]
	}
};
