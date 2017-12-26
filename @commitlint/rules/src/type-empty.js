import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensure.notEmpty(parsed.type);
	return [
		negated ? notEmpty : !notEmpty,
		message(['type', negated ? 'may not' : 'must', 'be empty'])
	];
};
