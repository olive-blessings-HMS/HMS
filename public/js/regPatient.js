document.addEventListener('DOMContentLoaded', () => {
    // Select all <select> elements for state
    const selectElements = document.getElementById('state');
    const selectElementsTwo = document.getElementById('stateOfOrigin');

    let states = {
        1: 'Abia', 2: 'Adamawa', 3: 'Akwa Ibom', 4: 'Anambra', 5: 'Bauchi', 6: 'Bayelsa', 
        7: 'Benue', 8: 'Borno', 9: 'Cross River', 10: 'Delta', 11: 'Ebonyi', 12: 'Edo', 
        13: 'Ekiti', 14: 'Enugu', 15: 'Gombe', 16: 'Imo', 17: 'Jigawa', 18: 'Kaduna', 
        19: 'Kano', 20: 'Katsina', 21: 'Kebbi', 22: 'Kogi', 23: 'Kwara', 24: 'Lagos', 
        25: 'Nasarawa', 26: 'Niger', 27: 'Ogun', 28: 'Ondo', 29: 'Osun', 30: 'Oyo', 
        31: 'Plateau', 32: 'Rivers', 33: 'Sokoto', 34: 'Taraba', 35: 'Yobe', 36: 'Zamfara', 
        37: 'Federal Capital Territory (FCT)', 38: 'N/A'
    };

    function createSelect(element, key, value) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = value;
        element.appendChild(option)
    }

    Object.entries(states).forEach(([key, value]) => {
        createSelect(selectElements, key, value);
        createSelect(selectElementsTwo, key, value);
    });

    let patientRegistration = document.getElementById('patient-details');

    patientRegistration.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData(patientRegistration);
            const urlEncodedData = new URLSearchParams(formData).toString();

            if (!validateForm(formData)) {
                throw new Error("Required fields are missing");
            }
    
            const response = await fetch('/next', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
            body: urlEncodedData
            })
            
            if (!response.ok) {
                throw new Error('Server error:' + response.status);
            }

            const data = await response.json();
            window.location.href = data.redirect;

        } catch (error) {
            console.log('Network error occured:', error);
        }
    });

    function validateForm(formData) {
    
        const firstNameError = document.getElementById("firstNameError");
        const lastNameError = document.getElementById("lastNameError");
        const genderError = document.getElementById("genderError");
        const birthdayError = document.getElementById("birthdayError");
        const contactNumberError = document.getElementById("contactNumberError");
    
        firstNameError.textContent = "";
        lastNameError.textContent = "";
        genderError.textContent = "";
        birthdayError.textContent = "";
        contactNumberError.textContent = "";
    
        let isValid = true;
        
        if (formData.get("firstname") === "" || formData.get("firstname") === null 
        || /\d/.test(formData.get("firstname"))) {
            firstNameError.textContent = 
                "please enter your first name properly";
            firstNameError.style.color = "red"
            isValid = false;
        };
       
        if (formData.get("lastname") === "" || formData.get("lastname") === null  
        || /\d/.test(formData.get("firstname"))) {
            lastNameError.textContent = 
                "please enter your last name properly";
            lastNameError.style.color = "red"
            isValid = false;
        };
  
        if (formData.get("gender") === "" || formData.get("gender") === null) {
            genderError.textContent = 
                "please select a gender";
            genderError.style.color = "red"
            isValid = false;
        };
     
        if (formData.get("birthday") === "") {
            birthdayError.textContent = 
                "please enter birthday";
            birthdayError.style.color = "red"
            isValid = false;
        };
    
        if (formData.get("contactNumber") === "" || /[a-zA-Z]/.test(formData.get("contactNumber"))) {
            contactNumberError.textContent = 
                "please enter a valid phonenumber";
            contactNumberError.style.color = "red"
            isValid = false;
        };
    
        return isValid;
    };
});

