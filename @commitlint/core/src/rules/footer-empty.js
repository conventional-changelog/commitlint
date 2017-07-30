import ensureNotEmpty from '../library/ensure-not-empty';
import message from '../library/message';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensureNotEmpty(parsed.footer);

	return [
		negated ? notEmpty : !notEmpty,
		message(['footer', negated ? 'may not' : 'must', 'be empty'])
	];
};
