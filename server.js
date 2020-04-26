'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent')
const PORT = process.env.PORT || 3000;

const app = express();

// using express to run template
app.set('view engine', 'ejs');

app.use( express.urlencoded({extended:true}));

app.use( express.static('./public') );

app.get('/error', (req, res) => {
  throw new Error('string');
})

app.get('/', (req, res) => {
  try{
    res.status(200).render('pages/index.ejs');
  }
  catch{ 
    throw new Error('string');
   }
})

// app.get('/books', (req, res) => {
//   try{
//     let data = {
//       name: req.query.name,
//       hairstyle: req.query.hair,
//       kids: ['Zach', 'Allie'],
//     }
//     res.status(200).render('pages/show.ejs', {index:data})
//   }
//   catch{
//     throw new Error('string');
//   }

// })

// --------------- new stuff ---------- //

app.get('/searchForm' , (req, res) => {
  res.status(200).render('pages/searches/show.ejs')
})

app.post('/search', (req, res) => {

  let url = 'https://www.googleapis.com/books/v1/volumes';
  let queryObject = {
    q: `${req.body.searchby}:${req.body.search}`
  }

   superagent.get(url)
    .query( queryObject )
    .then( results => {
      let books = results.body.items.map(book => new Book(book))
      console.log(books)
      res.status(200).render('pages/searches/new.ejs', {books: books})
    })
})

function Book(data) {
  this.title = data.volumeInfo.title;
  this.amount = data.saleInfo.listPrice ? data.saleInfo.listPrice.amount : 'no price listed';
  this.author = data.author;
  this.desc = data.description || 'Sorry just the cover'
  // this.isbn = data.industryIdentifiers[0].identifier || 'does not exist'
  this.img = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg'
}

// url('https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}')
// https://developers.google.com/books/docs/v1/using



// --------------- new stuff ---------- //

/// handling errors ///

/* use throw New Error('string') on to catch all the errors you expect */
app.use( (err, req, res, next) => {
  console.error(err)
  res.status(500).send(err.message);
})


/// start Server ///
function startServer(){
  app.listen(PORT, () => console.log(`server running on ${PORT}`));
}

startServer();