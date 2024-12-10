import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXWA9cbObzKFddqebF34Ke9m6qhjkbMHw",
    authDomain: "hospital-90a89.firebaseapp.com",
    projectId: "hospital-90a89",
    appId: "1:409945300926:web:d2cee5e2eda49520c3e3ef",
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Register a New User
function register(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
              const user = userCredential.user;
              console.log("User registered", user);
        })
        .catch((error) => {
              console.error("Error registered", error);
        });
}

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
            const user = userCredential.user;

            console.log('User signed in');
            window.location.href = '/html/homepage.html';

            const idToken = await user.getIdToken();

            const response = fetch('/login', {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({userToken: idToken}),
            });
      })
      .catch((error) => {
            console.error("Error registered", error);
      });

});

fetch('/login', {
      method: "Post",
      headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
})
.then(response => response.json())
.then(data => {

})