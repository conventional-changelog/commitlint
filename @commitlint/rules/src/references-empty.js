import message from '@commitlint/message';

export default (parsed, when = 'never', value = []) => {
	const notEmptyType = value.indexOf(parsed.type) !== -1;
	if (value.length > 0 && !notEmptyType) {
		return [true];
	}
	const negated = when === 'always';
	const notEmpty = parsed.references.length > 0;
	return [
		negated ? !notEmpty : notEmpty,
		message([
			'references',
			negated ? 'must' : 'may not',
			'be empty',
			notEmptyType ? `when type of [${value.join(', ')}]` : ''
		])
	];
};
