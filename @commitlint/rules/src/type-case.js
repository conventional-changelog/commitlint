import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {type} = parsed;

	if (!type) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensure.case(type, value);
	return [
		negated ? !result : result,
		message([`type must`, negated ? `not` : null, `be ${value}`])
	];
};
