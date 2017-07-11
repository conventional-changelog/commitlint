export default (parsed, when) => {
	// Flunk if no body is found
	if (!parsed.body) {
		return [true];
	}

	const negated = when === 'never';

	// Get complete body split into lines
	const lines = (parsed.raw || '').split(/\r|\n/).slice(1);
	const [leading] = lines;

	// Check if the first line of body is empty
	const succeeds = leading === '';

	return [
		negated ? !succeeds : succeeds,
		['body', negated ? 'may not' : 'must', 'have leading blank line']
			.filter(Boolean)
			.join(' ')
	];
};
