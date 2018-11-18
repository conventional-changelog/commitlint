import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensure.notEmpty(parsed.subject);

	return [
		negated ? notEmpty : !notEmpty,
		message(['subject', negated ? 'may not' : 'must', 'be empty'])
	];
};
