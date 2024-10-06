const burger = document.querySelector(".burger");
const menuContainer = document.querySelector(".menu-container");

burger.addEventListener("click", () => {
    menuContainer.classList.toggle("active");
    burger.classList.toggle("toggle");
});
