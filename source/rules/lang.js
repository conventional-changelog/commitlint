import franc from 'franc';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const detected = franc.all(parsed.subject);
	const matches = Object.keys(detected).indexOf(value) > -1;
	return [
		negated ? !matches : matches,
		[
			'commit',
			negated ? 'may not' : 'must',
			`be in languague ${value}`
		]
		.filter(Boolean)
		.join(' ')
	];
};
