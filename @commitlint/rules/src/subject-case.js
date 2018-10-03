import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';

const negated = when => when === 'never';

export default (parsed, when, value) => {
	const {subject} = parsed;

	if (typeof subject !== 'string' || !subject.match(/^[a-z]/i)) {
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
		const r = ensure.case(subject, check.case);
		return negated(check.when) ? !r : r;
	});

	const list = checks.map(c => c.case).join(', ');

	return [
		negated(when) ? !result : result,
		message([`subject must`, negated(when) ? `not` : null, `be ${list}`])
	];
};
