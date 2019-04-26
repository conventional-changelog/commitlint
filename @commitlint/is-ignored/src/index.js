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
	const ignores = typeof opts.ignores === 'undefined' ? [] : opts.ignores;

	if (!Array.isArray(ignores)) {
		throw new Error(
			`ignores must be of type array, received ${ignores} of type ${typeof ignores}`
		);
	}

	const invalids = ignores.filter(c => typeof c !== 'function');

	if (invalids.length > 0) {
		throw new Error(
			`ignores must be array of type function, received items of type: ${invalids
				.map(i => typeof i)
				.join(', ')}`
		);
	}

	const base = opts.defaults === false ? [] : WILDCARDS;
	return [...base, ...ignores].some(w => w(commit));
}
