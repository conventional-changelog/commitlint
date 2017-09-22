import test from 'ava';
import isIgnored from './is-ignored';

test('should return false when called without arguments', t => {
	t.false(isIgnored());
});

test('should return false when called with empty string', t => {
	t.false(isIgnored(''));
});

test('should return false for normal commit', t => {
	t.false(isIgnored('initial commit'));
});

test('should return false for branch merges', t => {
	t.true(isIgnored("Merge branch 'iss53'"));
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

const versionCommitInputs = [
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
for (let i = 0, len = versionCommitInputs.length; i < len; i++) {
	const input = versionCommitInputs[i];
	const commitMsg1 = input;
	const commitMsg2 = `${input}\n\nSigned-off-by: Developer <example@example.com>`;
	const commitMsg3 = `${input}\n\nChange-Id: I895114872a515a269487a683124b63303818e19c`;
	const commitMsg4 = `${input}\n\nSigned-off-by: Developer <example@example.com>\nChange-Id: I895114872a515a269487a683124b63303818e19c`;

	console.log(commitMsg1, commitMsg2, commitMsg3, commitMsg4);

	test(`should return true for version commit permutations of '${input}'`, t => {
		t.true(isIgnored(commitMsg1));
		t.true(isIgnored(commitMsg2));
		t.true(isIgnored(commitMsg3));
		t.true(isIgnored(commitMsg4));
	});
}

test('should return true fixup commits', t => {
	t.true(isIgnored('fixup! initial commit'));
});

test('should return true squash commits', t => {
	t.true(isIgnored('squash! initial commit'));
});
