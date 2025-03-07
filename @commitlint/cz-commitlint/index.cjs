'use strict';

/** @type {Awaited<typeof import('./lib/index.js')>['prompter']} */
exports.prompter = async (...args) => {
	(await import('./lib/index.js')).prompter(...args);
};
