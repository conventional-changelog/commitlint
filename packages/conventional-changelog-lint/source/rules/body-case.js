import ensureCase from '../library/ensure-case';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const result = ensureCase(parsed.body, value);
	return [
		negated ? !result : result,
		[
			`body must`,
			negated ? `not` : null,
			`be ${value}`
		]
		.filter(Boolean)
		.join(' ')
	];
};
