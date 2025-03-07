import { test, expect } from "vitest";
import { loadParserOpts } from "./load-parser-opts.js";

test("handles a plain preset", async () => {
	const preset = {
		parserOpts: {},
	};

	expect(await loadParserOpts(preset)).toEqual(preset);
});

test("handles primitive values", async () => {
	expect(await loadParserOpts("")).toEqual(undefined);
	expect(await loadParserOpts(undefined)).toEqual(undefined);
});

test("handles an object without any parserOpts", async () => {
	const preset = {};
	expect(await loadParserOpts(preset)).toEqual(preset);
});

test("handles nested parserOpts", async () => {
	const opts = { a: 4 };

	// plain nested parserOpts
	let loaded = await loadParserOpts({
		parserOpts: {
			parserOpts: opts,
		},
	});
	expect(loaded).toHaveProperty("parserOpts", opts);

	// async nested parserOpts
	loaded = await loadParserOpts({
		parserOpts: Promise.resolve({
			parserOpts: opts,
		}),
	});
	expect(loaded).toHaveProperty("parserOpts", opts);
});

test("runs a sync function which returns the preset", async () => {
	const preset = {};
	const fn = () => preset;
	const opts = await loadParserOpts(fn);

	expect(opts).toEqual(preset);
});

test("runs an async function which returns the preset", async () => {
	const preset = {};
	const fn = async () => preset;
	const opts = await loadParserOpts(fn);

	expect(opts).toEqual(preset);
});
