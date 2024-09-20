document.addEventListener('DOMContentLoaded', () => {
    const patientTable = document.getElementById('patientlist');
    fetch('/patientlist')
    .then(response => {
        if (!response.ok) {
            throw new Error(`error retrieving database ${response.status}`)
        }
        return response.json();
    })
    .then(patientlist => {
        for (let index = 0; index < patientlist.length; index++) {
            patientDetails = Object.entries(patientlist[index])
            patientDetails.push(patientDetails.shift());
            const tr = document.createElement("tr");
            for (const [key, value] of patientDetails) {
                const td = document.createElement("td");
                if (key === 'id') {
                    const button = document.createElement('button');
                    button.className = "patientButton";
                    button.textContent = "Patient Details";
                    button.addEventListener('click', async function() {
                        const response = await fetch('/patientDetails', {
                            method: 'POST',
                            body: `${value}`,
                        })
                        const data = await response.json();
                        window.location.href = data.redirect;
                    });
                    td.appendChild(button);
                } else {
                    if (key === 'dob' && value != null) {
                        let endIndex = value.indexOf("T");
                        const newValue = value.slice(0, endIndex);
                        td.textContent = newValue;
                    } else {
                        td.textContent = value;
                    }
                }
                tr.appendChild(td);
            }
            patientTable.appendChild(tr);
        }
    })
    .catch(error => {
        console.error('error', error)
    })
});