export default (parsed, when, value) => {
	const input = /.*\n(Signed-off-by:).*\n+/g.exec(parsed.raw);

	const negated = when === 'never';
	const hasSignedOffBy = Boolean(input && input[1] === value);

	return [
		negated ? !hasSignedOffBy : hasSignedOffBy,
		['message', negated ? 'must not' : 'must', 'be signed off']
			.filter(Boolean)
			.join(' ')
	];
};
