import message from '@commitlint/message';

export default (parsed, when, value) => {
	const {subject} = parsed;
	const negated = when === 'never';
	const matches = new RegExp(value, 'u').test(subject);

	return [
		negated !== matches,
		message([
			'subject',
			negated ? 'may not' : 'must',
			'match the given regex pattern'
		])
	];
};
