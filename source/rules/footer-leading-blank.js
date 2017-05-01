export default (parsed, when) => {
	// flunk if no footer is found
	if (!parsed.footer) {
		return [true];
	}

	const negated = when === 'never';

	// get complete body split into lines
	const lines = (parsed.raw || '').split(/\r|\n/).slice(2);
	const [leading] = lines;

	// check if the first line of body is empty
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
