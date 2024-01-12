/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.(t|j)s?$': ['@swc/jest'],
	},
	testEnvironment: '@commitlint/test-environment',
	testRegex: undefined,
	testMatch: ['**/*.test.[jt]s?(x)'],
};
