module.exports = Promise.resolve().then(() => {
	return {
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
		}
	};
});
