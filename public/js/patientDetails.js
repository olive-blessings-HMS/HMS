document.addEventListener('DOMContentLoaded', () => {
    // use query selectAll here later add another class
    const patientInfoIds = [`#first_name`, `#middle_name`, `#last_name`, `#dob`,
    `#gender`,  `#occupation`, `#religion`, `#phone_number`, `#email`, '#street_name', 
    '#street_name_two', '#lga', '#state', '#state_of_origin', '#nationality', '#doctors_note']

    const editButton = document.createElement('button');
    editButton.textContent = 'Update';
    editButton.id = 'editButton';

    const patientProfile = document.getElementById('patient-profile');
    patientProfile.insertBefore(editButton, patientProfile.lastChild);

    let isEditing = false;
    let fields = {}; // keep a record of original data from database

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
            paragraph.className = 'infoField';
            paragraph.id = `${patientKey}`;
            if (patientKey === 'dob') {
                patientInfoValue = patientInfoValue.split('T')[0]; // Remove Timestamp from database results
            }
            paragraph.textContent = patientInfoValue;
            fields[patientKey] = patientInfoValue;
            paragraph.addEventListener('click', () => makeEditable(paragraph),);
            patientInfo.appendChild(paragraph);
        }
    })

    function makeEditable(element) {
        if (isEditing) {
            // change from input box to select to match int datatype in database
            if (element.id === 'gender') {
            const select = document.createElement('select');
            select.id = 'gender';
            select.className = 'infoField';
            const option1 = document.createElement('option');
            option1.value = '1';
            option1.textContent = 'Male';
            select.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = '2';
            option2.textContent = 'Female';
            select.appendChild(option2);
            element.replaceWith(select);
            } else {
                element.contentEditable = true;
                element.focus();
            };
        };
    }

    editButton.addEventListener('click', () => {
        isEditing = !isEditing;
        editButton.textContent = isEditing ? 'Save' : 'Update';
        let newFieldsValues = {};
        document.querySelectorAll('#patient-profile .infoField').forEach(p => {
            p.style.backgroundColor = isEditing ? 'white' : '';
            p.contentEditable = isEditing;
            if (!isEditing) {
                if (p.id === 'gender') {
                    newFieldsValues[p.id] = p.value
                } else {
                    newFieldsValues[p.id] = p.textContent;
                }
            };
        });

        function getchangedValues(oldObject, newObject) {
            let updatedFields = {}
            for (const key in oldObject) {
                if (oldObject[key] === null) {
                    oldObject[key] = '';
                };

                if (oldObject[key] != newObject[key]) {
                    updatedFields[key] = newObject[key];
                };
            };
            return updatedFields;
        }

        let changedFields = getchangedValues(fields, newFieldsValues);

        // check if changes where made
        function isObjectEmpty(obj) {
            return Object.keys(obj).length === 0;
        }

        if (!isEditing && !isObjectEmpty(changedFields)) {
            fetch ('/updateDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changedFields),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        };
    });
})