document.addEventListener('DOMContentLoaded', () => {
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;


    const registrationData = { name, surname, email, phone, password };

    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    registeredUsers.push(registrationData);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert("Jūs veksmīgi piereģistrējāties!");
    console.log(registrationData);
    // Отправка данных на сервер
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
        });
       
        if (response.ok) {
            console.log('Dati tika nosūtīti uz serveri.');
        } else {
            console.error('Notikusi kļūda pārsūtot datus');
        }
    } catch (error) {
        console.error('Tīkla kļūda:', error);
    }
});
});
