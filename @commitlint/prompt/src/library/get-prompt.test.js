import test from 'ava';
import getPrompt from './get-prompt';

test('throws without params', t => {
	t.throws(() => getPrompt(), /Missing prompter function/);
});

test('throws with incompatible prompter', t => {
	t.throws(
		() =>
			getPrompt('type', {
				prompter() {
					return {};
				}
			}),
		/prompt.removeAllListeners/
	);
});

test('returns input unaltered wihtout rules', async t => {
	const message = await getPrompt('type', {
		prompter: stub('foobar')
	});

	t.is(message, 'foobar');
});

function stub(input = '') {
	return stubPrompter;

	function stubPrompter() {
		const called = [];
		const actions = [];

		const instance = {
			action(...args) {
				actions.push(args[0]);
				called.push([instance.action, args]);
			},
			addListener(...args) {
				called.push([instance.addListener, args]);
			},
			catch(...args) {
				called.push([instance.catch, args]);
				return instance;
			},
			command(...args) {
				called.push([instance.command, args]);
				return instance;
			},
			description(...args) {
				called.push([instance.description, args]);
				return instance;
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
				redraw: {
					done(...args) {
						called.push([instance.ui.redraw.done, args]);
					}
				}
			},
			called
		};

		setTimeout(() => {
			actions[0]({
				text: Array.isArray(input) ? input : [input]
			});
		});

		return instance;
	}
}
