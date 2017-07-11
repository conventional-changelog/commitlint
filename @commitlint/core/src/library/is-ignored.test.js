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

test('should return true for npm version commits', t => {
	t.true(isIgnored(`0.0.1`));
	t.true(isIgnored(`0.1.0`));
	t.true(isIgnored(`1.0.0`));
	t.true(isIgnored(`0.0.1-alpha`));
	t.true(isIgnored(`0.0.1-some-crazy-tag`));
	t.true(isIgnored(`0.0.1-0`));
	t.true(isIgnored(`0.0.1-999`));
	t.true(isIgnored(`0.0.1-alpha.0`));
	t.true(isIgnored(`0.0.1-alpha.999`));
	t.true(isIgnored(`0.0.1-some-crazy-tag.0`));
	t.true(isIgnored(`0.0.1-some-crazy-tag.999`));
	t.true(isIgnored(`0.0.1-1e69d54`));
	t.true(isIgnored(`v0.0.1`));
	t.true(isIgnored(` v3.0.0`));
});

test('should return true fixup commits', t => {
	t.true(isIgnored('fixup! initial commit'));
});

test('should return true squash commits', t => {
	t.true(isIgnored('squash! initial commit'));
});
