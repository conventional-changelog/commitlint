import {SyncRule} from '@commitlint/types';

export const subjectBreaking: SyncRule = (parsed) => {
	const result = parsed.subject?.startsWith('BREAKING CHANGE:');

	return [!result, 'move BREAKING CHANGE: to footer'];
};
