import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {Rule} from './types';

const negated = (when?: string) => when === 'never';

export const headerCase: Rule<
	ensure.TargetCaseType | ensure.TargetCaseType[]
> = (parsed, when = 'always', value = []) => {
	const {header} = parsed;

	if (typeof header !== 'string' || !header.match(/^[a-z]/i)) {
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
		const r = ensure.case(header, check.case);
		return negated(check.when) ? !r : r;
	});

	const list = checks.map(c => c.case).join(', ');

	return [
		negated(when) ? !result : result,
		message([`header must`, negated(when) ? `not` : null, `be ${list}`])
	];
};
