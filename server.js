import express from 'express';
import mysql2 from 'mysql2';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import  { createPatientInfo, createSecContactInfo, previewPatientList, 
    expandPatientDetails, saveToDatabase, updateAttributes, options} from  './db.js';
const app = express();
const port = 3000;  

const store = MySQLStore(session);

const pool = mysql2.createPool(options);
const sessionStore = new store({}, pool);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('public'))); 
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
    res.json({ redirect: '/html/seccontact.html' });
});

app.post('/save', (req, res) => {
    if (!req.session.patientDetail) {
        res.json({ redirect: '/html/regpatient.html' });
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
        res.json({redirect: '/html/patientdetails.html'});
    });
});

// post retrieved details to client side
app.get('/patientDetails', (req, res) => {
    if (!req.session.expandDetail) {
        res.json({redirect: '/html/patientlist.html'});
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

app.post('/login', (req, res) => {
    console.log(req.body);
})

app.get('/', (req, res) => {
    res.sendFile(path.join('public', 'html', 'HMS.html'));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});