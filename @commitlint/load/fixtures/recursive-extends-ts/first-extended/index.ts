import type {UserConfig} from '../types';
module.exports = {
	extends: ['./second-extended/index.ts'],
	rules: {
		one: [1, 'never', 'one']
	}
} as UserConfig;
