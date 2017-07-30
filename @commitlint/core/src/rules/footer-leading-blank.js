import toLines from '../library/to-lines';

export default (parsed, when) => {
	// Flunk if no footer is found
	if (!parsed.footer) {
		return [true];
	}

	const negated = when === 'never';
	const [leading] = toLines(parsed.raw).slice(toLines(parsed.body).length + 1);

	// Check if the first line of footer is empty
	const succeeds = leading === '';

	return [
		negated ? !succeeds : succeeds,
		['footer', negated ? 'may not' : 'must', 'have leading blank line']
			.filter(Boolean)
			.join(' ')
	];
};
