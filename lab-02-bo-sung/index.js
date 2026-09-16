const {
  listAll,
  findByCategory,
  searchByTitle,
  stockReport
} = require('./services/catalog');

function printTable(title, rows) {
  console.log(`\n${title}`);
  console.table(rows);
}

printTable('All books', listAll());
printTable('Books in the Programming category', findByCategory('programming'));
printTable('Books matching "javascript"', searchByTitle('javascript'));

printTable('Stock report', [stockReport()]);