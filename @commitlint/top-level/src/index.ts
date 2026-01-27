import process from "node:process";
import escalade from "escalade";

export default toplevel;

/**
 * Find the next git root
 */
function toplevel(cwd = process.cwd()) {
	return escalade(cwd, (directory, files) => {
		if (files.includes(".git")) {
			return directory;
		}
	});
}
