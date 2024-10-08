document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const quantityText = event.target.nextElementSibling;
        let quantity = parseInt(quantityText.textContent);
        if (quantity > 1) {
            quantity--;
            quantityText.textContent = quantity;
        }
    });
});

document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const quantityText = event.target.previousElementSibling;
        let quantity = parseInt(quantityText.textContent);
        quantity++;
        quantityText.textContent = quantity;
    });
});
