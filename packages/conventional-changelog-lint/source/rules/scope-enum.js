import ensureEnum from '../library/ensure-enum';

export default (parsed, when, value) => {
	if (!parsed.scope) {
		return [true, ''];
	}

	const negated = when === 'never';
	const result = value.length === 0 || ensureEnum(parsed.scope, value);

	return [
		negated ? !result : result,
		[
			`scope must`,
			negated ? `not` : null,
			`be one of [${value.join(', ')}]`
		]
		.filter(Boolean)
		.join(' ')
	];
};
