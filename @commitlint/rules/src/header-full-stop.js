import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {header} = parsed;
	const negated = when === 'never';
	const stop = header[header.length - 1];
	const hasStop =
		value.length > 1 ? new RegExp(value, 'u').test(stop) : stop === value;

	return [
		negated ? !hasStop : hasStop,
		message(['header', negated ? 'may not' : 'must', 'end with full stop'])
	];
};
