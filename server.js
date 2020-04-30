'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent')
const PORT = process.env.PORT || 3000;

const app = express();

// using express to run template
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));


// app.get('*', (req, res) => {
//   console.log(req);
//   res.status(404).send(`Page ${req.path} can't be found`)
// })

// route to index page
app.get('/', (req, res) => {
  try {
    res.status(200).render('pages/index.ejs');
  }
  catch{
    res.status(404).send(`Page ${req.path} can't be found`);
  }
})

// route to the search form page
app.get('/searchForm', (req, res) => {
  res.status(200).render('pages/searches/show.ejs')
})

// This route is for the results
app.post('/search', (req, res) => {

  const url = 'https://www.googleapis.com/books/v1/volumes';
  let queryObject = {
    q: `${req.body.searchby}:${req.body.search}`
  };
  superagent.get(url)
    .query(queryObject)
    .then(results => {
      let books = results.body.items.map(book => new Book(book));
      res.status(200).render('pages/searches/new.ejs', {books})
    })
})

function Book(data) {
  this.title = data.volumeInfo.title;
  this.amount = data.saleInfo.listPrice ? data.saleInfo.listPrice.amount : 'no price listed';
  this.author = data.volumeInfo.authors;
  this.desc = data.volumeInfo.description || 'Sorry just the cover'
  this.isbn = data.volumeInfo.industryIdentifiers[0].identifier || 'does not exist'
  this.img = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg'
}

//Function to save books to db and have it render in index ejs and count how many books are in db

// Add en endpoint for a GET request to /books/:id the callback should allow client to make a request for a singular book

// create a new view to display the details of single book

//Build in the ability for the user to return to the main list of all books, from a book detail page.

//Display each book from the API 

//This form should submit the form data as a POST request to `/books`. The corresponding callback should include the necessary logic to add the book to the database.

//If you have not already done so when writing your server file, move your SQL queries and view rendering into callbacks. Reference the appropriate callback in each route.

//





/// handling errors ///

/* use throw New Error('string') on to catch all the errors you expect */
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send(err.message);
})

app.get('*', (req, res) => {
  console.log(req);
  res.status(404).send(`Page ${req.path} can't be found`)
})


/// start Server ///
function startServer() {
  app.listen(PORT, () => console.log(`server running on ${PORT}`));
}

startServer();