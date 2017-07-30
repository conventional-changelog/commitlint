import ensureNotEmpty from '../library/ensure-not-empty';
import message from '../library/message';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensureNotEmpty(parsed.subject);

	return [
		negated ? notEmpty : !notEmpty,
		message(['message', negated ? 'may not' : 'must', 'be empty'])
	];
};
