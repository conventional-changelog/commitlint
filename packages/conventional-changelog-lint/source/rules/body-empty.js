import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensureNotEmpty(parsed.body);

	return [
		negated ? notEmpty : !notEmpty,
		[
			'body',
			negated ? 'may not' : 'must',
			'be empty'
		]
		.filter(Boolean)
		.join(' ')
	];
};
