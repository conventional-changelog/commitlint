module.exports = {
	rules: {
		'type-empty': [2, 'never'],
		'subject-empty': [2, 'never']
	},
	ignores: [commit => commit === 'Initialize project using Create React App']
};
