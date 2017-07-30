import ensureTense from '../library/ensure-tense';
import message from '../library/message';

export default (parsed, when, value) => {
	const tenses = Array.isArray(value) ? value : value.allowed || [];
	const ignoreConfig = Array.isArray(value) ? [] : value.ignored || [];

	const negated = when === 'never';
	const ignored = [...ignoreConfig, ...parsed.notes.map(note => note.title)];
	const {matches, offending} = ensureTense(parsed.body, tenses, {ignored});
	const offenders = offending
		.map(item => [item.lemma, item.tense].join(' - '))
		.join(',');

	return [
		negated ? !matches : matches,
		message([
			`tense of body must`,
			negated ? `not` : null,
			`be ${value}. Verbs in other tenses: ${offenders}`
		])
	];
};
