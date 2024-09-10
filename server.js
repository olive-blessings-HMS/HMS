const express = require('express');
const path = require('path');
const saveAllPatientDetails = require('./db');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.post('/submit', (req, res) => {
    const formDetails = req.body;
    console.log(formDetails);
    saveAllPatientDetails(formDetails);
    res.json({ redirect: '/html/secContact.html' });

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
