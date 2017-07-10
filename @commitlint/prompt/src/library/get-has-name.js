import getRuleName from './get-rule-name';

/**
 * Get a predecate matching rule definitions with a given name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export default function getHasName(name) {
	return rule => getRuleName(rule[0]) === name;
}
