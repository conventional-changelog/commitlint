import message from '../library/message';
import ensureCase from '../library/ensure-case';

export default (parsed, when, value) => {
	const {scope} = parsed;

	if (!scope) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensureCase(scope, value);
	return [
		negated ? !result : result,
		message([`scope must`, negated ? `not` : null, `be ${value}`])
	];
};
