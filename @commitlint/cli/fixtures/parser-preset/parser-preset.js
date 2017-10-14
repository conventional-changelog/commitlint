module.exports = {
	parserOpts: {
		headerPattern: /^----(\w*)\((\w*)\):\s(.*)$/,
		headerCorrespondence: ['type', 'scope', 'subject']
	}
};
