/**
 * Get name for a given rule id
 * @param  {string} id of the rule
 * @return {[type]} name of the rule
 */
export default function getRuleName(id) {
	const fragments = id.split('-');
	return fragments.length > 1 ? fragments.slice(1).join('-') : fragments[0];
}
