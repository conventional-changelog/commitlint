import { test, expect, afterEach } from "vitest";

import { isDynamicAwaitSupported } from "./load-config.js";

const actualVersion = Object.getOwnPropertyDescriptor(process, "version")!;

const withNodeVersion = (version: string) => {
	Object.defineProperty(process, "version", { ...actualVersion, value: version });
	return isDynamicAwaitSupported();
};

afterEach(() => {
	Object.defineProperty(process, "version", actualVersion);
});

// Dynamic await landed in Node v20.8.0, so every release from there on supports it.
test.each([
	["v18.20.8", false],
	["v20.0.0", false],
	["v20.7.1", false],
	["v20.8.0", true],
	["v20.19.5", true],
	["v22.12.0", true],
	["v24.0.0", true],
	["v24.3.0", true],
	["v24.7.0", true],
	["v24.8.0", true],
	["v25.0.0", true],
	["v26.0.0", true],
	["v26.7.0", true],
	["v30.1.0", true],
])("reports dynamic await support on %s as %s", (version, supported) => {
	expect(withNodeVersion(version)).toBe(supported);
});
