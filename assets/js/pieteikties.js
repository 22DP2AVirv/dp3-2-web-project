document.getElementById('appointmentForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Novērst noklusējuma formas iesniegšanu

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const procedura = document.getElementById('procedura').value;
    const datums = document.getElementById('velamaisDatums').value;
    const laiks = document.getElementById('velamaisLaiks').value;

    const kurNotiks = document.getElementById('kurNotiks');
    const adreseInput = document.getElementById('adreseInput');
    const adreseField = document.getElementById('adrese');
    const filialeField = document.getElementById('filiale');
    const filialeSelect = document.getElementById('filialeSelect');

    // 👉 Dinamiskā required pārvaldība
    if (procedura === 'gimenesArsts') {
        kurNotiks.required = true;

        if (adreseInput.style.display === 'block') {
            adreseField.required = true;
            filialeField.required = false;
        } else {
            adreseField.required = false;
            filialeField.required = true;
        }

        filialeSelect.required = false; // šis ir paslēpts
    } else {
        kurNotiks.required = false;
        adreseField.required = false;
        filialeField.required = false;

        // 👉 Ja redzams, tad tikai tad pieprasa
        if (filialeSelect.style.display !== 'none') {
            filialeSelect.required = true;
        } else {
            filialeSelect.required = false;
        }
    }

    // 👉 Validācija
    if (!name || !surname || !phone || !email || !procedura || !datums || !laiks) {
        alert('Lūdzu aizpildiet visus obligātos laukus!');
        return;
    }

    if (procedura === 'gimenesArsts') {
        if (!kurNotiks.value) {
            alert('Lūdzu izvēlieties, kur notiks procedūra!');
            return;
        }

        if (kurNotiks.value === 'majas' && !adreseField.value) {
            alert('Lūdzu ievadiet adresi!');
            return;
        }

        if (kurNotiks.value === 'filiale' && !filialeField.value) {
            alert('Lūdzu izvēlieties filiāli!');
            return;
        }
    } else {
        if (!filialeSelect.value) {
            alert('Lūdzu izvēlieties filiāli!');
            return;
        }
    }

    const newAppointment = {
        name,
        surname,
        phone,
        email,
        procedura,
        datums,
        laiks,
        adrese: procedura === 'gimenesArsts' && kurNotiks.value === 'majas'
            ? adreseField.value
            : (procedura === 'gimenesArsts' ? filialeField.value : filialeSelect.value)
    };

    const appointments = JSON.parse(localStorage.getItem('pieraksti')) || [];
    appointments.push(newAppointment);
    localStorage.setItem('pieraksti', JSON.stringify(appointments));

    alert('Pieteikums ir veiksmīgi pievienots!');
    event.target.reset();

    // Atjauno sākuma stāvokli
    document.getElementById('gimenesArstsOptions').style.display = 'none';
    filialeSelect.style.display = 'block';

    // Nosūtīšana uz serveri
    try {
        const response = await fetch('api/pieteikties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAppointment)
        });

        if (response.ok) {
            console.log('Pieteikums nosūtīts uz serveri.');
        } else {
            console.error('Kļūda pārsūtot datus uz serveri.');
        }
    } catch (error) {
        console.error('Tīkla kļūda:', error);
    }
});
