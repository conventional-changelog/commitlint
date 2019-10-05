import message from '@commitlint/message';

export default (parsed, when, value) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const stop = input[input.length - 1];
	const hasStop =
		value.length > 1 ? new RegExp(value, 'u').test(stop) : stop === value;

	return [
		negated ? !hasStop : hasStop,
		message(['subject', negated ? 'may not' : 'must', 'end with full stop'])
	];
};
