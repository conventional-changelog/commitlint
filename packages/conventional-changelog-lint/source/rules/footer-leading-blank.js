export default (parsed, when) => {
	// Flunk if no footer is found
	if (!parsed.footer) {
		return [true];
	}

	const negated = when === 'never';

	const count = (parsed.body || '').split(/\r|\n/).length;

	// Get complete message split into lines
	const lines = (parsed.raw || '')
		.split(/\r|\n/)
		.slice(count + 1);

	const [leading] = lines;

	// Check if the first line of footer is empty
	const succeeds = leading === '';

	return [
		negated ? !succeeds : succeeds,
		[
			'footer',
			negated ? 'may not' : 'must',
			'have leading blank line'
		]
		.filter(Boolean)
		.join(' ')
	];
};
