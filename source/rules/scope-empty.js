import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when = 'never') => {
	const negated = when === 'always';
	const result = ensureNotEmpty(parsed.scope);
	return [
		negated ? !result : result,
		[
			'scope',
			negated ? 'must' : 'may not',
			'be empty'
		]
		.filter(Boolean)
		.join(' ')
	];
};
