import ensureContains from '../library/ensure-contains';
import message from '../library/message';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const result = value.length === 0 || ensureContains(parsed.footer, value);

	return [
		negated ? !result : result,
		message([
			`footer content must`,
			negated ? `not` : null,
			`pass the regular expression: ${value.toString()}`
		])
	];
};
