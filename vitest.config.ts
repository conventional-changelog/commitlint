import autoImport from 'unplugin-auto-import/vite';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	plugins: [
		autoImport({
			imports: ['vitest'],
		}),
	],
	test: {
		exclude: ['**/node_modules/**', '**/lib/*.test.js'],
		environment: 'commitlint',
		coverage: {
			provider: 'istanbul',
		},
	},
});
