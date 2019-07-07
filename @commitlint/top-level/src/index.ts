import path from 'path';
import up from 'find-up';

export default toplevel;

/**
 * Find the next git root
 */
async function toplevel(cwd: string) {
	const found = await up('.git', {cwd, type: 'directory'});

	if (typeof found !== 'string') {
		return found;
	}

	return path.join(found, '..');
}
