import util from "node:util";
import isIgnored from "@commitlint/is-ignored";
import parse from "@commitlint/parse";
import defaultRules from "@commitlint/rules";
import type {
	LintOptions,
	LintOutcome,
	LintRuleOutcome,
	Rule,
	BaseRule,
	RuleType,
	QualifiedRules,
	Position,
} from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

import { buildCommitMessage } from "./commit-message.js";

function offsetToPosition(raw: string, offset: number): Position {
	const before = raw.slice(0, offset);
	const newlineCount = (before.match(/\n/g) || []).length;
	const lastNewline = before.lastIndexOf("\n");
	const column = lastNewline === -1 ? offset + 1 : offset - lastNewline;
	return { line: newlineCount + 1, column, offset };
}

function span(
	raw: string,
	startOffset: number,
	endOffset: number,
): { start: Position; end: Position } {
	return {
		start: offsetToPosition(raw, startOffset),
		end: offsetToPosition(raw, Math.min(endOffset, raw.length)),
	};
}

function point(
	raw: string,
	offset: number,
): { start: Position; end: Position } {
	const p = offsetToPosition(raw, offset);
	return { start: p, end: p };
}

type ParsedCommit = {
	raw?: string;
	header?: string | null;
	type?: string | null;
	subject?: string | null;
	scope?: string | null;
	body?: string | null;
	footer?: string | null;
};

function ruleField(
	ruleName: string,
): "type" | "scope" | "subject" | "header" | "body" | "footer" | undefined {
	if (ruleName.startsWith("type-")) return "type";
	if (ruleName.startsWith("scope-")) return "scope";
	if (ruleName.startsWith("subject-")) return "subject";
	if (ruleName.startsWith("header-")) return "header";
	if (ruleName.startsWith("body-")) return "body";
	if (ruleName.startsWith("footer-")) return "footer";
	return undefined;
}

function fieldSpan(
	field: NonNullable<ReturnType<typeof ruleField>>,
	ruleName: string,
	parsed: ParsedCommit,
	raw: string,
	header: string,
): { start: Position; end: Position } | undefined {
	switch (field) {
		case "type": {
			if (!parsed.type) {
				return ruleName === "type-empty" ? point(raw, 0) : undefined;
			}
			const offset = header.indexOf(parsed.type);
			if (offset === -1) return undefined;
			return span(raw, offset, offset + parsed.type.length);
		}
		case "scope": {
			if (!parsed.scope) {
				if (ruleName === "scope-empty") {
					const typeEnd = parsed.type ? parsed.type.length : 0;
					return point(raw, typeEnd + 1);
				}
				return undefined;
			}
			const parenStart = header.indexOf(`(${parsed.scope})`);
			const offset =
				parenStart >= 0 ? parenStart + 1 : header.lastIndexOf(parsed.scope);
			if (offset === -1) return undefined;
			return span(raw, offset, offset + parsed.scope.length);
		}
		case "subject": {
			if (!parsed.subject) {
				return ruleName === "subject-empty"
					? point(raw, header.length)
					: undefined;
			}
			const offset = header.lastIndexOf(parsed.subject);
			if (offset === -1) return undefined;
			return span(raw, offset, offset + parsed.subject.length);
		}
		case "header": {
			if (!header) return undefined;
			return span(raw, 0, header.length);
		}
		case "body": {
			const blank = raw.indexOf("\n\n");
			if (!parsed.body) {
				if (ruleName === "body-empty") {
					return point(raw, blank === -1 ? header.length : blank + 2);
				}
				return undefined;
			}
			if (blank === -1) return undefined;
			const start = blank + 2;
			return span(raw, start, start + parsed.body.length);
		}
		case "footer": {
			const blank = raw.lastIndexOf("\n\n");
			if (!parsed.footer) {
				if (ruleName === "footer-empty" && blank !== -1) {
					return point(raw, blank + 2);
				}
				return undefined;
			}
			if (blank === -1) return undefined;
			const start = blank + 2;
			return span(raw, start, start + parsed.footer.length);
		}
	}
}

function getRulePosition(
	ruleName: string,
	parsed: ParsedCommit,
): { start: Position; end: Position } | undefined {
	const raw = (parsed.raw || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	if (!raw) return undefined;

	const header = parsed.header || "";

	// Boundary special cases — exact-character precision matters.
	if (ruleName === "subject-exclamation-mark") {
		const colonIndex = header.indexOf(":");
		if (colonIndex === -1) return undefined;
		const bangIndex =
			colonIndex > 0 && header[colonIndex - 1] === "!"
				? colonIndex - 1
				: colonIndex;
		return point(raw, bangIndex);
	}
	if (ruleName === "body-leading-blank") {
		return parsed.body ? point(raw, header.length) : undefined;
	}
	if (ruleName === "footer-leading-blank") {
		if (!parsed.footer) return undefined;
		const footerStart = raw.indexOf(parsed.footer);
		if (footerStart <= 0) return undefined;
		return point(raw, footerStart - 1);
	}

	const field = ruleField(ruleName);
	if (!field) return undefined;
	return fieldSpan(field, ruleName, parsed, raw, header);
}

export default async function lint(
	message: string,
	rawRulesConfig?: QualifiedRules,
	rawOpts?: LintOptions,
): Promise<LintOutcome> {
	const opts = rawOpts
		? rawOpts
		: { defaultIgnores: undefined, ignores: undefined };
	const rulesConfig = rawRulesConfig || {};

	// Found a wildcard match, skip
	if (
		isIgnored(message, { defaults: opts.defaultIgnores, ignores: opts.ignores })
	) {
		return {
			valid: true,
			errors: [],
			warnings: [],
			input: message,
		};
	}

	// Parse the commit message
	const parsed =
		message === ""
			? { header: null, body: null, footer: null }
			: await parse(message, undefined, opts.parserOpts);

	if (
		parsed.header === null &&
		parsed.body === null &&
		parsed.footer === null
	) {
		// Commit is empty, skip
		return {
			valid: true,
			errors: [],
			warnings: [],
			input: message,
		};
	}

	const allRules: Map<string, BaseRule<never, RuleType>> = new Map(
		Object.entries(defaultRules),
	);

	if (opts.plugins) {
		Object.values(opts.plugins).forEach((plugin) => {
			if (plugin.rules) {
				Object.keys(plugin.rules).forEach((ruleKey) =>
					allRules.set(ruleKey, plugin.rules[ruleKey]),
				);
			}
		});
	}

	// Find invalid rules configs
	const missing = Object.keys(rulesConfig).filter(
		(name) => typeof allRules.get(name) !== "function",
	);

	if (missing.length > 0) {
		const names = [...allRules.keys()];
		throw new RangeError(
			[
				`Found rules without implementation: ${missing.join(", ")}.`,
				`Supported rules are: ${names.join(", ")}.`,
			].join("\n"),
		);
	}

	const invalid = Object.entries(rulesConfig)
		.map(([name, config]) => {
			if (!Array.isArray(config)) {
				return new Error(
					`config for rule ${name} must be array, received ${util.inspect(
						config,
					)} of type ${typeof config}`,
				);
			}

			const [level] = config;

			if (level === RuleConfigSeverity.Disabled && config.length === 1) {
				return null;
			}

			const [, when] = config;

			if (typeof level !== "number" || isNaN(level)) {
				return new Error(
					`level for rule ${name} must be number, received ${util.inspect(
						level,
					)} of type ${typeof level}`,
				);
			}

			if (config.length < 2 || config.length > 3) {
				return new Error(
					`config for rule ${name} must be 2 or 3 items long, received ${util.inspect(
						config,
					)} of length ${config.length}`,
				);
			}

			if (level < 0 || level > 2) {
				return new RangeError(
					`level for rule ${name} must be between 0 and 2, received ${util.inspect(
						level,
					)}`,
				);
			}

			if (typeof when !== "string") {
				return new Error(
					`condition for rule ${name} must be string, received ${util.inspect(
						when,
					)} of type ${typeof when}`,
				);
			}

			if (when !== "never" && when !== "always") {
				return new Error(
					`condition for rule ${name} must be "always" or "never", received ${util.inspect(
						when,
					)}`,
				);
			}

			return null;
		})
		.filter((item): item is Error => item instanceof Error);

	if (invalid.length > 0) {
		throw new Error(invalid.map((i) => i.message).join("\n"));
	}

	// Validate against all rules
	const pendingResults = Object.entries(rulesConfig)
		// Level 0 rules are ignored
		.filter(([, config]) => !!config && config.length && config[0] > 0)
		.map(async (entry) => {
			const [name, config] = entry;
			const [level, when, value] = config!; //

			const rule = allRules.get(name);

			if (!rule) {
				throw new Error(`Could not find rule implementation for ${name}`);
			}

			const executableRule = rule as Rule<unknown>;
			const [valid, message] = await executableRule(parsed, when, value);

			const position = !valid ? getRulePosition(name, parsed) : undefined;

			const outcome: LintRuleOutcome = {
				level,
				valid,
				name,
				message: message ?? "",
				start: position?.start,
				end: position?.end,
			};

			return outcome;
		});

	const results = (await Promise.all(pendingResults)).filter(
		(result): result is LintRuleOutcome => result !== null,
	);

	const errors = results.filter(
		(result) => result.level === RuleConfigSeverity.Error && !result.valid,
	);
	const warnings = results.filter(
		(result) => result.level === RuleConfigSeverity.Warning && !result.valid,
	);

	const valid = errors.length === 0;

	return {
		valid,
		errors,
		warnings,
		input: buildCommitMessage(parsed),
	};
}
