export default (value: string | null, max: number): boolean =>
	typeof value === "string" && value.length <= max;
