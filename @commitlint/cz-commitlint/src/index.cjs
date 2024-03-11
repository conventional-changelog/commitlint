/** @type {Awaited<typeof import('./index.js')>['prompter']} */
exports.prompter = async (...args) => {
	(await import('./index.js')).prompter(...args);
};
