import path from 'path';
import up from 'find-up';

export default toplevel;

// Find the next git root
// (start: string) => Promise<string | null>
async function toplevel(cwd) {
	const found = await up('.git', {cwd});

	if (typeof found !== 'string') {
		return found;
	}

	return path.join(found, '..');
}
