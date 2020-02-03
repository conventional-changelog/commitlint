module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	testEnvironment: 'node',
	testRegex: undefined,
	testMatch: [
		'**/*.test.ts?(x)',
		'**/@commitlint/{lint,read,travis-cli,cli,load,prompt}/src/*.test.js?(x)',
		'**/@commitlint/prompt-cli/*.test.js?(x)'
	]
};
