import { defineConfig, globalIgnores } from "eslint/config";

import globals from "globals";

import js from "@eslint/js";
import typescript from "typescript-eslint";

import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";

import vitest from "@vitest/eslint-plugin";

export default defineConfig([
	globalIgnores([
		"**/node_modules/",
		"**/lib/",
		"**/coverage/",
		"**/fixtures/",
		"**/dist/",
	]),
	js.configs.recommended,
	typescript.configs.recommended,

	{
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/triple-slash-reference": "off",
		},
	},

	{
		files: ["**/*.cjs"],
		rules: {
			"@typescript-eslint/no-require-imports": "off",
		},
	},

	{
		languageOptions: {
			globals: {
				...globals.node,
				...vitest.environments.env.globals,
			},
			ecmaVersion: 11,
			sourceType: "module",

			parserOptions: {
				ecmaFeatures: {
					jsx: false,
				},
			},
		},
		...importX.configs["flat/recommended"],
		settings: {
			"import-x/resolver-next": createTypeScriptImportResolver(),
		},
		rules: {
			"import-x/first": "error",
			"import-x/no-absolute-path": "error",
			"import-x/no-amd": "error",
			"import-x/no-mutable-exports": "error",
			"import-x/no-named-default": "error",
			"import-x/no-self-import": "error",
			"import-x/no-extraneous-dependencies": [
				"error",
				{
					devDependencies: true,
				},
			],
		},
	},

	{
		files: ["**/*.{test,spec}.{js,ts}"],
		...vitest.configs.recommended,
		rules: {
			...vitest.configs.recommended.rules,
			"vitest/max-nested-describe": ["error", { max: 3 }],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-var-requires": "off",
			"import-x/first": "off",
			"import-x/no-extraneous-dependencies": "off",
		},
	},
]);
