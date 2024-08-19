const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.post('/submit', (req, res) => {
   const formdetails = req.body;
   console.log('Form data received', formdetails);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });