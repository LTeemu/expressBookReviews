const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are valid
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Generate JWT token for session
  let accessToken = jwt.sign({
    data: password
  }, 'access', {
    expiresIn: '1h'
  });
  req.session.authorization = {
    accessToken, username
  }
  res.json({ message: 'Login successful.' });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  books[req.params.isbn].reviews[req.session.authorization.username] = req.query.review
  res.status(200).json(`Review for book isbn ${req.params.isbn} added/updated`)
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  delete books[req.params.isbn].reviews[req.session.authorization.username]
  res.status(200).json(`Review for book isbn ${req.params.isbn} deleted.`)
});

module.exports.authenticated = regd_users;
module.exports.users = users;
