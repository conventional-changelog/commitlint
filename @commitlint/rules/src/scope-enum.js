import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

export default (parsed, when, value) => {
	if (!parsed.scope) {
		return [true, ''];
	}

	const negated = when === 'never';
	const result = value.length === 0 || ensure.enum(parsed.scope, value);

	return [
		negated ? !result : result,
		message([
			`scope must`,
			negated ? `not` : null,
			`be one of [${value.join(', ')}]`
		])
	];
};
