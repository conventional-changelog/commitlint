#!/usr/bin/env node

const args = process.argv;
args.shift(); // remove node
console.log(
	args.map((item, index) => {
		return index === 0 ? 'git' : item;
	})
);
