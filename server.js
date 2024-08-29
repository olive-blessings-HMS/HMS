const express = require('express');
const path = require('path');
const applyFromdata = require('./db');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.post('/submit', (req, res) => {
   const formDetails = req.body;
   applyFromdata(formDetails);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});