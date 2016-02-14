import ensureNotEmpty from '../library/ensure-not-empty';

export default (parsed, when) => {
	const negated = when === 'never';
	return [
		ensureNotEmpty(parsed.subject),
		[
			'message',
			negated ? 'may not' : 'must',
			'be empty'
		]
		.filter(Boolean)
		.join(' ')
	];
};
