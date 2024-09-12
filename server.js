const express = require('express');
const path = require('path');
const { createPatientInfo, createSecContactInfo, saveToDatabase } = require('./db');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

let patientDetailsStore = {};

app.post('/next', (req, res) => {
    const formDetails = req.body;
    patientDetailsStore = createPatientInfo(formDetails);
    res.json({ redirect: '/html/secContact.html' });
});

app.post('/save', (req, res) => {
    if (!patientDetailsStore) {
        return res.status(400);
    }
    const formDetails = req.body;
    secContactDetails = createSecContactInfo(formDetails);
    saveToDatabase(patientDetailsStore, secContactDetails);
    patientDetailsStore = {};
    res.json({ redirect: '/html/homepage.html' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});