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

		// Forbid the use of extraneous packages
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: ['**/*.test.js', '**/*.test.ts', 'vitest'],
			},
		],
	},
	overrides: [
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			extends: [
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'prettier',
			],
			rules: {
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/no-inferrable-types': 'off',
				'@typescript-eslint/no-non-null-assertion': 'off',
				'@typescript-eslint/triple-slash-reference': 'off',

				// TODO: enable those rules?
				'no-empty': 'off',
				'no-var': 'off',
			},
		},
		{
			files: ['*.test.ts', '*.test.js'],
			extends: ['plugin:jest/recommended'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				// disallow non-import statements appearing before import statements
				'import/first': 'off',
				'import/no-extraneous-dependencies': 'off',
				'jest/no-deprecated-functions': 'off'
			},
		},
	],
};
