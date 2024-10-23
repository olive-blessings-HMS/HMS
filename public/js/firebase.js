import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDXWA9cbObzKFddqebF34Ke9m6qhjkbMHw",
    authDomain: "hospital-90a89.firebaseapp.com",
    projectId: "hospital-90a89",
    storageBucket: "hospital-90a89.appspot.com",
    messagingSenderId: "409945300926",
    appId: "1:409945300926:web:d2cee5e2eda49520c3e3ef",
    measurementId: "G-0QJCKL2DTZ"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);