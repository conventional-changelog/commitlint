import toLines from '@commitlint/to-lines';
import message from '@commitlint/message';

export default (parsed, when) => {
	// Flunk if no footer is found
	if (!parsed.footer) {
		return [true];
	}

	const negated = when === 'never';
	const rawLines = toLines(parsed.raw);
	const bodyLines = toLines(parsed.body);
	const bodyOffset = bodyLines.length > 0 ? rawLines.indexOf(bodyLines[0]) : 1;
	const [leading] = rawLines.slice(bodyLines.length + bodyOffset);

	// Check if the first line of footer is empty
	const succeeds = leading === '';

	return [
		negated ? !succeeds : succeeds,
		message(['footer', negated ? 'may not' : 'must', 'have leading blank line'])
	];
};
