import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when) => {
	const negated = when === 'never';
	return [
		ensureNotEmpty(parsed.body),
		[
			'body',
			negated ? 'may not' : 'must',
			'be empty'
		]
		.filter(Boolean)
		.join(' ')
	];
};
