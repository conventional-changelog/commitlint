import typescriptEslint from '@typescript-eslint/eslint-plugin';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import jest from 'eslint-plugin-jest';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/lib/', '**/coverage/', '**/node_modules/', '**/fixtures/', '**/dist/'],
	},
	importX.flatConfigs.typescript,
	...compat.extends('eslint:recommended', 'prettier'),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			jest,
		},

		settings: {
			'import-x/resolver-next': createTypeScriptImportResolver(),
		},

		languageOptions: {
			globals: {
				...globals.node,
			},

			ecmaVersion: 11,
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: false,
				},
			},
		},

		rules: {
			'import-x/first': 'error',
			'import-x/no-absolute-path': 'error',
			'import-x/no-amd': 'error',
			'import-x/no-mutable-exports': 'error',
			'import-x/no-named-default': 'error',
			'import-x/no-self-import': 'error',

			'import-x/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: true,
				},
			],
		},
	},
	...compat
		.extends(
			'plugin:@typescript-eslint/eslint-recommended',
			'plugin:@typescript-eslint/recommended',
			'prettier'
		)
		.map((config) => ({
			...config,
			files: ['**/*.cts', '**/*.ts'],
		})),
	{
		files: ['**/*.cts', '**/*.ts'],

		languageOptions: {
			parser: tsParser,
		},

		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/triple-slash-reference': 'off',
			'no-empty': 'off',
			'no-var': 'off',
		},
	},
	...compat.extends('plugin:jest/recommended').map((config) => ({
		...config,
		files: ['**/*.test.ts', '**/*.test.js'],
	})),
	{
		files: ['**/*.test.ts', '**/*.test.js'],

		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'import-x/first': 'off',
			'import-x/no-extraneous-dependencies': 'off',
			'jest/no-deprecated-functions': 'off',
		},
	},
];
