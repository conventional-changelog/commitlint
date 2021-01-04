import {RuleConfigCondition, RuleConfigSeverity} from '@commitlint/types';

export type RuleEntry =
	| [string, Readonly<[RuleConfigSeverity.Disabled]>]
	| [string, Readonly<[RuleConfigSeverity, RuleConfigCondition]>]
	| [string, Readonly<[RuleConfigSeverity, RuleConfigCondition, unknown]>];

export type InputSetting = {
	description?: string;
	enumerables?: Record<
		string,
		{
			description: string;
		}
	>;
	multiline?: boolean;
	header?: {
		length?: number;
	};
};

export type Result = Partial<
	Record<'type' | 'scope' | 'subject' | 'body' | 'footer', null | string>
>;

export interface PrompterCommand {
	description(value: string): this;
	action(
		action: (args: {
			[key: string]: any;
			options: {
				[key: string]: any;
			};
		}) => Promise<void> | void
	): this;
}

export interface Prompter {
	delimiter(value: string): this;
	show(): this;
	exec(command: string): Promise<any>;
	log(text?: string): void;
	catch(command: string, description?: string): PrompterCommand;
	command(command: string, description?: string): PrompterCommand;
	removeAllListeners(input?: string): void;
	addListener(input: string, cb: (event: any) => void): void;
	ui: {
		log(text?: string): void;
		input(text?: string): string;
		redraw: {
			(text: string, ...texts: string[]): void;
			done(): void;
		};
	};
}
