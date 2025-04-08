console.log("JavaScript подключен и работает!");
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");

    window.addEventListener("scroll", function () {
        console.log("Позиция прокрутки:", window.scrollY); // Проверяем, срабатывает ли скрипт

        if (window.scrollY > 30) {  
            header.classList.add("sticky-active");
            console.log("Добавлен класс sticky-active"); // Проверка в консоли
        } else {
            header.classList.remove("sticky-active");
            console.log("Удалён класс sticky-active"); // Проверка в консоли
        }
    });
});