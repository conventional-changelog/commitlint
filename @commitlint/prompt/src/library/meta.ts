import chalk from "chalk";

/**
 * Get formatted meta hints for configuration
 * @param settings dictionary to parse
 * @return formatted meta information
 */
export default function meta(settings: Record<string, unknown>): string {
	return chalk.grey(
		Object.entries(settings || {})
			.filter((item) => item[1])
			.map((item) => {
				const [name, value] = item;
				return typeof value === "boolean" ? `[${name}]` : `[${name}=${value}]`;
			})
			.join(" "),
	);
}
