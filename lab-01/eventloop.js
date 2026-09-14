const { performance } = require('perf_hooks');

const iterations = Number(process.env.ITERATIONS) || 3_000_000_000;
const start = performance.now();

function blockingWork(totalIterations) {
	let total = 0;

	for (let index = 0; index < totalIterations; index += 1) {
		total += index;
	}

	return total;
}

console.log('1. Synchronous code starts');

setTimeout(() => {
	console.log(`5. setTimeout callback ran after ${(performance.now() - start).toFixed(2)} ms`);
}, 0);

setImmediate(() => {
	console.log(`6. setImmediate callback ran after ${(performance.now() - start).toFixed(2)} ms`);
});

process.nextTick(() => {
	console.log('3. process.nextTick callback');
});

Promise.resolve().then(() => {
	console.log('4. Resolved Promise callback');
});

console.log(`2. Blocking ${iterations.toLocaleString()} iterations`);
const result = blockingWork(iterations);
const elapsed = performance.now() - start;

console.log(`Blocking work result: ${result}`);
console.log(`Blocking work elapsed: ${elapsed.toFixed(2)} ms`);
console.log('2. Synchronous code ends; callbacks can run now');
