module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	testEnvironment: 'node',
	testRegex: undefined,
	testMatch: [
		'**/*.test.ts?(x)',
		'**/@commitlint/{lint,read,travis-cli,cli,prompt-cli,load}/src/*.test.js?(x)'
	]
};
