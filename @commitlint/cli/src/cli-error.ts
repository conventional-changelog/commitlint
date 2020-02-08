export class CliError extends Error {
	__proto__ = Error;

	public type: string;

	constructor(message: string, type: string) {
		super(message);

		this.type = type;

		Object.setPrototypeOf(this, CliError.prototype);
	}
}
