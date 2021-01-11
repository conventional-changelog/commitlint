import path from 'path';

// In eslint this is a parameter - we don't need to support the extra options
const prefix = 'commitlint-plugin';

/**
 * Replace Windows with posix style paths
 */
function convertPathToPosix(filepath: string): string {
	const normalizedFilepath = path.normalize(filepath);
	return normalizedFilepath.replace(/\\/gu, '/');
}

/**
 * Brings package name to correct format based on prefix
 * @param name The name of the package.
 * @returns Normalized name of the package
 * @internal
 */
export function normalizePackageName(
	name: string
): {longName: string; shortName: string} {
	let normalizedName = name;

	if (
		path.isAbsolute(name) ||
		name.startsWith('./') ||
		name.startsWith('../') ||
		name.startsWith('.\\') ||
		name.startsWith('..\\')
	) {
		return {
			longName: name,
			shortName: path.basename(name) || name,
		};
	}

	/**
	 * On Windows, name can come in with Windows slashes instead of Unix slashes.
	 * Normalize to Unix first to avoid errors later on.
	 * https://github.com/eslint/eslint/issues/5644
	 */
	if (normalizedName.indexOf('\\') > -1) {
		normalizedName = convertPathToPosix(normalizedName);
	}

	if (normalizedName.charAt(0) === '@') {
		/**
		 * it's a scoped package
		 * package name is the prefix, or just a username
		 */
		const scopedPackageShortcutRegex = new RegExp(
				`^(@[^/]+)(?:/(?:${prefix})?)?$`,
				'u'
			),
			scopedPackageNameRegex = new RegExp(`^${prefix}(-|$)`, 'u');

		if (scopedPackageShortcutRegex.test(normalizedName)) {
			normalizedName = normalizedName.replace(
				scopedPackageShortcutRegex,
				`$1/${prefix}`
			);
		} else if (!scopedPackageNameRegex.test(normalizedName.split('/')[1])) {
			/**
			 * for scoped packages, insert the prefix after the first / unless
			 * the path is already @scope/eslint or @scope/eslint-xxx-yyy
			 */
			normalizedName = normalizedName.replace(
				/^@([^/]+)\/(.*)$/u,
				`@$1/${prefix}-$2`
			);
		}
	} else if (normalizedName.indexOf(`${prefix}-`) !== 0) {
		normalizedName = `${prefix}-${normalizedName}`;
	}

	return {
		longName: normalizedName,
		shortName: getShorthandName(normalizedName),
	};
}

/**
 * Removes the prefix from a fullName.
 * @param fullName The term which may have the prefix.
 * @returns The term without prefix.
 * @internal
 */
export function getShorthandName(fullName: string): string {
	if (fullName[0] === '@') {
		let matchResult = new RegExp(`^(@[^/]+)/${prefix}$`, 'u').exec(fullName);

		if (matchResult) {
			return matchResult[1];
		}

		matchResult = new RegExp(`^(@[^/]+)/${prefix}-(.+)$`, 'u').exec(fullName);
		if (matchResult) {
			return `${matchResult[1]}/${matchResult[2]}`;
		}
	} else if (fullName.startsWith(`${prefix}-`)) {
		return fullName.slice(prefix.length + 1);
	}

	return fullName;
}
