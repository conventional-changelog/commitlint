import ensureCase from '../library/ensure-case';

export default (parsed, when, value) => {
	const {subject} = parsed;

	if (!subject) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensureCase(subject, value);
	return [
		negated ? !result : result,
		[
			`subject must`,
			negated ? `not` : null,
			`be ${value}`
		]
		.filter(Boolean)
		.join(' ')
	];
};
