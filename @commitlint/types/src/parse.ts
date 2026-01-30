import type {
	Commit,
	ParserOptions as Options,
} from "conventional-commits-parser";

export type Parser = (message: string, options: Options) => Omit<Commit, "raw">;
