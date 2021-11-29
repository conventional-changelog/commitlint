module.exports = {
	rules: {
		outer: [1, 'never', true],
		inner: [1, 'never', false],
		child: [1, 'never', false],
	},
};
