let patientRegistration = document.getElementById('patient-details');

patientRegistration.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(patientRegistration);
    const urlEncodedData = new URLSearchParams(formData).toString();

    try {
        const response = await fetch('/submit', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: urlEncodedData,
        });

        if (!response.ok) {
            throw Error('Network response not ok');
        }

        const result = await response.json();
        console.log("success", result);
    } catch(error) {
        console.error('Error', error);
    }
});