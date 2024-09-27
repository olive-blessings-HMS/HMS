document.addEventListener('DOMContentLoaded', () => {
    const personalInformation = document.querySelector("#firstname, #middlename, #lastname");
    fetch('/patientDetails')
    .then(async response => {
        if (!response.ok) {
            throw new Error(`error retrieving userdetails${response.status}`);
        }

        const data = await response.json();

        if (data.redirect) {
            window.location.href = data.redirect;
            return;
        }
        return data[0];
    })
    .then(patientData => {
        const nameElement = document.createElement('p');
        nameElement.textContent = `${patientData.firstname}`;
        firstName.appendChild(nameElement);
    })
})