import semver from 'semver';

const WILDCARDS = [
	c =>
		c.match(
			/^(Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?))$)/
		),
	c => c.match(/^(R|r)evert (.*)/),
	c => c.match(/^(fixup|squash)!/),
	c => semver.valid(c.trim())
];

export default function isIgnored(commit = '') {
	return WILDCARDS.some(w => w(commit));
}
