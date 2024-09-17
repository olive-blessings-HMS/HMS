document.addEventListener('DOMContentLoaded', () => {
    
    fetch('/patientlist')
    .then(response => {
        if (!response.ok) {
            throw new Error(`error retrieving database ${response.status}`)
        }
        return response.json();
    })
    .then(patientlist => {
        console.log(patientlist);
        // for (let index = 0; index < patientlist.length; index++) {
        //     for (const [key, value] of Object.entries(patientlist[index])) {
        //         console.log(`${key} , ${value}`)
        //     }
        // }
    })
    .catch(error => {
        console.error('error', error)
    })
});