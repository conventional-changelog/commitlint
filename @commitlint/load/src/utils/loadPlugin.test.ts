import test from 'ava';
const proxyquire = require('proxyquire')
	.noCallThru()
	.noPreserveCache();

test.beforeEach(t => {
	const plugins = {};
	const plugin = {};
	const scopedPlugin = {};
	const stubbedLoadPlugin = proxyquire('./loadPlugin', {
		'commitlint-plugin-example': plugin,
		'@scope/commitlint-plugin-example': scopedPlugin
	}).default;
	t.context.data = {
		plugins,
		plugin,
		scopedPlugin,
		stubbedLoadPlugin
	};
});

test('should load a plugin when referenced by short name', t => {
	const {stubbedLoadPlugin, plugins, plugin} = t.context.data;
	stubbedLoadPlugin(plugins, 'example');
	t.is(plugins['example'], plugin);
});

test('should load a plugin when referenced by long name', t => {
	const {stubbedLoadPlugin, plugins, plugin} = t.context.data;
	stubbedLoadPlugin(plugins, 'commitlint-plugin-example');
	t.is(plugins['example'], plugin);
});

test('should throw an error when a plugin has whitespace', t => {
	const {stubbedLoadPlugin, plugins} = t.context.data;
	t.throws(() => {
		stubbedLoadPlugin(plugins, 'whitespace ');
	}, /Whitespace found in plugin name 'whitespace '/u);
	t.throws(() => {
		stubbedLoadPlugin(plugins, 'whitespace\t');
	}, /Whitespace found in plugin name/u);
	t.throws(() => {
		stubbedLoadPlugin(plugins, 'whitespace\n');
	}, /Whitespace found in plugin name/u);
	t.throws(() => {
		stubbedLoadPlugin(plugins, 'whitespace\r');
	}, /Whitespace found in plugin name/u);
});

test("should throw an error when a plugin doesn't exist", t => {
	const {stubbedLoadPlugin, plugins} = t.context.data;
	t.throws(() => {
		stubbedLoadPlugin(plugins, 'nonexistentplugin');
	}, /Failed to load plugin/u);
});

test('should load a scoped plugin when referenced by short name', t => {
	const {stubbedLoadPlugin, plugins, scopedPlugin} = t.context.data;
	stubbedLoadPlugin(plugins, '@scope/example');
	t.is(plugins['@scope/example'], scopedPlugin);
});

test('should load a scoped plugin when referenced by long name', t => {
	const {stubbedLoadPlugin, plugins, scopedPlugin} = t.context.data;
	stubbedLoadPlugin(plugins, '@scope/commitlint-plugin-example');
	t.is(plugins['@scope/example'], scopedPlugin);
});

/* when referencing a scope plugin and omitting @scope/ */
test("should load a scoped plugin when referenced by short name, but should not get the plugin if '@scope/' is omitted", t => {
	const {stubbedLoadPlugin, plugins} = t.context.data;
	stubbedLoadPlugin(plugins, '@scope/example');
	t.is(plugins['example'], undefined);
});

test("should load a scoped plugin when referenced by long name, but should not get the plugin if '@scope/' is omitted", t => {
	const {stubbedLoadPlugin, plugins} = t.context.data;
	stubbedLoadPlugin(plugins, '@scope/commitlint-plugin-example');
	t.is(plugins['example'], undefined);
});
