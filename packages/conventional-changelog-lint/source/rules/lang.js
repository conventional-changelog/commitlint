import ensureLanguage from '../library/ensure-language';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const {matches, detected} = ensureLanguage(parsed.subject, value);

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
