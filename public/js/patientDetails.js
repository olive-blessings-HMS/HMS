document.addEventListener('DOMContentLoaded', () => {
    const patientInfoIds = [`#firstname`, `#middlename`, `#lastname`, `#gender`, 
    `#birthday`, `#occupation`, `#religion`, `#phonenumber`, `#email`, '#address']
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
            let patientKey = patientInfoIds[index].substring(1);
            let patientInfoValue = patientData[patientKey];
            let paragraph = document.createElement('p');
            if (patientKey === 'birthday') {
                patientInfoValue = patientInfoValue.split('T')[0];
            }
            paragraph.textContent = patientInfoValue;
            patientInfo.appendChild(paragraph);
        }

    })
})