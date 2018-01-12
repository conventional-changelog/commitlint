import test from 'ava';
import isIgnored from '.';

const VERSION_MESSAGES = [
	'0.0.1',
	'0.1.0',
	'1.0.0',
	'0.0.1-alpha',
	'0.0.1-some-crazy-tag',
	'0.0.1-0',
	'0.0.1-999',
	'0.0.1-alpha.0',
	'0.0.1-alpha.999',
	'0.0.1-some-crazy-tag.0',
	'0.0.1-some-crazy-tag.999',
	'0.0.1-1e69d54',
	'v0.0.1',
	' v3.0.0'
];

const AMENDMENTS = [
	'Signed-off-by: Developer <example@example.com>',
	'Change-Id: I895114872a515a269487a683124b63303818e19c',
	'Signed-off-by: Developer <example@example.com>\nChange-Id: I895114872a515a269487a683124b63303818e19c'
];

const AMENDED_VERSION_MESSAGES = VERSION_MESSAGES.reduce((results, message) => {
	return [
		...results,
		...AMENDMENTS.map(amendment => `${message}\n\n${amendment}`)
	];
}, []);

test('should return false when called without arguments', t => {
	t.false(isIgnored());
});

test('should return false when called with empty string', t => {
	t.false(isIgnored(''));
});

test('should return false for normal commit', t => {
	t.false(isIgnored('initial commit'));
});

test('should return true for branch merges', t => {
	t.true(isIgnored("Merge branch 'iss53'"));
});

test('should return true for branch merges with newline characters', t => {
	t.true(isIgnored("Merge branch 'ctrom-YarnBuild'\n"));
	t.true(isIgnored("Merge branch 'ctrom-YarnBuild'\r\n"));
});

test('should return true for branch merges with multiple newline characters', t => {
	t.true(isIgnored("Merge branch 'ctrom-YarnBuild'\n\n\n"));
	t.true(isIgnored("Merge branch 'ctrom-YarnBuild'\r\n\r\n\r\n"));
});

test('should return true for merged PRs', t => {
	t.true(isIgnored('Merge pull request #369'));
});

test('should return true for revert commits', t => {
	t.true(
		isIgnored(
			`Revert "docs: add recipe for linting of all commits in a PR (#36)"\n\nThis reverts commit 1e69d542c16c2a32acfd139e32efa07a45f19111.`
		)
	);
	t.true(
		isIgnored(
			`revert "docs: add recipe for linting of all commits in a PR (#36)"\n\nThis reverts commit 1e69d542c16c2a32acfd139e32efa07a45f19111.`
		)
	);
});

test('should ignore npm semver commits', t => {
	VERSION_MESSAGES.forEach(message => t.true(isIgnored(message)));
});

test('should ignore npm semver commits with chore', t => {
	VERSION_MESSAGES.forEach(message => t.true(isIgnored(`chore: ${message}`)));
	VERSION_MESSAGES.forEach(message =>
		t.true(isIgnored(`chore(release): ${message}`))
	);
});

test('should ignore npm semver commits with footers', t => {
	AMENDED_VERSION_MESSAGES.forEach(message => t.true(isIgnored(message)));
});

test('should return true fixup commits', t => {
	t.true(isIgnored('fixup! initial commit'));
});

test('should return true squash commits', t => {
	t.true(isIgnored('squash! initial commit'));
});
