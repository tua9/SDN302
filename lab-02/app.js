const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3000;
const ROOT_DIR = __dirname;
const BOOKS_FILE = path.join(ROOT_DIR, 'books.json');
const LOG_DIR = path.join(ROOT_DIR, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'access.log');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log("Root directory:", ROOT_DIR);
console.log("Books file path:", BOOKS_FILE);


const initialBooks = [
  { id: 1, title: 'Node.js for Beginners', author: 'Alice', category: 'IT', price: 220000 },
  { id: 2, title: 'JavaScript Deep Dive', author: 'Bob', category: 'IT', price: 260000 },
  { id: 3, title: 'Clean Code', author: 'Carl', category: 'Programming', price: 310000 },
  { id: 4, title: 'The Pragmatic Programmer', author: 'Dana', category: 'Software', price: 290000 },
  { id: 5, title: 'Design Patterns', author: 'Eve', category: 'Architecture', price: 350000 }
];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function logRequest(method, url) {
  const line = `${new Date().toISOString()} | ${method} | ${url}\n`;
  fs.appendFileSync(LOG_FILE, line, 'utf8');
}

function readBooksCallback(callback) {
  fs.readFile(BOOKS_FILE, 'utf8', (err, data) => {
    if (err && err.code === 'ENOENT') {
      fs.writeFile(BOOKS_FILE, JSON.stringify(initialBooks, null, 2), 'utf8', () => callback(null, initialBooks));
      return;
    }
    if (err) {
      callback(err);
      return;
    }

    try {
      callback(null, JSON.parse(data));
    } catch (error) {
      callback(error);
    }
  });
}

async function readBooksAsync() {
  try {
    const data = await fs.promises.readFile(BOOKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.writeFile(BOOKS_FILE, JSON.stringify(initialBooks, null, 2), 'utf8');
      return initialBooks;
    }
    throw error;
  }
}

async function writeBooksAsync(books) {
  await fs.promises.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2), 'utf8');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload, null, 2));
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendHtml(res, 404, '<h1>404 - File not found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;

  ensureLogDir();
  logRequest(req.method, req.url);

  if (pathname === '/' || pathname === '/home') {
    const html = `
      <!doctype html>
      <html>
        <head>
          <title>BookNest</title>
          <link rel="stylesheet" href="/public/style.css" />
        </head>
        <body>
          <div class="container">
            <h1>BookNest Online Bookstore</h1>
            <p>Welcome to the Lab 02 API server.</p>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/api/books">Books API</a></li>
              <li><a href="/download">Download cover</a></li>
            </ul>
            <img src="/public/book-cover.svg" alt="Book cover" class="cover" />
          </div>
        </body>
      </html>
    `;
    sendHtml(res, 200, html);
    return;
  }

  if (pathname === '/about') {
    if (req.method !== 'GET') {
      sendHtml(res, 405, '<h1>405 - Method Not Allowed</h1><p>Only GET is supported on /about.</p>');
      return;
    }

    sendHtml(res, 200, '<h1>About BookNest</h1><p>This project demonstrates Node.js HTTP server, REST APIs and file system handling.</p>');
    return;
  }

  if (pathname === '/api/books') {
    if (req.method === 'GET') {
      const category = url.searchParams.get('category');
      const limitParam = url.searchParams.get('limit');
      const limit = limitParam ? Number(limitParam) : undefined;

      readBooksCallback((err, books) => {
        if (err) {
          sendJson(res, 500, { error: 'Failed to read books data.' });
          return;
        }

        let result = books;
        if (category) {
          result = result.filter((book) => book.category.toLowerCase() === category.toLowerCase());
        }
        if (limit && !Number.isNaN(limit)) {
          result = result.slice(0, limit);
        }

        sendJson(res, 200, result);
      });
      return;
    }

    if (req.method === 'POST') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');

          if (!payload.title || !payload.author || !payload.category) {
            sendJson(res, 400, { error: 'Title, author, and category are required.' });
            return;
          }

          const books = await readBooksAsync();
          const newBook = {
            id: books.length ? books[books.length - 1].id + 1 : 1,
            title: payload.title,
            author: payload.author,
            category: payload.category,
            price: payload.price || 0
          };

          books.push(newBook);
          await writeBooksAsync(books);
          sendJson(res, 201, newBook);
        } catch (error) {
          sendJson(res, 400, { error: 'Invalid JSON body.' });
        }
      });
      return;
    }

    sendHtml(res, 405, '<h1>405 - Method Not Allowed</h1><p>Only GET and POST are supported on /api/books.</p>');
    return;
  }

  if (pathname === '/download') {
    if (req.method !== 'GET') {
      sendHtml(res, 405, '<h1>405 - Method Not Allowed</h1><p>Only GET is supported on /download.</p>');
      return;
    }

    const filePath = path.join(PUBLIC_DIR, 'book-cover.svg');
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': 'attachment; filename="book-cover.svg"'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  if (pathname.startsWith('/public/')) {
    const relativePath = pathname.replace('/public/', '');
    const filePath = path.join(PUBLIC_DIR, relativePath);
    if (filePath.startsWith(PUBLIC_DIR)) {
      serveStaticFile(res, filePath);
      return;
    }
  }
  

  sendHtml(res, 404, '<h1>404 - Page not found</h1><p>The page you requested does not exist.</p>');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
