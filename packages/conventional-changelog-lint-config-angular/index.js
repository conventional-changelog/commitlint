module.exports = {
	rules: {
		'body-leading-blank': [1,
			'always'
		],
		'footer-leading-blank': [2,
			'always'
		],
		'header-max-length': [2,
			'always',
			72
		],
		'lang': [1,
			'always',
			'eng'
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
		'type-case': [2,
			'always',
			'lowerCase'
		],
		'type-empty': [2,
			'never'
		],
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
		]
	},
	wildcards: {
		merge: [
			'^(Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?))$)'
		],
		release: [
			'^\\d+.\\d+.\\d+\n?$'
		],
		revert: [
			'^revert: (.*)'
		]
	}
};
