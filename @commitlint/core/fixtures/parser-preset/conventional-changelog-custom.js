module.exports = Promise.resolve()
	.then(() => ({
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
		}
	}));
