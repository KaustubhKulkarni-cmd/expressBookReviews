// const express = require('express');
// let books = require("./booksdb.js");
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
// const public_users = express.Router();

// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
//  });

// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// //  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.general = public_users;

const express = require("express");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

// Task 7: Register a new user
// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered",
  });
});

// Task 2: Get all books
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// Task 3: Get book details by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  return res.status(200).json(book);
});

// Task 4: Get books by author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();

  const matchingBooks = Object.values(books).filter(
    (book) => book.author && book.author.toLowerCase() === author,
  );

  if (matchingBooks.length === 0) {
    return res.status(404).json({
      message: "No books found for this author",
    });
  }

  return res.status(200).json(matchingBooks);
});

// Task 5: Get books by title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  const matchingBooks = Object.values(books).filter(
    (book) => book.title && book.title.toLowerCase() === title,
  );

  if (matchingBooks.length === 0) {
    return res.status(404).json({
      message: "No books found with this title",
    });
  }

  return res.status(200).json(matchingBooks);
});

// Task 6: Get book reviews by ISBN
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
