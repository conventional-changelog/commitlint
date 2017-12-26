import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {body} = parsed;

	if (!body) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensure.case(body, value);
	return [
		negated ? !result : result,
		message([`body must`, negated ? `not` : null, `be ${value}`])
	];
};
