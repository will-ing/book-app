DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url TEXT,
  descrip TEXT,
  bookshelf VARCHAR(255)
);




-- in postgres
-- CREATE DATABASE "name of db" remember to use the semi colon and save file
-- \c "name of table" / connect to

-- connect to server
-- import pg
-- connect client
-- start web server
-- const SQL = 'SELECT * FROM dbname'
-- client.query(SQL)
-- create that error goes to 500.ejs