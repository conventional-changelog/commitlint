module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	testEnvironment: './test/tmp-environment.js',
	testRegex: undefined,
	testMatch: [
		'**/*.test.ts?(x)',
		'**/@commitlint/{lint,read,travis-cli,cli,load,prompt}/src/**/*.test.js?(x)',
		'**/@commitlint/{prompt-cli,config-lerna-scopes}/*.test.js?(x)'
	]
};
