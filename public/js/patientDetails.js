document.addEventListener('DOMContentLoaded', () => {
    fetch('/patientDetails')
    .then(response => {
        if (!response.ok) {
            throw new Error(`error retrieving userdetails${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    });
})