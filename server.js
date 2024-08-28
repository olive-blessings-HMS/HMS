const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.post('/submit', (req, res) => {
   const formDetails = req.body;
   const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
   });

   connection.connect((error) => {
      if(error) {
         console.error("connection failed" + error.stack)
         return;
      }

      console.log("connection successful")
   });

   console.log('Form data received', formDetails);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

class PatientName {
   constructor(firstName, middleName, surName) {
      this.firstName = formDetails.firstname;
      this.middleName = formDetails.middlename;
      this.lastName = formDetails.lastname;
   }

   get fullname() {
      return "${firstName} ${middleName} ${lastName}";
   }
}

class PatientAttributes {
   constructor(birthDay, gender, religion, occupation, nationality) {
      this.birthDay = formDetails.birthday;
      this.gender = formDetails.gender;
      this.regilion = formDetails.regilion;
      this.occupation = formDetails.occupation;
      this.nationality = formDetails.nationality;
   }
}

class PatientAddress {
   constructor() {
      
   }
}



function insertPersonalDetails(phone_number, email, address_info, state_of_orign, nationality, doctors_note) {

  }