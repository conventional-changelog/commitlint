/**
 * Get name for a given rule id
 * @param id of the rule
 * @return name of the rule
 */
export default function getRuleName(id: string): string {
	const fragments = id.split('-');
	return fragments.length > 1 ? fragments.slice(1).join('-') : fragments[0];
}
