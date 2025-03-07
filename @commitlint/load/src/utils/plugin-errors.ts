export class WhitespacePluginError extends Error {
	__proto__ = Error;

	public messageTemplate: string = 'whitespace-found';
	public messageData: any = {};

	constructor(pluginName?: string, data: any = {}) {
		super(`Whitespace found in plugin name '${pluginName}'`);

		this.messageData = data;

		Object.setPrototypeOf(this, WhitespacePluginError.prototype);
	}
}

export class MissingPluginError extends Error {
	__proto__ = Error;

	public messageTemplate: string = 'plugin-missing';
	public messageData: any;

	constructor(pluginName?: string, errorMessage: string = '', data: any = {}) {
		super(`Failed to load plugin ${pluginName}: ${errorMessage}`);

		this.messageData = data;

		Object.setPrototypeOf(this, MissingPluginError.prototype);
	}
}
