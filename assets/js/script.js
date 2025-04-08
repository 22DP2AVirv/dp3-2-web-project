const toggleButton = document.getElementById('dark-mode-btn');

// Funkcija, lai iestatītu režīmu
function setDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = 'Gaišais režīms';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        toggleButton.textContent = 'Tumsas režīms';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Ielādējot lapu, pārbauda localStorage
document.addEventListener("DOMContentLoaded", function () {
    const darkModeStatus = localStorage.getItem('darkMode');
    setDarkMode(darkModeStatus === 'enabled');
    
    // Carousel (ja nepieciešams)
    const carousel = document.querySelector("#main-slider");
    if (carousel) {
        new bootstrap.Carousel(carousel, {
            interval: 3000,
            ride: "carousel"
        });
    }

    // Formas pāradresācija (ja ir forma)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            window.location.href = "index.html";
        });
    }
});

// Kad klikšķina uz pogas
toggleButton.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setDarkMode(isDark);
});


document.addEventListener("DOMContentLoaded", function () {
    let myCarousel = new bootstrap.Carousel(document.querySelector("#main-slider"), {
        interval: 3000,
        ride: "carousel"
    });
});

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();  // Novērst veidlapas noklusējuma iesniegšanu
    window.location.href = "index.html";  // Pāradresēt uz index.html
});

function showWorkTime() {
    document.getElementById("workTimeModal").style.display = "block";
}

function closeWorkTime() {
    document.getElementById("workTimeModal").style.display = "none";
}
