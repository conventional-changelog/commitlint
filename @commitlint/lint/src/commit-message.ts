export interface CommitMessageData {
	header: string;
	body?: string | null;
	footer?: string | null;
}

export const buildCommitMesage = ({
	header,
	body,
	footer
}: CommitMessageData): string => {
	let message = header;

	message = body ? `${message}\n\n${body}` : message;
	message = footer ? `${message}\n\n${footer}` : message;

	return message;
};
