const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error: Username and password are required" });
  }
  const existingUser = users.filter((user) => user.username === username);
  if (existingUser.length > 0) {
    return res.status(404).json({ message: "User already exists!" });
  }
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({ isbn: isbn, ...books[isbn] });
    }
  });
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push({ isbn: isbn, ...books[isbn] });
    }
  });
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books using async-await with Axios
public_users.get('/async', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Search by ISBN using Promises
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  getBookByISBN.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json({ message: err });
  });
});

// Search by Author using Promises
public_users.get('/promise/author/:author', function (req, res) {
  const author = req.params.author;
  const getBookByAuthor = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({ isbn: isbn, ...books[isbn] });
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("Author not found");
    }
  });
  getBookByAuthor.then((result) => {
    return res.status(200).json(result);
  }).catch((err) => {
    return res.status(404).json({ message: err });
  });
});

// Search by Title using Promises
public_users.get('/promise/title/:title', function (req, res) {
  const title = req.params.title;
  const getBookByTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn: isbn, ...books[isbn] });
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("Title not found");
    }
  });
  getBookByTitle.then((result) => {
    return res.status(200).json(result);
  }).catch((err) => {
    return res.status(404).json({ message: err });
  });
});

module.exports.general = public_users;
