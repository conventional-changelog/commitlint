import franc from 'franc';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const detected = franc.all(parsed.subject)
		.filter(lang => lang[1] >= 0.45)
		.map(lang => lang[0]);
	const matches = detected.indexOf(value) > -1;

	return [
		negated ? !matches : matches,
		[
			'commit',
			negated ? 'may not' : 'must',
			`be in languague "${value}", was one of: ${detected.join(', ')}`
		]
		.filter(Boolean)
		.join(' ')
	];
};
