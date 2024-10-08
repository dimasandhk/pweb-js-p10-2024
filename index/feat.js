const cardContainer = document.querySelector(".f-prods");
const cartCounter = document.querySelector(".cartCounter");

async function fetchProducts() {
    try {
        const response = await fetch("https://dummyjson.com/products?limit=15");

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
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
                        Beli
                    </button>
                </div>
            </div>`;
            cardContainer.innerHTML += cardTemplate;
        });

        document.querySelectorAll(".buy-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                const productId = event.target.getAttribute("data-product-id");
                addToCart(productId);
            });
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please try again later.");
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hidden");
    }, 3000);
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(
        (item) => item.id === productId
    );

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
        showToast("Quantity updated for the item in the cart!");
    } else {
        cart.push({ id: productId, quantity: 1 });
        showToast("Item added to the cart!");
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCounter(cart.reduce((acc, item) => acc + item.quantity, 0));
}

function updateCartCounter(count) {
    cartCounter.textContent = `Keranjang Kuning (${count})`;
}

async function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".items");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Keranjang kosong</p>";
        return;
    }

    try {
        const response = await fetch("https://dummyjson.com/products?limit=15");

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        cart.forEach((cartItem) => {
            const product = data.products.find((p) => p.id === cartItem.id);
            if (product) {
                const cartTemplate = `<div class="prod-item">
                    <img src="${product.thumbnail}" alt="${
                    product.title
                }" class="product-image" />
                    <div class="product-details">
                        <h3>${product.title}</h3>
                        <p>Price: $${product.price.toFixed(2)}</p>
                        <p>Quantity: ${cartItem.quantity}</p>
                    </div>
                </div>`;
                cartContainer.innerHTML += cartTemplate;
            }
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to load cart items. Please try again later.");
    }
}

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
updateCartCounter(totalItems);
renderCartItems();

fetchProducts();
