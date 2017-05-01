import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when = 'never') => {
	const negated = when === 'always';
	const notEmpty = ensureNotEmpty(parsed.scope);
	return [
		negated ? !notEmpty : notEmpty,
		[
			'scope',
			negated ? 'must' : 'may not',
			'be empty'
		]
		.filter(Boolean)
		.join(' ')
	];
};
