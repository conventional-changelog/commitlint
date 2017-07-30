import ensureCase from '../library/ensure-case';
import message from '../library/message';

export default (parsed, when, value) => {
	const {body} = parsed;

	if (!body) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensureCase(body, value);
	return [
		negated ? !result : result,
		message([`body must`, negated ? `not` : null, `be ${value}`])
	];
};
