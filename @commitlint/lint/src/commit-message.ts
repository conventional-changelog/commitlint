export interface CommitMessageData {
	header: string | null;
	body?: string | null;
	footer?: string | null;
}

export const buildCommitMessage = ({
	header,
	body,
	footer,
}: CommitMessageData): string => {
	let message = header;

	message = body ? `${message}\n\n${body}` : message;
	message = footer ? `${message}\n\n${footer}` : message;

	return message || '';
};
