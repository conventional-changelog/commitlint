module.exports = {
	parserOpts: {
		headerPattern: /^(\w*)\((\w*)\)-(\w*)\s(.*)$/,
		headerCorrespondence: ['type', 'scope', 'ticket', 'subject']
	}
};
