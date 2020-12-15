import getPrompt from './get-prompt';
import {Prompter, PrompterCommand} from './types';

test('throws without params', () => {
	expect(() => (getPrompt as any)()).toThrow('Missing prompter function');
});

test('throws with incompatible prompter', () => {
	expect(() =>
		getPrompt('type', {
			prompter: (() => ({})) as any,
		})
	).toThrow('prompt.removeAllListeners');
});

test('returns input unaltered without rules', async () => {
	const message = await getPrompt('type', {
		prompter: stub('foobar'),
	});

	expect(message).toEqual('foobar');
});

function stub(input = '') {
	return function stubPrompter(): Prompter {
		const called: any[] = [];
		const actions: any[] = [];

		const instanceCommand: PrompterCommand = {
			description(...args) {
				called.push([instanceCommand.description, args]);
				return instanceCommand;
			},
			action(...args) {
				actions.push(args[0]);
				called.push([instanceCommand.action, args]);
				return instanceCommand;
			},
		};

		function redraw(...args: any[]): void {
			called.push([instance.log, args]);
		}
		redraw.done = function (...args: any[]) {
			called.push([instance.ui.redraw.done, args]);
		};

		const instance: Prompter & {called: any[]} = {
			called,
			addListener(...args): void {
				called.push([instance.addListener, args]);
			},
			catch(...args) {
				called.push([instance.catch, args]);
				return instanceCommand;
			},
			command(...args) {
				called.push([instance.command, args]);
				return instanceCommand;
			},
			exec(...args) {
				called.push([instance.command, args]);
				return Promise.resolve();
			},
			delimiter(...args) {
				called.push([instance.delimiter, args]);
				return instance;
			},
			log(...args) {
				called.push([instance.log, args]);
				return instance;
			},
			removeAllListeners(...args) {
				called.push([instance.removeAllListeners, args]);
			},
			show(...args) {
				called.push([instance.show, args]);
				return instance;
			},
			ui: {
				log(...args) {
					called.push([instance.log, args]);
				},
				input(...args) {
					called.push([instance.log, args]);
					return args[0]!;
				},
				redraw,
			},
		};

		setTimeout(() => {
			actions[0]({
				text: Array.isArray(input) ? input : [input],
			});
		}, 0);

		return instance;
	};
}
