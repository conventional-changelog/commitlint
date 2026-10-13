import { describe, test, expect } from "vitest";
import type { TargetCaseType } from "@commitlint/types";

import toCase from "./to-case.js";

// Characterization tests: these pin what the case rules do today, so that a change
// in the underlying string library cannot alter rule verdicts unnoticed.
// Columns: input, camel-case, kebab-case, snake-case, pascal-case, start-case
const targets: TargetCaseType[] = [
	"camel-case",
	"kebab-case",
	"snake-case",
	"pascal-case",
	"start-case",
];

type Row = [
	input: string,
	camel: string,
	kebab: string,
	snake: string,
	pascal: string,
	start: string,
];

const table: Record<string, Row[]> = {
	digits: [
		["es2015", "es2015", "es-2015", "es_2015", "Es2015", "Es 2015"],
		["i18n", "i18N", "i-18-n", "i_18_n", "I18N", "I 18 N"],
		["oauth2", "oauth2", "oauth-2", "oauth_2", "Oauth2", "Oauth 2"],
		["v2", "v2", "v-2", "v_2", "V2", "V 2"],
		["utf8-bom", "utf8Bom", "utf-8-bom", "utf_8_bom", "Utf8Bom", "Utf 8 Bom"],
		["x86_64", "x8664", "x-86-64", "x_86_64", "X8664", "X 86 64"],
	],
	punctuation: [
		["foo:bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["a&b", "aB", "a-b", "a_b", "AB", "A B"],
		["c++", "c", "c", "c", "C", "C"],
		["$scope", "scope", "scope", "scope", "Scope", "Scope"],
		["feat#123", "feat123", "feat-123", "feat_123", "Feat123", "Feat 123"],
		[
			"Fix: Something",
			"fixSomething",
			"fix-something",
			"fix_something",
			"FixSomething",
			"Fix Something",
		],
		["Foo, Bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
	],
	accents: [
		["über", "uber", "uber", "uber", "Uber", "Uber"],
		["naïve-bayes", "naiveBayes", "naive-bayes", "naive_bayes", "NaiveBayes", "Naive Bayes"],
	],
	"separators and word boundaries": [
		["foo bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["foo  bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["fooBar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["FooBar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["foo-bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["foo_bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["foo.bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["foo/bar", "fooBar", "foo-bar", "foo_bar", "FooBar", "Foo Bar"],
		["HTTPServer", "httpServer", "http-server", "http_server", "HttpServer", "HTTP Server"],
		[
			"Add Oauth2 Login",
			"addOauth2Login",
			"add-oauth-2-login",
			"add_oauth_2_login",
			"AddOauth2Login",
			"Add Oauth 2 Login",
		],
		["", "", "", "", "", ""],
	],
};

describe.each(Object.entries(table))("%s", (_group, rows) => {
	test.each(rows)("%j", (input, ...expected) => {
		const actual = targets.map((target) => toCase(input, target));
		expect(actual).toEqual(expected);
	});
});

test.each<[TargetCaseType, string]>([
	["upper-case", "ADD OAUTH2 ÜBER-LOGIN"],
	["uppercase", "ADD OAUTH2 ÜBER-LOGIN"],
	["lower-case", "add oauth2 über-login"],
	["lowercase", "add oauth2 über-login"],
	["lowerCase", "add oauth2 über-login"],
	["sentence-case", "Add Oauth2 Über-Login"],
	["sentencecase", "Add Oauth2 Über-Login"],
])("%s leaves digits, punctuation and accents in place", (target, expected) => {
	expect(toCase("add Oauth2 Über-Login", target)).toBe(expected);
});

test("throws for an unknown target case", () => {
	expect(() => toCase("foo", "unknown" as TargetCaseType)).toThrow(
		'to-case: Unknown target case "unknown"',
	);
});
