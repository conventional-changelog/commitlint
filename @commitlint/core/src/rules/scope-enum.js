import ensureEnum from '../library/ensure-enum';
import message from '../library/message';

export default (parsed, when, value) => {
	if (!parsed.scope) {
		return [true, ''];
	}

	const negated = when === 'never';
	const result = value.length === 0 || ensureEnum(parsed.scope, value);

	return [
		negated ? !result : result,
		message([
			`scope must`,
			negated ? `not` : null,
			`be one of [${value.join(', ')}]`
		])
	];
};
