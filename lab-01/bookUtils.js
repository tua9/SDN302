function formatPrice(price) {
	return `$${price.toFixed(2)}`;
}

function applyDiscount(price, discountPercent) {
	return price * (1 - discountPercent / 100);
}

function isValidISBN(isbn) {
	const digits = String(isbn).replace(/[-\s]/g, '');
	return /^\d{13}$/.test(digits);
}

module.exports = { formatPrice, applyDiscount, isValidISBN };
