// TODO
// * rename this to "subject-first-character"
import ensureCase from '../library/ensure-case';

export default (parsed, when = 'always', value = 'uppercase') => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const result = ensureCase(input[0], value);

	return [
		negated ? !result : result,
		[
			`message must`,
			negated ? `not` : null,
			`be ${value}`
		]
		.filter(Boolean)
		.join(' ')
	];
};
