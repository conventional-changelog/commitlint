import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensureNotEmpty(parsed.footer);

	return [
		negated ? notEmpty : !notEmpty,
		['footer', negated ? 'may not' : 'must', 'be empty']
			.filter(Boolean)
			.join(' ')
	];
};
