const mysql = require('mysql2');
require('dotenv').config();

class PatientAddress {
    constructor({address, addressTwo, lga, state, stateOfOrigin}) {
       this.address = address;
       this.addressTwo = addressTwo;
       this.lga = lga;
       this.state = state;
       this.stateOfOrigin = stateOfOrigin;
    };

    saveToDatabase() {
        const query = 'INSERT INTO address (street_name, street_name_two, lga, state) Values (?,?,?,?)';
        const values = [this.address, this.addressTwo, this.lga, this.state];
        updatedb(query, values);
    };
};

function applyFromdata(formDetails) {
    const patientName = new PatientName(formDetails);
    const patientAddress = new PatientAddress(formDetails);
    console.log(`print addresstwo ${patientAddress.addressTwo}`);
    patientAddress.saveToDatabase();
};

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

class PatientName {
    constructor({firstname, middlename, lastname}) {
       this.firstName = firstname;
       this.middleName = middlename;
       this.lastName = lastname;
    }
 
    getFullname() {
       return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
};



const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
 });



module.exports = applyFromdata;