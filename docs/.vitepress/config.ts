import {defineConfig} from 'vitepress';
import {tabsMarkdownPlugin} from 'vitepress-plugin-tabs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'commitlint',
	description: 'Lint commit messages',

	head: [['link', {rel: 'icon', type: 'image/png', href: '/assets/icon.png'}]],

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: '/assets/icon.png',

		nav: [
			{text: 'Home', link: '/'},
			{text: 'Guides', link: '/guides/getting-started'},
			{text: 'Reference', link: '/reference/configuration'},
		],

		sidebar: [
			{
				text: 'Guides',
				base: '/guides',
				items: [
					{text: 'Getting started', link: '/getting-started'},
					{text: 'Local setup', link: '/local-setup'},
					{text: 'CI setup', link: '/ci-setup'},
					{text: 'Use prompt', link: '/use-prompt'},
				],
			},
			{
				text: 'Reference',
				base: '/reference',
				items: [
					{text: 'CLI', link: '/cli'},
					{text: 'Configuration', link: '/configuration'},
					{text: 'Rules configuration', link: '/rules-configuration'},
					{text: 'Rules', link: '/rules'},
					{text: 'Plugins', link: '/plugins'},
					{text: 'Prompt', link: '/prompt'},
					{text: 'Examples', link: '/examples'},
					{text: 'Community projects', link: '/community-projects'},
				],
			},
			{
				text: 'API',
				base: '/api',
				collapsed: true,
				items: [
					{text: '@commitlint/load', link: '/load'},
					{text: '@commitlint/read', link: '/read'},
					{text: '@commitlint/lint', link: '/lint'},
					{text: '@commitlint/format', link: '/format'},
				],
			},
			{
				text: 'Concepts',
				base: '/concepts',
				collapsed: true,
				items: [
					{text: 'Commit-conventions', link: '/commit-conventions'},
					{text: 'Shareable config', link: '/shareable-config'},
				],
			},
			{
				text: 'Support',
				base: '/support',
				collapsed: true,
				items: [
					{text: 'Releases', link: '/releases'},
					{text: 'Upgrade commitlint', link: '/upgrade'},
				],
			},
			{
				text: 'Attributions',
				link: '/attributions',
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/conventional-changelog/commitlint',
			},
		],

		search: {
			provider: 'local',
		},
	},

	markdown: {
		config(md) {
			md.use(tabsMarkdownPlugin);
		},
	},
});
