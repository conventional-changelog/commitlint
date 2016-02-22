export default (parsed, when) => {
	const negated = when === 'never';
	const lines = (parsed.body || '').split('\n');
	console.log(parsed);
	console.log(lines);
	const leadingBlank =
		lines.length > 0 ?
		lines[0].length === 0 :
		true;
	console.log(leadingBlank);
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
