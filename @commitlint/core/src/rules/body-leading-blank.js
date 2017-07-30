import toLines from '../library/to-lines';

export default (parsed, when) => {
	// Flunk if no body is found
	if (!parsed.body) {
		return [true];
	}

	const negated = when === 'never';
	const [leading] = toLines(parsed.raw).slice(1);

	// Check if the first line of body is empty
	const succeeds = leading === '';

	return [
		negated ? !succeeds : succeeds,
		['body', negated ? 'may not' : 'must', 'have leading blank line']
			.filter(Boolean)
			.join(' ')
	];
};
