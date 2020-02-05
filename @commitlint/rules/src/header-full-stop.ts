import message from '@commitlint/message';
import {Rule} from '@commitlint/types';

export const headerFullStop: Rule<string> = (
	parsed,
	when = 'always',
	value = '.'
) => {
	const {header} = parsed;
	const negated = when === 'never';
	const hasStop = header[header.length - 1] === value;

	return [
		negated ? !hasStop : hasStop,
		message(['header', negated ? 'may not' : 'must', 'end with full stop'])
	];
};
