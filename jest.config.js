module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	testEnvironment: 'node',
	testRegex: undefined,
	testMatch: [
		'**/*.test.ts?(x)',
		'**/@commitlint/lint/src/*.test.js?(x)',
		'**/@commitlint/read/src/*.test.js?(x)',
		'**/@commitlint/travis-cli/src/*.test.js?(x)',
		'**/@commitlint/cli/src/*.test.js?(x)',
		'**/@commitlint/prompt-cli/*.test.js?(x)',
		'**/@commitlint/config-angular/*.test.js?(x)',
		'**/@commitlint/config-angular-type-enum/*.test.js?(x)',
		'**/@commitlint/config-conventional/*.test.js?(x)'
	]
};
