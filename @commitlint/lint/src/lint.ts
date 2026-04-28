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

function getRulePosition(
	ruleName: string,
	parsed: {
		raw?: string;
		header?: string | null;
		type?: string | null;
		subject?: string | null;
		scope?: string | null;
		body?: string | null;
		footer?: string | null;
	},
): { start: Position; end: Position } | undefined {
	const raw = parsed.raw || "";
	if (!raw) return undefined;

	const header = parsed.header || "";

	switch (ruleName) {
		case "type-enum":
		case "type-empty":
		case "type-case":
		case "type-min-length":
		case "type-max-length": {
			if (!parsed.type) {
				if (ruleName === "type-empty") {
					const offset = 0;
					return {
						start: { line: 1, column: offset + 1, offset },
						end: { line: 1, column: offset + 1, offset },
					};
				}
				return undefined;
			}
			if (!raw.startsWith(parsed.type)) return undefined;
			const offset = 0;
			return {
				start: { line: 1, column: offset + 1, offset },
				end: {
					line: 1,
					column: offset + parsed.type.length + 1,
					offset: offset + parsed.type.length,
				},
			};
		}
		case "scope-enum":
		case "scope-empty":
		case "scope-case":
		case "scope-min-length":
		case "scope-max-length":
		case "scope-delimiter-style": {
			if (!parsed.scope) {
				if (ruleName === "scope-empty") {
					const typeEnd = parsed.type ? parsed.type.length : 0;
					const offset = typeEnd + 1;
					return {
						start: { line: 1, column: offset + 1, offset },
						end: { line: 1, column: offset + 2, offset: offset + 1 },
					};
				}
				return undefined;
			}
			const scopeStart = raw.indexOf(`(${parsed.scope})`);
			if (scopeStart === -1) return undefined;
			return {
				start: { line: 1, column: scopeStart + 2, offset: scopeStart + 1 },
				end: {
					line: 1,
					column: scopeStart + parsed.scope.length + 2,
					offset: scopeStart + parsed.scope.length + 1,
				},
			};
		}
		case "subject-empty":
		case "subject-case":
		case "subject-min-length":
		case "subject-max-length":
		case "subject-full-stop":
		case "subject-exclamation-mark": {
			if (!parsed.subject) {
				if (ruleName === "subject-empty") {
					const typeEnd = parsed.type ? parsed.type.length : 0;
					const hasScope = parsed.scope ? parsed.scope.length + 3 : 0;
					const separator = ": ".length;
					const offset = typeEnd + hasScope + separator;
					return {
						start: { line: 1, column: offset + 1, offset },
						end: { line: 1, column: offset + 1, offset },
					};
				}
				return undefined;
			}
			const typeEnd = parsed.type ? parsed.type.length : 0;
			const hasScope = parsed.scope ? parsed.scope.length + 3 : 0;
			const separator = ": ".length;
			const subjectStart = typeEnd + hasScope + separator;
			return {
				start: { line: 1, column: subjectStart + 1, offset: subjectStart },
				end: {
					line: 1,
					column: subjectStart + parsed.subject.length + 1,
					offset: subjectStart + parsed.subject.length,
				},
			};
		}
		case "header-min-length":
		case "header-max-length":
		case "header-case":
		case "header-full-stop":
		case "header-trim": {
			if (!header) return undefined;
			return {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: header.length + 1, offset: header.length },
			};
		}
		case "body-empty":
		case "body-min-length":
		case "body-max-length":
		case "body-case":
		case "body-full-stop":
		case "body-leading-blank":
		case "body-max-line-length": {
			if (!parsed.body) {
				if (ruleName === "body-empty") {
					const bodyOffset = raw.indexOf("\n\n");
					if (bodyOffset === -1) return undefined;
					return {
						start: { line: 2, column: 1, offset: bodyOffset + 2 },
						end: { line: 2, column: 1, offset: bodyOffset + 2 },
					};
				}
				return undefined;
			}
			const bodyOffset = raw.indexOf("\n\n");
			if (bodyOffset === -1) return undefined;
			const bodyStartOffset = bodyOffset + 2;
			return {
				start: { line: 2, column: 1, offset: bodyStartOffset },
				end: {
					line: 2,
					column: parsed.body.length + 1,
					offset: bodyStartOffset + parsed.body.length,
				},
			};
		}
		case "footer-empty":
		case "footer-min-length":
		case "footer-max-length":
		case "footer-leading-blank":
		case "footer-max-line-length": {
			if (!parsed.footer) {
				if (ruleName === "footer-empty") {
					const footerOffset = raw.lastIndexOf("\n\n");
					if (footerOffset === -1) return undefined;
					return {
						start: { line: 3, column: 1, offset: footerOffset + 2 },
						end: { line: 3, column: 1, offset: footerOffset + 2 },
					};
				}
				return undefined;
			}
			const footerOffset = raw.lastIndexOf("\n\n");
			if (footerOffset === -1) return undefined;
			const footerStartOffset = footerOffset + 2;
			return {
				start: { line: 3, column: 1, offset: footerStartOffset },
				end: {
					line: 3,
					column: parsed.footer.length + 1,
					offset: footerStartOffset + parsed.footer.length,
				},
			};
		}
		default:
			return undefined;
	}
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
