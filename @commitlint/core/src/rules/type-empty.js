import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensureNotEmpty(parsed.type);
	return [
		negated ? notEmpty : !notEmpty,
		['type', negated ? 'may not' : 'must', 'be empty'].filter(Boolean).join(' ')
	];
};
