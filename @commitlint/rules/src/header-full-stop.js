import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {header} = parsed;
	const negated = when === 'never';
	const hasStop = header[header.length - 1] === value;

	return [
		negated ? !hasStop : hasStop,
		message(['header', negated ? 'may not' : 'must', 'end with full stop'])
	];
};
