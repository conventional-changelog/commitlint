import ensureEnum from '../library/ensure-enum';

export default (parsed, when, value) => {
	const {type: input} = parsed;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const result = ensureEnum(input, value);

	return [
		negated ? !result : result,
		[`scope must`, negated ? `not` : null, `be one of [${value.join(', ')}]`]
			.filter(Boolean)
			.join(' ')
	];
};
