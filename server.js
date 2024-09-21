const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const path = require('path');
const { createPatientInfo, createSecContactInfo, saveToDatabase, 
    retrieveFromDatabase, options} = require('./db');
const app = express();
const port = 3000;  

const pool = mysql.createPool(options);
const sessionStore = new MySQLStore({}, pool);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.text());
app.use(session({
    key: process.env.KEY1,
    secret: process.env.SECRETKEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60}
}));

app.post('/next', (req, res) => {
    req.session.patientDetail = req.body;
    res.json({ redirect: '/html/secContact.html' });
});

app.post('/save', (req, res) => {
    if (!req.session.patientDetail) {
        res.json({ redirect: '/html/regPatient.html' });
        return;
    }
    const formDetails = req.body;
    const patientDetails = createPatientInfo(req.session.patientDetail);
    req.session.destroy((err) => {
        if (err) {
            return res.status(500);
        }
    });
    const secContactDetails = createSecContactInfo(formDetails);
    saveToDatabase(patientDetails, secContactDetails);
    res.json({ redirect: '/html/homepage.html' });
});

app.get('/patientlist', (req, res) => {
    retrieveFromDatabase((patientList) => {
        res.json(patientList);
    });
});

app.post('/patientDetails', (req, res) => {
    const value = req.body;
    const intValue = parseInt(value, 10);
    res.json({redirect: '/html/patientDetails.html', pateintId: intValue});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});