document.addEventListener('DOMContentLoaded', () => {
    const patientInfoIds = [`#firstname`, `#middlename`, `#lastname`, `#gender`, 
    `#birthday`, `#occupation`, `#religion`, `#phonenumber`, `#email`, '#addressOne', 
    '#addressTwo', '#lga', '#state', '#stateOfOrigin', '#nationality', '#doctorsNote']

    const editButton = document.createElement('button');
    editButton.textContent = 'Update';
    editButton.id = 'editButton';

    const patientProfile = document.getElementById('patient-profile');
    patientProfile.insertBefore(editButton, patientProfile.lastChild);

    let isEditing = false;

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
            let patientInfoValue = patientData[patientKey]; // access individual values from the database
            let paragraph = document.createElement('p');
            paragraph.className = 'infoField'
            if (patientKey === 'birthday') {
                patientInfoValue = patientInfoValue.split('T')[0]; // Remove Timestamp from database results
            }
            paragraph.textContent = patientInfoValue;
            paragraph.addEventListener('click', () => makeEditable(paragraph),);
            patientInfo.appendChild(paragraph);
        }
    })

    function makeEditable(element) {
        if (isEditing) {
            element.contentEditable = true;
            element.focus();
        }
    }

    editButton.addEventListener('click', () => {
        isEditing = !isEditing;
        editButton.textContent = isEditing ? 'Save' : 'Update';
        let updatedFields = []
        document.querySelectorAll('#patient-profile .infoField').forEach(p => {
            p.style.backgroundColor = isEditing ? 'white' : '';
            p.contentEditable = isEditing;
            if (!isEditing) {
                updatedFields.push(p.textContent);
            };
        });

        if (!isEditing) {
            fetch ('/updateDetails', {
                method: 'POST',
                body: updatedFields,
            })
            .then(response => {
                console.log(updatedFields);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });
})