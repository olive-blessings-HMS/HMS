const mysql = require('mysql2');
require('dotenv').config();

class PatientName {
    constructor({firstname, middlename, lastname}) {
       this.firstName = firstname;
       this.middleName = middlename;
       this.lastName = lastname;
    }
 
    getFullname() {
       return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
 });

 async function updatedb(formDetails) {
    pool.getConnection(
        (err, conn) => {
        if (err) {
            console.log('error getting connection ${err}');
            return;
        }
        console.log('connection successful');
        console.log('Form data received', formDetails);
        const patient = new PatientName(formDetails);
        console.log(patient.getFullname());
        conn.release;

    });
}

module.exports = updatedb;