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
            const tr = document.createElement("tr");
            for (const [key, value] of Object.entries(patientlist[index])) {
                if (key != 'id') {
                    const td = document.createElement("td");
                    if (key === 'dob' && value != null) {
                        let endIndex = value.indexOf("T");
                        const newValue = value.slice(0, endIndex);
                        td.textContent = newValue;
                    } else {
                        td.textContent = value;
                    }
                    tr.appendChild(td);
                }
            }
            patientTable.appendChild(tr);
        }
    })
    .catch(error => {
        console.error('error', error)
    })
});