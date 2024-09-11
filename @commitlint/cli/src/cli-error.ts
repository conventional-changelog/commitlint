export enum ExitCode {
	CommitlintDefault = 0,
	CommitlintErrorDefault = 1,
	CommitLintWarning = 2,
	CommitLintError = 3,
	CommitlintInvalidArgument = 9,
}

export class CliError extends Error {
	__proto__ = Error;

	public type: string;
	public error_code: ExitCode;

	constructor(
		message: string,
		type: string,
		error_code = ExitCode.CommitlintErrorDefault
	) {
		super(message);

		this.type = type;
		this.error_code = error_code;

		Object.setPrototypeOf(this, CliError.prototype);
	}
}
