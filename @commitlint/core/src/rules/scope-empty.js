import ensureNotEmpty from '../library/ensure-not-empty';
import message from '../library/message';

export default (parsed, when = 'never') => {
	const negated = when === 'always';
	const notEmpty = ensureNotEmpty(parsed.scope);
	return [
		negated ? !notEmpty : notEmpty,
		message(['scope', negated ? 'must' : 'may not', 'be empty'])
	];
};
