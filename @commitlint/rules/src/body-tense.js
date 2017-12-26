export default (parsed, when, value) => {
	return [
		false,
		`rules.body-tense is deprecated. Received [${when}, [${value.join(', ')}]]`
	];
};
