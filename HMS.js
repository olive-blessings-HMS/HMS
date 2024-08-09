let patientRegistration = document.getElementById('patient-details')

patientRegistration.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(document.getElementById("firstname").value)
});