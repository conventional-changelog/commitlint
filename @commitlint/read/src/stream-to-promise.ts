import {Readable} from 'node:stream';

export function streamToPromise(stream: Readable): Promise<string[]> {
	const data: string[] = [];
	return new Promise((resolve, reject) =>
		stream
			.on('data', (chunk) => data.push(chunk.toString('utf-8')))
			.on('error', reject)
			.on('end', () => resolve(data))
	);
}
