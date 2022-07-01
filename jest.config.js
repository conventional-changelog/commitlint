module.exports = {
	transform: {
		'^.+\\.(t|j)s?$': ['@swc/jest'],
	},
	testEnvironment: '@commitlint/test-environment',
	testRegex: undefined,
	testMatch: ['**/*.test.[jt]s?(x)'],
};
