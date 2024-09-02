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
    constructor({firstname, middlename, lastname}) {
       this.firstName = firstname;
       this.middleName = middlename;
       this.lastName = lastname;
    }
 
    getFullname() {
       return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }

    saveToDatabase() {
        const query = 'INSERT INTO patient_details (first_name, middle_name, last_name) values (?,?,?)';
        const values = [this.firstName, this.middleName, this.lastName];
        updatedb(query, values);
    }
};

class PatientContact {
    constructor({contactNumber, contactEmail}) {
        this.contactNumber = contactNumber;
        this.contactEmail = contactEmail;
    }

    saveToDatabase() {
        const query = `INSERT INTO patient_details (phone_number, email) values (?,?,?)`;
        const values = [this.contactNumber, this.contactEmail];
        updatedb(query, values);
    }
}

class PatientOtherInfo {
    constructor({dob, gender, stateOfOrigin, nationality, religion, occupation, doctorsNote}) {
        this.dob = dob;
        this.gender = gender;
        this.stateOfOrigin = stateOfOrigin;
        this.nationality = nationality;
        this.religion = religion;
        this.occupation = occupation;
        this.doctorsNote = doctorsNote;
    }

    saveToDatabase() {
        const query = `
            INSERT INTO patient_details (dob, gender, 
            state_of_origin, nationality, religion, 
            occupation, doctors_note) values (?,?,?,?,?,?,?)`
        const values = [this.dob, this.gender, this.stateOfOrigin, 
            this.nationality, this.religion, this.occupation, this.doctorsNote];
        updatedb(query, values);
        console.log("is it even reaching here?");
    }
}

function saveAllPatientDetails(formDetails) {
    const patientAddress = new PatientAddress(formDetails);
    const patientName = new PatientName(formDetails);
    const patientContact = new PatientContact(formDetails);
    const patientOtherInfo = new PatientOtherInfo(formDetails);
    patientAddress.saveToDatabase();
    patientName.saveToDatabase();
    patientContact.saveToDatabase();
    patientOtherInfo.saveToDatabase();
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
        });
        conn.release;
    });
    
};


module.exports = saveAllPatientDetails;