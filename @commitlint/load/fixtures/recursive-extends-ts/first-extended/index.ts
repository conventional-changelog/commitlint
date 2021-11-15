import type {UserConfig} from '../types';
module.exports = {
	extends: ['./second-extended'],
	rules: {
		one: [1, 'never', 'one']
	}
} as UserConfig;
