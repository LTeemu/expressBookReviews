const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

function fetchAllBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
}

function fetchBookByISBN(isbn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 1000);
  });
}

function fetchBooksByAuthor(author) {
  const bookEntries = Object.entries(books)
  const authorsBooks = bookEntries.filter(book => book[1].author === author.toString())
  let formatArr = []
  authorsBooks.forEach(book => formatArr.push({
    isbm: book[0],
    title: book[1].title,
    reviews: book[1].reviews
  }))
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formatArr);
    }, 1000);
  });
}

function fetchBookByTitle(title) {
  const bookEntries = Object.entries(books)
  const book = bookEntries.find(book => book[1].title === title.toString())
  const formatBook = {
    isbm: book[0],
    author: book[1].author,
    reviews: book[1].reviews
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formatBook);
    }, 1000);
  });
}

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check for missing username or password
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists.' });
  }

  // Create new user object and add to data store
  const newUser = { username, password };
  users.push(newUser);

  // Return success message
  res.json({ message: 'User registered successfully.' });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const books = await fetchAllBooks();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const book = await fetchBookByISBN(req.params.isbn);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const books = await fetchBooksByAuthor(req.params.author);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const book = await fetchBookByTitle(req.params.title);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;