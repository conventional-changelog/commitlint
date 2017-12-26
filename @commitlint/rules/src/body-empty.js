import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensure.notEmpty(parsed.body);

	return [
		negated ? notEmpty : !notEmpty,
		message(['body', negated ? 'may not' : 'must', 'be empty'])
	];
};
