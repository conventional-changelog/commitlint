import ensureCase from '../library/ensure-case';
import message from '../library/message';

export default (parsed, when, value) => {
	const {subject} = parsed;

	if (!subject) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensureCase(subject, value);
	return [
		negated ? !result : result,
		message([`subject must`, negated ? `not` : null, `be ${value}`])
	];
};
