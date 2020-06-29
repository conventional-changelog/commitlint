module.exports = {
	extends: [],
	plugins: [{
		rules: {
			'hello-world-rule': ({ subject }) => {
				const HELLO_WORLD = 'Hello World';
				return [
				  subject.includes(HELLO_WORLD),
				  `Your subject should contain ${HELLO_WORLD} message`
				];
			 },
			 'is-positive': ({ subject }) => {
				const POSITIVE_EMOJI = ':)';
				return [
				  subject.includes(POSITIVE_EMOJI),
				  `Your subject should contain ${POSITIVE_EMOJI} message`
				];
			 }
  		}
	}]
};
