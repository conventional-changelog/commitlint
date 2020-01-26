module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	testEnvironment: 'node',
	testRegex: undefined,
	testMatch: [
		'**/*.test.ts?(x)',
		'**/@commitlint/rules/src/*.test.js?(x)',
		'**/@commitlint/read/src/*.test.js?(x)'
	]
};
