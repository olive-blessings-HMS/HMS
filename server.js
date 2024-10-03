const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const path = require('path');
const { createPatientInfo, createSecContactInfo, previewPatientList, 
    expandPatientDetails, saveToDatabase, options} = require('./db');
const app = express();
const port = 3000;  

const pool = mysql.createPool(options);
const sessionStore = new MySQLStore({}, pool);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.text()); // needed becasue the primaryKey is being passed as plain int 
app.use(session({
    key: process.env.KEY1,
    secret: process.env.SECRETKEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60}
})); // temp storage on mysql session

app.post('/next', (req, res) => {
    req.session.patientDetail = req.body;
    res.json({ redirect: '/html/secContact.html' });
});

app.post('/save', (req, res) => {
    // checks if patient information are saved
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
    previewPatientList((patientList) => {
        res.json(patientList);
    });
});

app.post('/expandData', (req, res) => {
    const value = req.body;
    const intValue = parseInt(value, 10);
    expandPatientDetails(intValue, (results) => {
        req.session.expandDetail =results;
        res.json({redirect: '/html/patientDetails.html'});
    });
});

app.get('/patientDetails', (req, res) => {
    if (!req.session.expandDetail) {
        res.json({redirect: '/html/patientList.html'});
        return;
    }
    res.json(req.session.expandDetail);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});