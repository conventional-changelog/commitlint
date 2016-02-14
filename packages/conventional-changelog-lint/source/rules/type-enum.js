import ensureEnum from '../library/ensure-enum';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const result = ensureEnum(parsed.type, value);
	return [
		negated ? !result : result,
		[
			`type must`,
			negated ? `not` : null,
			`be one of [${value.map(e => `"${e}"`).join(', ')}]`
		]
		.filter(Boolean)
		.join(' ')
	];
};
