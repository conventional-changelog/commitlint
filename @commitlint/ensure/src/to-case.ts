import { TargetCaseType } from "@commitlint/types";
import { camelCase, kebabCase, snakeCase, pascalCase, splitByCase, upperFirst } from "scule";

export default function toCase(input: string, target: TargetCaseType): string {
	const words = splitByCase(
		input.replace(/[’']/g, "").replace(/[^\p{L}\p{N}\p{M}]+/gu, "-"),
	).filter(Boolean);

	switch (target) {
		case "camel-case":
			return camelCase(words, { normalize: true });
		case "kebab-case":
			return kebabCase(words);
		case "snake-case":
			return snakeCase(words);
		case "pascal-case":
			return pascalCase(words, { normalize: true });
		case "start-case":
			return words.map((word) => upperFirst(word)).join(" ");
		case "upper-case":
		case "uppercase":
			return input.toUpperCase();
		case "sentence-case":
		case "sentencecase":
			return upperFirst(input);
		case "lower-case":
		case "lowercase":
		case "lowerCase": // Backwards compat config-angular v4
			return input.toLowerCase();
		default:
			throw new TypeError(`to-case: Unknown target case "${target}"`);
	}
}
