const cardContainer = document.querySelector(".f-prods");
const cartCounter = document.querySelector(".cartCounter");

fetch("https://dummyjson.com/products?limit=15")
    .then((res) => res.json())
    .then((data) => {
        data.products.forEach((product) => {
            const cardTemplate = `<div class="card">
                <div class="product-image">
                    <img src="${product.thumbnail}" alt="${product.title}" />
                    <span class="tag"><strong>${product.category.toUpperCase()}</strong></span>
                </div>
                <div class="product-info">
                    <h2>${product.title}</h2>
                    <p class="price">
                        <strong>Price: $${product.price.toFixed(2)}</strong>
                    </p>
                    <p class="rating">Rating: ${product.rating}/5 ⭐</p>
                    <button class="buy-btn" data-product-id="${product.id}">
                        <strong>Beli</strong>
                    </button>
                </div>
            </div>`;
            cardContainer.innerHTML += cardTemplate;
        });

        document.querySelectorAll(".buy-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                const productId = event.target.getAttribute("data-product-id");
                const selectedProduct = data.products.find(
                    (product) => product.id == productId
                );
                addToCart(selectedProduct);
            });
        });
    })
    .catch((error) => console.error("Error fetching products:", error));

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter(cart.length);
}

function updateCartCounter(count) {
    cartCounter.textContent = `Keranjang Kuning (${count})`;
}

document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCounter(cart.length);
});
