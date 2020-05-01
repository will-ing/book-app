'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent')
const PORT = process.env.PORT || 3000;
const pg = require('pg');
const app = express();

const client = new pg.Client(process.env.DATABASE_URL)


app.use(express.urlencoded({ extended: true }));


// express setup
app.set('view engine', 'ejs');
app.use(express.static('./public'));


// route handlers
app.get('/', handleIndex);
app.get('/searchForm', handleSearchForm);
app.get('/search', handleSearch);
app.post('/save', handleSave);
app.get('*', handle404);


function handleIndex(req, res) {
  const SQL = 'SELECT * FROM books';

  client.query(SQL)
    .then(results => {
      if (results.rows.length > 0) {
        res.status(200).render('pages/index.ejs', { book_app: results.rows });
      } else {
        res.status(200).render('pages/index.ejs')
      }
      })
    .catch( error => {
      res.status(404).send(`Page ${req.error} can't be found`);
    })
  }



function handleSave(req, res) {
  let SQL = `
    INSERT INTO books(author, title, isbn, image_url, descrip, bookshelf)
    VALUES($1, $2, $3, $4, $5, $6)
    `;
  let VALUES = [
    req.body.author,
    req.body.title,
    req.body.isbn,
    req.body.image_url,
    req.body.descrip,
    req.body.amount,
  ]
  console.log(VALUES)
  client.query(SQL, VALUES)
    .then(results => {
      res.status(200).redirect('/');
    })
}

// route to the search form page

function handleSearchForm(req, res) {


  res.status(200).render('pages/searches/show.ejs')
}

// This route is for the results


function handleSearch(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes';

  let queryObject = {
    q: `${req.body.searchby}:${req.body.search}`
  };
  superagent.get(url)
    .query(queryObject)
    .then(results => {
      let books = results.body.items.map(book => new Book(book));
      res.status(200).render('pages/searches/new.ejs', { books })
    })
}

function Book(data) {
  this.title = data.volumeInfo.title;
  this.amount = data.saleInfo.listPrice ? data.saleInfo.listPrice.amount : 'no price listed';
  this.author = data.volumeInfo.authors;
  this.descrip = data.volumeInfo.description || 'Sorry just the cover'
  // this.isbn = data.volumeInfo.industryIdentifiers[0].identifier === 'undefined' ? data.volumeInfo.industryIdentifiers[0].identifier : 'does not exist'
  this.image_url = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg'
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



function handle404() {

  console.log(req);
  res.status(404).send(`Page ${req.path} can't be found`)
}


/// start Server ///

function startServer(PORT) {
  app.listen(PORT, () => console.log(`server running on ${PORT}`));
}

client.connect()
  .then(() => {
    startServer(PORT);
  })
  .catch(error => console.error(error.message));