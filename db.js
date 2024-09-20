const mysql = require('mysql2');
require('dotenv').config();

class Name {
    constructor({firstname, middlename, lastname, gender = null}) {
       this.firstName = firstname;
       this.middleName = middlename;
       this.lastName = lastname;
       this.gender = gender;
    };

    saveToDatabase(tableName, callback) {
        let query = `INSERT INTO ${tableName} (first_name, middle_name, last_name, gender)
        values (?,?,?,?)`
        if (tableName != "patient_details") {
            query = `INSERT INTO ${tableName} (first_name, middle_name, last_name)
            values (?,?,?)`
        };
        const values = [this.firstName, this.middleName, this.lastName, this.gender];
        updatedb(query, values, callback);
    };
}

class Address {
    constructor({address, addressTwo, lga, state}) {
       this.address = address;
       this.addressTwo = addressTwo;
       this.lga = lga;
       this.state = state;
    };

    saveToDatabase(tableName, rowId) {
        const query = `UPDATE ${tableName} SET street_name = ?, street_name_two = ?, lga = ?, state = ?
        WHERE id = ?`;
        const values = [this.address, this.addressTwo, this.lga, this.state, rowId];
        updatedb(query, values);
    };
}

class ContactInfo {
    constructor({contactNumber, contactEmail}) {
        this.contactNumber = contactNumber;
        this.contactEmail = contactEmail;
    };

    saveToDatabase(tableName, rowId) {
        const query = `UPDATE ${tableName} SET phone_number = ?, email = ?
        WHERE id = ?`;
        const values = [this.contactNumber, this.contactEmail, rowId];
        updatedb(query, values);
    };
}

class OtherInfos {
    constructor({birthday, stateOfOrigin, religion, occupation, doctorsNote}) {
        this.dob = birthday;
        this.stateOfOrigin = stateOfOrigin;
        this.religion = religion;
        this.occupation = occupation;
        this.doctorsNote = doctorsNote;
    };

    saveToDatabase(rowId) {
        const query = `UPDATE patient_details
        SET dob = ?, state_of_origin = ?, religion = ?, occupation = ?, doctors_note = ? 
        WHERE id = ?`;
        const values = [this.dob, this.stateOfOrigin,
             this.religion, this.occupation, this.doctorsNote, rowId];
        updatedb(query, values);
    };
};

function createPatientInfo(formDetails) {
    return {
        patientName : new Name(formDetails),
        patientAddress : new Address(formDetails),
        patientContact : new ContactInfo(formDetails),
        patientOtherInfo : new OtherInfos(formDetails)
    };
}

function createSecContactInfo(formDetails) {
    return {
        secContactName : new Name(formDetails),
        secContactAddress : new Address(formDetails),
        secContactInfo : new ContactInfo(formDetails)
    };
}

function saveToDatabase(patientDetails, secContactDetails) {
    patientDetails.patientName.saveToDatabase("patient_details", (patient) => {
        patientDetails.patientAddress.saveToDatabase("patient_details", patient.insertId),
        patientDetails.patientContact.saveToDatabase("patient_details", patient.insertId),
        patientDetails.patientOtherInfo.saveToDatabase(patient.insertId)
    });

    secContactDetails.secContactName.saveToDatabase("secondary_contact", (secContact) => {
        secContactDetails.secContactAddress.saveToDatabase("secondary_contact", secContact.insertId),
        secContactDetails.secContactInfo.saveToDatabase("secondary_contact", secContact.insertId)
    });
}

const options = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

const pool = mysql.createPool(options);

function updatedb(query, values = [], callback) {
    pool.getConnection(
        (err, conn) => {

        if (err) {
            console.log('data base failed');
            throw err;
        };

        conn.query(query, values, (err, results) => {
            conn.release();

            if (err) {
                console.log(`error message ${err}`);
                return;
            };

            if (callback) {
                callback(results);
            };
        });  
    }); 
};

function retrieveFromDatabase(callback) {
    const query = "SELECT p.id, CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name) AS full_name, g.gender, p.dob FROM patient_details p LEFT JOIN gender_option g on p.gender=g.id;"
    updatedb(query, [], (results) => {
        if (callback) {
            callback(results);
        }
    })
};

module.exports = {
    createPatientInfo,
    createSecContactInfo,
    saveToDatabase,
    retrieveFromDatabase,
    options
};