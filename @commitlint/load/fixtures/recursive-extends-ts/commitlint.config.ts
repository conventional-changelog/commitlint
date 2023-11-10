import type {UserConfig} from './types';

const Configuration: UserConfig = {
	extends: ['./first-extended/index.ts'],
	rules: {
		zero: [0, 'never', 'zero']
	}
};
module.exports = Configuration;