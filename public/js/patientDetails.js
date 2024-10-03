document.addEventListener('DOMContentLoaded', () => {
    const patientInfoIds = [`#firstname`, `#middlename`, `#lastname`, `#gender`, 
    `#birthday`, `#occupation`, `#religion`, `#phonenumber`, `#email`, '#address']

    const editButton = document.createElement('button');
    editButton.textContent = 'Update';
    editButton.id = 'editButton';

    const patientProfile = document.getElementById('patient-profile');
    patientProfile.insertBefore(editButton, patientProfile.lastChild);

    // let isEditing = false;

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
        for (let index in patientInfoIds) {
            let patientInfo = document.querySelector(patientInfoIds[index]);
            let patientKey = patientInfoIds[index].substring(1); // Remove the # from the ID
            let patientInfoValue = patientData[patientKey];
            let paragraph = document.createElement('p');
            if (patientKey === 'birthday') {
                patientInfoValue = patientInfoValue.split('T')[0]; // Remove Timestamp from database results
            }
            paragraph.textContent = patientInfoValue;
            // paragraph.addEventListener('click', () => makeEditable(paragraph));
            patientInfo.appendChild(paragraph);
        }
    })

})