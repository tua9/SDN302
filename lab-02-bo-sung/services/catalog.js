const books = require('../data/books');

function listAll() {
  return [...books];
}

function findByCategory(name) {
  const category = String(name).trim().toLowerCase();
  return books.filter((book) => book.category.toLowerCase() === category);
}

function searchByTitle(keyword) {
  const searchTerm = String(keyword).trim().toLowerCase();
  return books.filter((book) => book.title.toLowerCase().includes(searchTerm));
}

function stockReport() {
  return {
    totalTitles: books.length,
    totalCopies: books.reduce((total, book) => total + book.stock, 0),
    outOfStock: books.filter((book) => book.stock === 0)
  };
}

module.exports = {
  listAll,
  findByCategory,
  searchByTitle,
  stockReport
};