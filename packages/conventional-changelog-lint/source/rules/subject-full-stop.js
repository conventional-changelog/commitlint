export default (parsed, when, value) => {
	const negated = when === 'never';
	const closingFullStop =
		parsed.subject ?
		parsed.subject[parsed.subject.length - 1] === value :
		true;
	return [
		negated ? !closingFullStop : closingFullStop,
		[
			'message',
			negated ? 'may not' : 'must',
			'end with full stop'
		]
		.filter(Boolean)
		.join(' ')
	];
};
