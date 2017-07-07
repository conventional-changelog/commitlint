import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when) => {
	const negated = when === 'never';
	const notEmpty = ensureNotEmpty(parsed.subject);

	return [
		negated ? notEmpty : !notEmpty,
		[
			'message',
			negated ? 'may not' : 'must',
			'be empty'
		]
		.filter(Boolean)
		.join(' ')
	];
};
