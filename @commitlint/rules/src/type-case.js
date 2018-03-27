import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

const negated = when => when === 'never';

export default (parsed, when, value) => {
	const {type} = parsed;

	if (!type) {
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

	const result = checks.some(check => {
		const r = ensure.case(type, check.case);
		return negated(check.when) ? !r : r;
	});

	const list = checks.map(c => c.case).join(', ');

	return [
		negated(when) ? !result : result,
		message([`type must`, negated(when) ? `not` : null, `be ${list}`])
	];
};
