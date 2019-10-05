import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {header} = parsed;
	const negated = when === 'never';
	const matches = new RegExp(value, 'u').test(header);

	return [
		negated !== matches,
		message([
			'header',
			negated ? 'may not' : 'must',
			'match the given regex pattern'
		])
	];
};
