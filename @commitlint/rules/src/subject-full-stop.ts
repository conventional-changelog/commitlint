import message from '@commitlint/message';
import {SyncRule} from '@commitlint/types';

export const subjectFullStop: SyncRule<string> = (
	parsed,
	when = 'always',
	value = '.'
) => {
	const colonIndex = parsed.header.indexOf(':');
	if (colonIndex > 0 && colonIndex === parsed.header.length - 1) {
		return [true];
	}

	const input = parsed.header;

	const negated = when === 'never';
	let hasStop = input[input.length - 1] === value;
	let ellipsis = '...';
	if (input.length > ellipsis.length && input.slice(-ellipsis.length) === ellipsis) {
		hasStop = false;
	}

	return [
		negated ? !hasStop : hasStop,
		message(['subject', negated ? 'may not' : 'must', 'end with full stop']),
	];
};
