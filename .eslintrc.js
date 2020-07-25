module.exports = {
	root: true,
	plugins: ['@typescript-eslint', 'jest', 'import'],
	env: {
		es6: true,
		node: true,
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 11,
		ecmaFeatures: {
			jsx: false,
		},
	},
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		// disallow non-import statements appearing before import statements
		'import/first': 'error',
		// Forbid import of modules using absolute paths
		'import/no-absolute-path': 'error',
		// disallow AMD require/define
		'import/no-amd': 'error',
		// Forbid mutable exports
		'import/no-mutable-exports': 'error',
		// Prevent importing the default as if it were named
		'import/no-named-default': 'error',
		// Forbid a module from importing itself
		'import/no-self-import': 'error',

		// Enable after https://github.com/benmosher/eslint-plugin-import/issues/1650 is fixed
		// Forbid the use of extraneous packages
		// 'import/no-extraneous-dependencies': [
		// 	'error',
		// 	{devDependencies: ['**/*.test.js']}
		// ]
	},
	overrides: [
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			extends: [
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'prettier/@typescript-eslint',
			],
			rules: {
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/no-inferrable-types': 'off',
				'@typescript-eslint/no-non-null-assertion': 'off',

				// TODO: enable those rules?
				'no-empty': 'off',
				'no-var': 'off',
			},
		},
		{
			files: ['*.test.ts', '*.test.js'],
			env: {
				jest: true,
			},
			extends: ['plugin:jest/recommended'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				// disallow non-import statements appearing before import statements
				'import/first': 'off',
			},
		},
	],
};
