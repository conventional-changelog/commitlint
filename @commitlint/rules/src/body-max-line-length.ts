import { maxLineLength } from "@commitlint/ensure";
import toLines from "@commitlint/to-lines";
import { SyncRule } from "@commitlint/types";

const TRAILER_TOKEN = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+:\s\S/;

function withoutTrailingFooter(body: string, footer?: string | null): string {
	const footerStart = footer ? body.length - footer.length : -1;
	const input =
		footer &&
		footerStart >= 0 &&
		body.endsWith(footer) &&
		(footerStart === 0 || body[footerStart - 1] === "\n")
			? body.slice(0, footerStart).replace(/(\r?\n)+$/, "")
			: body;

	const lines = toLines(input);
	let last = lines.length - 1;

	while (last >= 0 && lines[last] === "") {
		last--;
	}

	let first = last;

	while (first >= 0 && lines[first] !== "") {
		first--;
	}

	const footerLines = lines.slice(first + 1, last + 1);

	if (footerLines.length === 0 || !footerLines.every((line) => TRAILER_TOKEN.test(line))) {
		return input;
	}

	return lines.slice(0, first).join("\n");
}

export const bodyMaxLineLength: SyncRule<number> = (parsed, _when = undefined, value = 0) => {
	const body = parsed.body;

	if (!body) {
		return [true];
	}

	const input = withoutTrailingFooter(body, parsed.footer);

	return [maxLineLength(input, value), `body's lines must not be longer than ${value} characters`];
};
