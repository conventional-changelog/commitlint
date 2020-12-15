import getRuleName from './get-rule-name';
import {RuleEntry} from './types';

/**
 * Get a predicate matching rule definitions with a given name
 */
export default function getHasName(name: string) {
	return <T extends RuleEntry>(
		rule: RuleEntry
	): rule is Exclude<T, [string, undefined]> => getRuleName(rule[0]) === name;
}
