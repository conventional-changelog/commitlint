import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

const negated = when => when === 'never';

export default (parsed, when, value) => {
	const {scope} = parsed;

	if (!scope) {
		return [true];
	}

	const checks = (Array.isArray(value) ? value : [value]).map(check => {
		if (typeof check === 'string') {
			return {
				when: 'always',
				case: check
			};
		}
		return check;
	});

	// Scopes may contain slash-delimiters to separate them and mark them as individual segments.
	// This means that each of these segments should be tested separately with `ensure`.
	const delimiters = /(\/|\\)/g;
	const scopeSegments = scope.split(delimiters);

	const result = checks.some(check => {
		const r = scopeSegments.every(
			segment => delimiters.test(segment) || ensure.case(segment, check.case)
		);

		return negated(check.when) ? !r : r;
	});

	const list = checks.map(c => c.case).join(', ');

	return [
		negated(when) ? !result : result,
		message([`scope must`, negated(when) ? `not` : null, `be ${list}`])
	];
};
