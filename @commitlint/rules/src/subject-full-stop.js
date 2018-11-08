import message from '@commitlint/message';

export default (parsed, when, value) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const hasStop = input[input.length - 1] === value;

	return [
		negated ? !hasStop : hasStop,
		message(['subject', negated ? 'may not' : 'must', 'end with full stop'])
	];
};
