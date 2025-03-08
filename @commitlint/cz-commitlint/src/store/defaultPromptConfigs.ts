export default {
	settings: {
		scopeEnumSeparator: ",",
		enableMultipleScopes: false,
	},
	messages: {
		skip: "(press enter to skip)",
		max: "(max %d chars)",
		min: "(min %d chars)",
		emptyWarning: "(%s is required)",
		upperLimitWarning: "%s is %d characters longer than the upper limit",
		lowerLimitWarning: "%s is %d characters less than the lower limit",
	},
	questions: {
		type: {
			description: "<type> holds information about the goal of a change.",
		},
		scope: {
			description:
				"<scope> marks which sub-component of the project is affected",
		},
		subject: {
			description: "<subject> is a short, high-level description of the change",
		},
		body: {
			description: "<body> holds additional information about the change",
		},
		footer: {
			description:
				"<footer> holds further meta data, such as breaking changes and issue ids",
		},
	},
};
