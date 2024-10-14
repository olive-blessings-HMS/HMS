const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const path = require('path');
const { createPatientInfo, createSecContactInfo, previewPatientList, 
    expandPatientDetails, saveToDatabase, updateAttributes, options} = require('./db');
const app = express();
const port = 3000;  

const pool = mysql.createPool(options);
const sessionStore = new MySQLStore({}, pool);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/js', express.static(path.join(__dirname, 'public/js'))); 
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

// retrieve list of all patient on database
app.get('/patientlist', (req, res) => {
    previewPatientList((patientList) => {
        res.json(patientList);
    });
});

// retrieve primaryKey and use to extract patient data
app.post('/expandData', (req, res) => {
    const value = req.body;
    req.session.patientID = parseInt(value, 10);
    expandPatientDetails(req.session.patientID, (results) => {
        req.session.expandDetail =results;
        res.json({redirect: '/html/patientDetails.html'});
    });
});

// post retrieved details to client side
app.get('/patientDetails', (req, res) => {
    if (!req.session.expandDetail) {
        res.json({redirect: '/html/patientList.html'});
        return;
    }
    res.json(req.session.expandDetail);
});

app.post('/updateDetails', (req, res) => {
    const updatedData = req.body;
    updateAttributes('patient_details', updatedData, req.session.patientID);
    req.session.destroy((err) => {
        if (err) {
            return res.status(500);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});