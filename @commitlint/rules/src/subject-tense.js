export default (parsed, when, value) => {
	return [
		false,
		`rules.subject-tense is deprecated. Received [${when}, [${value.join(
			', '
		)}]]`
	];
};
