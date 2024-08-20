const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.post('/submit', (req, res) => {
   const formDetails = req.body;
   const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
   });

   connection.connect((error) => {
      if(error) {
         console.error("connection failed" + error.stack)
         return;
      }
      console.log("connection successful")
   });

   // const address
   console.log('Form data received', formDetails);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });