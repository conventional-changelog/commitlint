import toLines from '../library/to-lines';
import message from '../library/message';

export default (parsed, when, value) => {
	const lines = toLines(parsed.raw).filter(Boolean);
	const last = lines[lines.length - 1];

	const negated = when === 'never';
	const hasSignedOffBy = last.startsWith(value);

	return [
		negated ? !hasSignedOffBy : hasSignedOffBy,
		message(['message', negated ? 'must not' : 'must', 'be signed off'])
	];
};
