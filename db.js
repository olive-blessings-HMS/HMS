const mysql = require('mysql2');
require('dotenv').config();

class PatientName {
    constructor({firstname, middlename, lastname, gender}) {
       this.firstName = firstname;
       this.middleName = middlename;
       this.lastName = lastname;
       this.gender = gender;
    };
 
    getFullname() {
       return `${this.firstName} ${this.middleName} ${this.lastName}`;
    };

    saveToDatabase(callback) {
        const query = `INSERT INTO patient_details (first_name, middle_name, last_name,
        gender) values (?,?,?,?)`;
        const values = [this.firstName, this.middleName, this.lastName, this.gender];
        updatedb(query, values, callback);
    };
};

class PatientAddress {
    constructor({address, addressTwo, lga, state}) {
       this.address = address;
       this.addressTwo = addressTwo;
       this.lga = lga;
       this.state = state;
    };

    saveToDatabase(rowId) {
        const query = `UPDATE patient_details SET street_name = ?, street_name_two = ?, lga = ?, state = ?
        WHERE id = ?`;
        const values = [this.address, this.addressTwo, this.lga, this.state, rowId];
        updatedb(query, values);
    };
};

class PatientContact {
    constructor({contactNumber, contactEmail}) {
        this.contactNumber = contactNumber;
        this.contactEmail = contactEmail;
    };

    saveToDatabase(rowId) {
        const query = `UPDATE patient_details SET phone_number = ?, email = ?
        WHERE id = ?`;
        const values = [this.contactNumber, this.contactEmail, rowId];
        updatedb(query, values);
    };
};

class PatientOtherInfo {
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

function saveAllPatientDetails(formDetails) {
    const patientAddress = new PatientAddress(formDetails);
    const patientName = new PatientName(formDetails);
    const patientContact = new PatientContact(formDetails);
    const patientOtherInfo = new PatientOtherInfo(formDetails);
    patientName.saveToDatabase((insertId) => {
        patientContact.saveToDatabase(insertId);
        patientOtherInfo.saveToDatabase(insertId);
        patientAddress.saveToDatabase(insertId);
    });
};

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
 });

function updatedb(query, values = [], callback) {
    pool.getConnection(
        (err, conn) => {
        if (err) {
            console.log('data base failed');
            throw err;
        };
        conn.query(query, values, (err, results) => {
            if (err) {
                console.log(`error message ${err}`);
            };

            if (callback) {
                callback(results.insertId);
            }
            conn.release();
        });  
    }); 
};

module.exports = saveAllPatientDetails;