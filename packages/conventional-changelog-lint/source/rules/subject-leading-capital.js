import ensureCase from '../library/ensure-case';

export default (parsed, when, value) => {
	const negated = when === 'never';
	const {subject} = parsed;
	const result = ensureCase(subject[0], value);
	return [
		negated ? !result : result,
		[
			`message must`,
			negated ? `not` : null,
			`be ${value}`
		]
		.filter(Boolean)
		.join(' ')
	];
};
