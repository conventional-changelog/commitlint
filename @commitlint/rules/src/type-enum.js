import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {type: input} = parsed;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const result = ensure.enum(input, value);

	return [
		negated ? !result : result,
		message([
			`type must`,
			negated ? `not` : null,
			`be one of [${value.join(', ')}]`
		])
	];
};
