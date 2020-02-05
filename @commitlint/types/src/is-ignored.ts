export type Matcher = (commit: string) => boolean;

export interface IsIgnoredOptions {
	ignores?: Matcher[];
	defaults?: boolean;
}
