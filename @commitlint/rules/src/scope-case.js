import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {scope} = parsed;

	if (!scope) {
		return [true];
	}

	const negated = when === 'never';

	const result = ensure.case(scope, value);
	return [
		negated ? !result : result,
		message([`scope must`, negated ? `not` : null, `be ${value}`])
	];
};
