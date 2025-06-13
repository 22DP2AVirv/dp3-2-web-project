// admin-login.js
document.addEventListener('DOMContentLoaded', () => {
    const correctLogin = "aleksisvirvinskis204@gmail.com"; // Pareizais login (epasts)
    const correctPassword = "Parole290306"; // Pareizā parole
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Novērš lapas pārlādēšanu

        const enteredLogin = loginInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredLogin === correctLogin && enteredPassword === correctPassword) {
            // Ja login un parole ir pareizi, saglabājam statusu localStorage un novirzam uz admin paneli
            localStorage.setItem('isLoggedIn', 'true'); // Saglabājam pieteikšanās statusu
            window.location.href = 'admin-panel.html'; // Atceries mainīt uz savu admin paneli
        } else {
            // Ja login vai parole ir nepareizi, parāda kļūdas ziņojumu
            errorMessage.style.display = 'block';
        }
    });
});
