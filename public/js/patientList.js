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

    Object.entries(states).forEach(([key, value]) => {
        createSelect(selectElements, key, value);
        createSelect(selectElementsTwo, key, value);
    });

    function createSelect(element, key, value) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = value;
        element.appendChild(option)
    }

    let patientRegistration = document.getElementById('patient-details');

    patientRegistration.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(patientRegistration);
        const urlEncodedData = new URLSearchParams(formData).toString();

        console.log('sending network status')

        try {
            const response = await fetch('/submit', {
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
});