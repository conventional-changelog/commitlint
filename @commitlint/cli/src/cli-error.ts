export class CliError extends Error {
	__proto__ = Error;

	public type: string;
	public error_code: number;

	constructor(message: string, type: string, error_code = 1) {
		super(message);

		this.type = type;
		this.error_code = error_code;

		Object.setPrototypeOf(this, CliError.prototype);
	}
}
