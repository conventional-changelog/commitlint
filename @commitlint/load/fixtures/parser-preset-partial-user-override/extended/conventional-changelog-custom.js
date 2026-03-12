module.exports = {
	parserOpts: {
		headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
		headerCorrespondence: ['type', 'scope', 'subject'],
	},
};
