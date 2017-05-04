import ensureCase from '../library/ensure-case';

export default (parsed, when, value) => {
	const {scope} = parsed;

	if (!scope) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensureCase(parsed.scope, value);
	return [
		negated ? !result : result,
		[
			`scope must`,
			negated ? `not` : null,
			`be ${value}`
		]
		.filter(Boolean)
		.join(' ')
	];
};
