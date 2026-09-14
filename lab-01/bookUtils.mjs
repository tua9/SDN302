export function formatPrice(price) {
	return `$${price.toFixed(2)}`;
}

export function applyDiscount(price, discountPercent) {
	return price * (1 - discountPercent / 100);
}

export function isValidISBN(isbn) {
	const digits = String(isbn).replace(/[-\s]/g, '');
	return /^\d{13}$/.test(digits);
}
