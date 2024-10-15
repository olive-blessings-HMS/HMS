document.addEventListener('DOMContentLoaded', () => {
    const patientTable = document.getElementById('patientlist');
    function createButton(value) {
        const button = document.createElement('button');
        button.className = "patientButton";
        button.textContent = "Patient Details";
        button.addEventListener('click', async function() {
            const response = await fetch('/expandData', {
                method: 'POST',
                body: `${value}`, // pass the primarykey to the next page
            })
            const data = await response.json();
            window.location.href = data.redirect;
        });
        return button;
    }
    fetch('/patientlist')
    .then(response => {
        if (!response.ok) {
            throw new Error(`error retrieving database ${response.status}`);
        }
        return response.json();
    })
    .then(patientlist => {
        for (let index = 0; index < patientlist.length; index++) {
            let patientDetails = Object.entries(patientlist[index]);
            patientDetails.push(patientDetails.shift()); // make primarykey the last item
            const tr = document.createElement("tr");
            for (let [key, value] of patientDetails) {
                const td = document.createElement("td");
                if (key === 'id') {
                    td.appendChild(createButton(value));
                } else if (key === 'dob' && value != null) {
                    value = value.split('T')[0];
                    td.textContent = value;
                } else {
                    td.textContent = value;
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
