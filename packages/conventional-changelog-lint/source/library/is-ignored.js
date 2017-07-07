import semver from 'semver';

const WILDCARDS = [
	c => c.match(/^(Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?))$)/),
	c => c.match(/^(R|r)evert (.*)/),
	c => semver.valid(c)
];

export default function isIgnored(commit = '') {
	return WILDCARDS.some(w => w(commit));
}
