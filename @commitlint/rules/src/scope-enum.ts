import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const scopeEnum: SyncRule<
	| string[]
	| {
			scopes: string[];
			delimiters?: string[];
			scopesByType?: Record<string, string[]>;
	  }
> = ({ scope, type }, when = "always", value = []) => {
	// A list given for the commit type replaces the general one for that type.
	const typeScopes =
		Array.isArray(value) || !type || !value.scopesByType || !Object.hasOwn(value.scopesByType, type)
			? undefined
			: value.scopesByType[type];
	const scopes = typeScopes ?? (Array.isArray(value) ? value : value.scopes);

	if (!scope || !scopes.length) {
		return [true, ""];
	}

	const delimiters =
		Array.isArray(value) || !value.delimiters?.length ? ["/", "\\", ","] : value.delimiters;
	const delimiterPatterns = delimiters.map((delimiter) => {
		return delimiter === "," ? ", ?" : delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	});
	const messageScopes = scope.split(new RegExp(delimiterPatterns.join("|")));
	const errorMessage = [
		"scope must",
		`be one of [${scopes.join(", ")}]`,
		typeScopes ? `for type ${type}` : undefined,
	];
	const isScopeInEnum = (scope: string) => ensure.enum(scope, scopes);
	let isValid;

	if (when === "never") {
		isValid = !messageScopes.some(isScopeInEnum) && !isScopeInEnum(scope);
		errorMessage.splice(1, 0, "not");
	} else {
		isValid = messageScopes.every(isScopeInEnum) || isScopeInEnum(scope);
	}

	return [isValid, message(errorMessage)];
};
