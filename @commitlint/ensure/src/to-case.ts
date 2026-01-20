import { TargetCaseType } from "@commitlint/types";
import {
	toCamelCase,
	toKebabCase,
	toSnakeCase,
	toPascalCase,
	toTitleCase,
} from "kasi";

export default function toCase(input: string, target: TargetCaseType): string {
	switch (target) {
		case "camel-case":
			return toCamelCase(input);
		case "kebab-case":
			return toKebabCase(input);
		case "snake-case":
			return toSnakeCase(input);
		case "pascal-case":
			return toPascalCase(input);
		case "start-case":
			return toTitleCase(input);
		case "upper-case":
		case "uppercase":
			return input.toUpperCase();
		case "sentence-case":
		case "sentencecase":
			return input.charAt(0).toUpperCase() + input.slice(1);
		case "lower-case":
		case "lowercase":
		case "lowerCase": // Backwards compat config-angular v4
			return input.toLowerCase();
		default:
			throw new TypeError(`to-case: Unknown target case "${target}"`);
	}
}
