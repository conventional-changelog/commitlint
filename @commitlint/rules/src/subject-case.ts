import {case as ensureCase} from '@commitlint/ensure';
import message from '@commitlint/message';
import {TargetCaseType, SyncRule} from '@commitlint/types';

/**
 * Since the rule requires first symbol of a subject to be a letter, use
 * combination of Unicode `Cased_Letter` and `Other_Letter` categories now to
 * allow non-Latin alphabets as well.
 *
 * Do not use `Letter` category directly to avoid capturing `Modifier_Letter`
 * (which just modifiers letters, so we probably shouldn't anyway) and to stay
 * close to previous implementation.
 *
 * Also, typescript does not seem to support almost any longhand category name
 * (and even short for `Cased_Letter` too) so list all required letter
 * categories manually just to prevent it from complaining about unknown stuff.
 *
 * @see [Unicode Categories]{@link https://www.regular-expressions.info/unicode.html}
 */
const startsWithLetterRegex = /^[\p{Ll}\p{Lu}\p{Lt}\p{Lo}]/iu;

const negated = (when?: string) => when === 'never';

export const subjectCase: SyncRule<TargetCaseType | TargetCaseType[]> = (
	parsed,
	when = 'always',
	value = []
) => {
	const {subject} = parsed;

	if (typeof subject !== 'string' || !subject.match(startsWithLetterRegex)) {
		return [true];
	}

	const checks = (Array.isArray(value) ? value : [value]).map((check) => {
		if (typeof check === 'string') {
			return {
				when: 'always',
				case: check,
			};
		}
		return check;
	});

	const result = checks.some((check) => {
		const r = ensureCase(subject, check.case);
		return negated(check.when) ? !r : r;
	});

	const list = checks.map((c) => c.case).join(', ');

	return [
		negated(when) ? !result : result,
		message([`subject must`, negated(when) ? `not` : null, `be ${list}`]),
	];
};
