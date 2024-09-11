export enum ExitCode {
	Normal = 0,
	UncaughtFatalException = 1,
	ReservedByBash = 2,
	InternalJavaScriptParseError = 3,
	InternalJavaScriptEvaluationFailure = 4,
	FatalError = 5,
	NonFunctionInternalExceptionHandler = 6,
	InvalidArgument = 9,
}

export class CliError extends Error {
	__proto__ = Error;

	public type: string;
	public error_code: ExitCode;

	constructor(
		message: string,
		type: string,
		error_code = ExitCode.UncaughtFatalException
	) {
		super(message);

		this.type = type;
		this.error_code = error_code;

		Object.setPrototypeOf(this, CliError.prototype);
	}
}
