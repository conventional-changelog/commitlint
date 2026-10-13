import { createDefu } from "defu";
import isPlainObject from "is-plain-obj";
import type { UserConfig } from "@commitlint/types";

const explicitNull = Symbol("explicit config null");

// defu skips null before calling its custom merger. Encode it as an opaque value
// during merging so null overrides defaults while undefined still inherits them.
function mapNulls(value: unknown, encode: boolean): unknown {
	if (encode ? value === null : value === explicitNull) {
		return encode ? explicitNull : null;
	}
	if (!isPlainObject(value)) {
		return value;
	}
	return Object.fromEntries(
		Object.entries(value).map(([key, child]) => [key, mapNulls(child, encode)]),
	);
}

const merge = createDefu((object, key, value) => {
	if (Array.isArray(value)) {
		object[key] = value;
		return true;
	}
});

/** Merge configs with leftmost precedence, replacing arrays and preserving null. */
export function mergeConfig(config: UserConfig, ...defaults: UserConfig[]): UserConfig {
	const encode = (value: UserConfig) => mapNulls(value, true) as UserConfig;
	return mapNulls(merge(encode(config), ...defaults.map(encode)), false) as UserConfig;
}
