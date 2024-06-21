const express = require('express');
const { isValid, users } = require("./auth_users.js");
const books = require("./booksdb.js");

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const filteredBooks = books.filter(book => book.author.toLowerCase().includes(author));
  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "Books by this author not found" });
  }
  return res.status(200).json(filteredBooks);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title));
  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "Books with this title not found" });
  }
  return res.status(200).json(filteredBooks);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json({ isbn: book.isbn, review: book.reviews });
});


module.exports.general = public_users;
