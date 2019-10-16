module.exports = Promise.resolve().then(
	() =>
		function factory() {
			return {
				parserOpts: {
					headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
				}
			};
		}
);
