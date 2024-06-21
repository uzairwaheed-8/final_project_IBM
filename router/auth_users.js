const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  return !!users.find(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Write code to check if username and password match the one we have in records
  return !!users.find(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const parsedIsbn = parseInt(isbn, 10);
  const bookIndex = books.findIndex(book => book.isbn ===  parsedIsbn);
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[bookIndex].review = review;
  return res.status(200).json({ message: "Review added successfully", book: books[bookIndex] });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const parsedIsbn = parseInt(isbn, 10);
  const bookIndex = books.findIndex(book => book.isbn === parsedIsbn);
  
  // if (bookIndex === -1 || !books[bookIndex].review) {
  //   return res.status(404).json({ message: "Review not found" });
  // }

  delete books[bookIndex].review;
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
