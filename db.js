const mysql = require('mysql2');
require('dotenv').config();

// use classes incase framworks are introduced later
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
}

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

// avoid callback hell later
// roll back sql transcations
function saveToDatabase(patientDetails, secContactDetails) {
    let insertId, secInsertId;
    patientDetails.patientName.saveToDatabase("patient_details", (patient) => {
        insertId = patient.insertId;
        patientDetails.patientAddress.saveToDatabase("patient_details", insertId),
        patientDetails.patientContact.saveToDatabase("patient_details", insertId),
        patientDetails.patientOtherInfo.saveToDatabase(insertId)

        secContactDetails.secContactName.saveToDatabase("secondary_contact", (secContact) => {
            secInsertId = secContact.insertId;
            secContactDetails.secContactAddress.saveToDatabase("secondary_contact", secInsertId),
            secContactDetails.secContactInfo.saveToDatabase("secondary_contact", secInsertId)
    
            const query = 'INSERT INTO patient_secondaryContact (patient_id, sec_cont_id) values (?,?)';
            const value = [insertId, secInsertId];
            updatedb(query, value);
        });
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
                throw err;
            };

            if (callback) {
                callback(results);
            };
        });  
    }); 
}

function previewPatientList(callback) {
    const query = `SELECT p.id, CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name) AS full_name, 
    g.gender, p.dob FROM patient_details p LEFT JOIN gender_option g on p.gender=g.id`;
    updatedb(query, [], (results) => {
        if (callback) {
            callback(results);
        };
    });
}

function expandPatientDetails(pk, callback) {
    const query = `SELECT p.first_name AS firstname, p.middle_name AS middlename, 
    p.last_name AS lastname, g.gender AS gender, p.dob AS birthday, p.nationality AS nationality, 
    p.religion AS religion, p.occupation AS occupation, p.phone_number AS phonenumber, p.email AS email,
    p.street_name AS addressOne, p.street_name_two AS addressTwo, p.lga AS lga, s.states AS state,
    ss.states AS stateOfOrigin, p.doctors_note AS doctorsNote 
    FROM patient_details p 
    LEFT JOIN gender_option g on p.gender = g.id 
    LEFT JOIN state s on p.state = s.id
    LEFT JOIN state ss on p.state_of_origin = ss.id
    where p.id=${pk}`;

    updatedb(query, [], (results) => {
        if (callback) {
            callback(results);
        };
    });
}

function updateAttributes(tableName, values, PK) {
    const columnsQuery = 'SHOW COLUMNS FROM PATIENT_DETAILS';
    let index = 0;
    updatedb(columnsQuery, [], (results) => {
        results.forEach(column => {
            if (column.Field != 'id') {
                const query = `UPDATE ${tableName}
                            SET ${column.Field} = ? 
                            WHERE id = ? AND ${column.Field} != ?`;
                const params = [values[index], PK, values[index]];
                updatedb(query, params);
                index +=1;
            }
        });
    });
}

module.exports = {
    createPatientInfo,
    createSecContactInfo,
    saveToDatabase,
    expandPatientDetails,
    previewPatientList,
    updateAttributes,
    options
};