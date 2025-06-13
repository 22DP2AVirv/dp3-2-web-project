document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        alert("Sveiki, " + data.name + "!");
        window.location.href = `user_cab.html?name=${encodeURIComponent(data.name)}&email=${email}`;
    } else {
        const errorText = await response.text();
        alert("Neizdevās pieteikties: " + errorText);
    }

});