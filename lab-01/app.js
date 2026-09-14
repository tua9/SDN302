const os = require('os');
const path = require('path');
const chalk = require('chalk');
const { applyDiscount, formatPrice, isValidISBN } = require('./bookUtils');


const firstNumber = Number(process.argv[2]);
const secondNumber = Number(process.argv[3]);
const fullName = 'Le Anh Tuan';
const studentCode = 'DE170051';

const bookPrice = 25;
const discountedPrice = applyDiscount(bookPrice, 20);

console.log(chalk.green(`Welcome, ${fullName} (${studentCode})!`));
console.log(`Current date: ${new Date().toLocaleDateString()}`);

if (Number.isNaN(firstNumber) || Number.isNaN(secondNumber)) {
	console.error('Please provide two valid numbers.');
	process.exitCode = 1;
} else {
	console.log(`Sum: ${firstNumber + secondNumber}`);
	console.log(`Difference: ${firstNumber - secondNumber}`);
	console.log(`Product: ${firstNumber * secondNumber}`);
	console.log(`Quotient: ${secondNumber === 0 ? 'undefined' : firstNumber / secondNumber}`);
}

console.log(`Book price: ${formatPrice(bookPrice)}`);
console.log(`Price after 20% discount: ${formatPrice(discountedPrice)}`);
console.log(`ISBN valid: ${isValidISBN('978-0-123456-47-2')}`);
console.log(`Platform: ${os.platform()}`);
console.log(`CPU count: ${os.cpus().length}`);
console.log(`Free memory: ${os.freemem()} bytes`);
console.log(`Current file: ${path.resolve(__filename)}`);
