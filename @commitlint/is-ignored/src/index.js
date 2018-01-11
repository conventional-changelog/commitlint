import semver from 'semver';

const WILDCARDS = [
	c =>
		c.match(
			/^(Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?))(?:\r?\n)*$)/
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
		)
];

export default function isIgnored(commit = '') {
	return WILDCARDS.some(w => w(commit));
}
