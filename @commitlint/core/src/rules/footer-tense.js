export default (parsed, when, value) => {
	return [
		false,
		`rules.footer-tense is deprecated. Received [${when}, [${value.join(
			', '
		)}]]`
	];
};
