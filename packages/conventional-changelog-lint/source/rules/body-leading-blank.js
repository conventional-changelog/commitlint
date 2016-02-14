export default (parsed, when) => {
	const negated = when === 'never';
	const lines = (parsed.body || '').split('\n');
	const leadingBlank =
		lines.length > 0 ?
		lines[0].length === 0 :
		true;
	return [
		negated ? !leadingBlank : leadingBlank,
		[
			'body',
			negated ? 'may not' : 'must',
			'have leading blank line'
		]
		.filter(Boolean)
		.join(' ')
	];
};
