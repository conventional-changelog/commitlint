import ensureEnum from '../library/ensure-enum';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const result = ensureEnum(parsed.scope, value);
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
