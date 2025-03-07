type Rule<T> = readonly [string, Config<T>];
type Config<T> = T | Promise<T> | ExectableConfig<T>;
type ExectableConfig<T> = (() => T) | (() => Promise<T>);

type ExecutedRule<T> = readonly [string, T];

export default execute;

export async function execute<T = unknown>(
	rule?: Rule<T>,
): Promise<ExecutedRule<T> | null> {
	if (!Array.isArray(rule)) {
		return null;
	}

	const [name, config] = rule;

	const fn = executable(config) ? config : async () => config;

	return [name, await fn()];
}

function executable<T>(config: Config<T>): config is ExectableConfig<T> {
	return typeof config === "function";
}
