const { performance } = require('perf_hooks');

const iterations = Number(process.env.ITERATIONS) || 3_000_000_000;
const chunkSize = 1_000_000;

function nonBlockingWork(totalIterations, size) {
	return new Promise((resolve) => {
		let completed = 0;
		let total = 0;

		function processChunk() {
			const end = Math.min(completed + size, totalIterations);

			for (let index = completed; index < end; index += 1) {
				total += index;
			}

			completed = end;

			if (completed < totalIterations) {
				setImmediate(processChunk);
			} else {
				resolve(total);
			}
		}

		processChunk();
	});
}

console.log('1. Synchronous code starts');

const start = performance.now();
const work = nonBlockingWork(iterations, chunkSize);

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

console.log(`2. Asynchronous work started for ${iterations.toLocaleString()} iterations`);

work.then((result) => {
	const elapsed = performance.now() - start;
	console.log(`Asynchronous work result: ${result}`);
	console.log(`Asynchronous work elapsed: ${elapsed.toFixed(2)} ms`);
	console.log('2. Event loop remained available while chunks were processed');
});
