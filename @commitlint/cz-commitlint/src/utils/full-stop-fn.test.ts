import { test, expect } from "vitest";
import { RuleConfigSeverity } from "@commitlint/types";

import getFullStopFn from "./full-stop-fn.js";

test("should not apply", () => {
	let rule = getFullStopFn([RuleConfigSeverity.Disabled]);
	expect(rule("test.")).toBe("test.");
	expect(rule("test")).toBe("test");
	expect(rule("test..")).toBe("test..");
	expect(rule("")).toBe("");

	rule = getFullStopFn();
	expect(rule("test.")).toBe("test.");
	expect(rule("test")).toBe("test");
	expect(rule("test..")).toBe("test..");
	expect(rule("")).toBe("");

	rule = getFullStopFn([RuleConfigSeverity.Disabled, "always"]);
	expect(rule("test.")).toBe("test.");
	expect(rule("test")).toBe("test");
	expect(rule("test..")).toBe("test..");
	expect(rule("")).toBe("");

	rule = getFullStopFn([RuleConfigSeverity.Disabled, "always", 1]);
	expect(rule("test.")).toBe("test.");
	expect(rule("test")).toBe("test");
	expect(rule("test..")).toBe("test..");
	expect(rule("")).toBe("");

	rule = getFullStopFn([RuleConfigSeverity.Disabled, "never"]);
	expect(rule("test.")).toBe("test.");
	expect(rule("test")).toBe("test");
	expect(rule("test..")).toBe("test..");
	expect(rule("")).toBe("");

	rule = getFullStopFn([RuleConfigSeverity.Disabled, "never", ["."]]);
	expect(rule("test.")).toBe("test.");
	expect(rule("test")).toBe("test");
	expect(rule("test..")).toBe("test..");
	expect(rule("")).toBe("");
});

test("should add full stop", () => {
	let rule = getFullStopFn([RuleConfigSeverity.Error, "always", "."]);
	expect(rule("test")).toBe("test.");
	expect(rule("test.")).toBe("test.");
	expect(rule("")).toBe(".");

	rule = getFullStopFn([RuleConfigSeverity.Error, "always", "\n"]);
	expect(rule("test")).toBe("test\n");
	expect(rule("test.")).toBe("test.\n");
	expect(rule("")).toBe("\n");
});

test("should remove full stop", () => {
	let rule = getFullStopFn([RuleConfigSeverity.Error, "never", "."]);
	expect(rule("test")).toBe("test");
	expect(rule("test.")).toBe("test");
	expect(rule("")).toBe("");
	expect(rule("test..")).toBe("test");
	expect(rule("test.end")).toBe("test.end");

	rule = getFullStopFn([RuleConfigSeverity.Error, "never", "\n"]);
	expect(rule("test")).toBe("test");
	expect(rule("test.")).toBe("test.");
	expect(rule("test\n\n")).toBe("test");
	expect(rule("test.\n")).toBe("test.");
});
