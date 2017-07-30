import message from '../library/message';

export default (parsed, when, value) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const hasStop = input[input.length - 1] === value;

	return [
		negated ? !hasStop : hasStop,
		message(['message', negated ? 'may not' : 'must', 'end with full stop'])
	];
};
