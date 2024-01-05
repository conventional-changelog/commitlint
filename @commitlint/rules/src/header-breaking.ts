import {SyncRule} from '@commitlint/types';

export const headerBreaking: SyncRule = (parsed) => {
	const result = parsed.header?.startsWith('BREAKING CHANGE:');

	return [!result, 'move BREAKING CHANGE: to footer'];
};
