import ensureCase from '../library/ensure-case';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const result = ensureCase(parsed.subject, value);
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
