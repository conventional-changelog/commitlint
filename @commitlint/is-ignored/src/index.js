import semver from 'semver';

const WILDCARDS = [
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
	c => c.match(/^Automatic merge from (.*)/),
	c => c.match(/^Auto-merged (.*?) into (.*)/)
];

export default function isIgnored(commit = '') {
	return WILDCARDS.some(w => w(commit));
}
