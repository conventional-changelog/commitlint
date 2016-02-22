export default (parsed, when) => {
	const negated = when === 'never';
	// get complete body split into lines
	const lines = (parsed.raw || '').split('\n').slice(1);
	// check if the first line of body (if any) is empty
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
