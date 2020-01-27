module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	testEnvironment: 'node',
	testRegex: undefined,
	testMatch: [
		'**/*.test.ts?(x)',
		'**/@commitlint/read/src/*.test.js?(x)',
		'**/@commitlint/load/src/*.test.js?(x)',
		'**/@commitlint/cli/src/*.test.js?(x)'
	]
};
