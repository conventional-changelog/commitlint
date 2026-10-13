import { TargetCaseType } from "@commitlint/types";
import { camelCase, kebabCase, snakeCase, pascalCase, splitByCase, upperFirst } from "scule";

export default function toCase(input: string, target: TargetCaseType): string {
	// scule does not split whitespace, but commit messages contain multiple words.
	const separated = input.replace(/\s+/g, "-");

	switch (target) {
		case "camel-case":
			return camelCase(separated, { normalize: true });
		case "kebab-case":
			return kebabCase(separated);
		case "snake-case":
			return snakeCase(separated);
		case "pascal-case":
			return pascalCase(separated, { normalize: true });
		case "start-case":
			return splitByCase(separated)
				.filter(Boolean)
				.map((word) => upperFirst(word))
				.join(" ");
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
