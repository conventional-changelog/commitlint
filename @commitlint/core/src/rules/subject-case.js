import ensureCase from '../library/ensure-case';
import message from '../library/message';

const negated = when => when === 'never';

export default (parsed, when, value) => {
	const {subject} = parsed;

	if (typeof subject !== 'string') {
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
		const r = ensureCase(subject, check.case);
		return negated(check.when) ? !r : r;
	});

	return [
		negated(when) ? !result : result,
		message([`subject must`, negated ? `not` : null, `be ${value.join(', ')}`])
	];
};
