const mysql = require('mysql2');
require('dotenv').config();

class PatientAddress {
    constructor({address, addressTwo, lga, state}) {
       this.address = address;
       this.addressTwo = addressTwo;
       this.lga = lga;
       this.state = state;
    };

    saveToDatabase() {
        const query = 'INSERT INTO address (street_name, street_name_two, lga, state) Values (?,?,?,?)';
        const values = [this.address, this.addressTwo, this.lga, this.state];
        updatedb(query, values);
    };
};


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

    saveToDatabase() {
        const query = `INSERT INTO patient_details (first_name, middle_name, last_name,
        gender) values (?,?,?,?)`;
        const values = [this.firstName, this.middleName, this.lastName, this.gender];
        updatedb(query, values);
    };
};

class PatientContact {
    constructor({contactNumber, contactEmail}) {
        this.contactNumber = contactNumber;
        this.contactEmail = contactEmail;
    };

    saveToDatabase() {
        const query = `INSERT INTO patient_details (phone_number, email) values (?,?)`;
        const values = [this.contactNumber, this.contactEmail];
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

    saveToDatabase() {
        const query = `
            INSERT INTO patient_details (dob,
            state_of_origin, religion, 
            occupation, doctors_note) values (?,?,?,?,?)`;
        const values = [this.dob, this.stateOfOrigin,
             this.religion, this.occupation, this.doctorsNote];
        updatedb(query, values);
    };
};

function saveAllPatientDetails(formDetails) {
    // const patientAddress = new PatientAddress(formDetails);
    const patientName = new PatientName(formDetails);
    // const patientOtherInfo = new PatientOtherInfo(formDetails);
    const patientContact = new PatientContact(formDetails);
    patientName.saveToDatabase();
    // patientOtherInfo.saveToDatabase();
    // patientAddress.saveToDatabase();
    patientContact.saveToDatabase();
};

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
 });

function updatedb(query, values = []) {
    pool.getConnection(
        (err, conn) => {
        if (err) {
            console.log('data base failed');
            throw err;
        }
        conn.query(query, values, (err, results) => {
            if (err) {
                console.log(`error message ${err}`);
            }
            console.log(`${results}`);
            conn.release;
        });
    }); 
};


module.exports = saveAllPatientDetails;