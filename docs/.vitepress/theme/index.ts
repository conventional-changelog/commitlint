// .vitepress/theme/index.ts
import type {Theme} from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import {enhanceAppWithTabs} from 'vitepress-plugin-tabs/client';

export default {
	extends: DefaultTheme,
	enhanceApp({app}) {
		enhanceAppWithTabs(app);
	},
} satisfies Theme;
