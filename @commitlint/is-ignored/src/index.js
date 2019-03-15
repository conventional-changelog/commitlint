import semver from 'semver';

export const WILDCARDS = [
	c =>
		c.match(
			/^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m
		),
	c => c.match(/^(R|r)evert (.*)/),
	c => c.match(/^(fixup|squash)!/),
	c =>
		semver.valid(
			c
				.split('\n')
				.shift()
				.replace(/^chore(\([^)]+\))?:/, '')
				.trim()
		),
	c => c.match(/^Merged (.*?)(in|into) (.*)/),
	c => c.match(/^Merge remote-tracking branch (.*)/),
	c => c.match(/^Automatic merge(.*)/),
	c => c.match(/^Auto-merged (.*?) into (.*)/)
];

export default function isIgnored(commit = '', opts = {}) {
	let wildcards = [];
	if (opts.ignoredMessages) {
		if (opts.disableDefaultIgnoredMessages) {
			wildcards = wildcards.concat(WILDCARDS);
		}
		if (!Array.isArray(opts.ignoredMessages)) {
			throw new Error('ignoredMessages must be an Array');
		}
		opts.ignoredMessages.forEach(ignoreConfig => {
			if (typeof ignoreConfig === 'function') {
				wildcards.push(ignoreConfig);
			} else if (ignoreConfig instanceof RegExp) {
				wildcards.push(c => c.match(ignoreConfig));
			} else if (typeof ignoreConfig === 'string') {
				wildcards.push(c => c.match(new RegExp(ignoreConfig)));
			} else {
				throw new Error(
					'ignoredMessage element must be a function, string or RegExp'
				);
			}
		});
	} else if (opts.disableDefaultIgnoredMessages) {
		return false;
	} else {
		wildcards = WILDCARDS;
	}
	return wildcards.some(w => w(commit));
}
