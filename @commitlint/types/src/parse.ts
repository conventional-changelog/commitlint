import type {Commit, ParserOptions} from 'conventional-commits-parser';

export type Parser = (
	message: string,
	options: ParserOptions
) => Omit<Commit, 'raw'>;
