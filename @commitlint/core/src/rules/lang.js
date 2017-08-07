import message from '../library/message';
import ensureLanguage from '../library/ensure-language';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const {matches, detected} = ensureLanguage(parsed.subject, value);

	return [
		negated ? !matches : matches,
		message([
			'commit',
			negated ? 'may not' : 'must',
			`be in language "${value}", was one of: ${detected.join(', ')}`
		])
	];
};
