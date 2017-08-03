import ensureEnum from '../library/ensure-enum';
import message from '../library/message';

export default (parsed, when, value) => {
	const {type: input} = parsed;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const result = ensureEnum(input, value);

	return [
		negated ? !result : result,
		message([
			`type must`,
			negated ? `not` : null,
			`be one of [${value.join(', ')}]`
		])
	];
};
