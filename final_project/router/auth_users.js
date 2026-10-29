// const express = require('express');
// const jwt = require('jsonwebtoken');
// let books = require("./booksdb.js");
// const regd_users = express.Router();

// let users = [];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

// //only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
// module.exports.users = users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');

const regd_users = express.Router();

let users = [];

// Check whether the username is already registered
const isValid = (username) => {
    return users.some((user) => user.username === username);
};

// Check whether username and password match
const authenticatedUser = (username, password) => {
    return users.some(
        (user) =>
            user.username === username &&
            user.password === password
    );
};

// Only registered users can log in
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: 'Invalid username or password'
        });
    }

    const accessToken = jwt.sign(
        { username },
        'access',
        { expiresIn: '1h' }
    );

    return res.status(200).json({
        message: 'Login successful',
        token: accessToken
    });
});

// Add or update a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Authentication token is required'
        });
    }

    let username;

    try {
        const decoded = jwt.verify(token, 'access');
        username = decoded.username;
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }

    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!books[isbn]) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    if (!review || !review.trim()) {
        return res.status(400).json({
            message: 'Review is required'
        });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Each user has one review per book
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: 'Review added successfully',
        reviews: books[isbn].reviews
    });
});

 // Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Authentication token is required'
        });
    }

    let username;

    try {
        const decoded = jwt.verify(token, 'access');
        username = decoded.username;
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }

    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({
            message: 'No review found for this user'
        });
    }

    delete book.reviews[username];

    return res.status(200).json({
        message: 'Review deleted successfully',
        reviews: book.reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;