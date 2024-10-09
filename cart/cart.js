const totalCounter = document.querySelector(".total p");
const cartContainer = document.querySelector(".items");
const cartCounter = document.querySelector(".cartCounter");
const btnCheckout = document.querySelector(".btn-cekot");

let productData = {};

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = `Keranjang Kuning (${totalItems})`;
}

function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = cart.reduce((sum, item) => {
        const product = productData[item.id];
        if (product) {
            return sum + product.price * item.quantity;
        }
        return sum;
    }, 0);
    totalCounter.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    cart.forEach((cartItem) => {
        const product = productData[cartItem.id];
        if (product) {
            const cartTemplate = `<div class="prod-item">
                <img src="${product.thumbnail}" alt="${
                product.title
            }" class="product-image" />
                <div class="product-details">
                    <h3>${product.title}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <div class="quantity-container">
                        <p class="stock">Stock: ${product.stock}</p>
                        <div class="quantity-delete">
                            <p>Quantity:</p>
                            <button class="decrease-btn" data-product-id="${
                                product.id
                            }">-</button>
                            <span class="quantity-text">${
                                cartItem.quantity
                            }</span>
                            <button class="increase-btn" data-product-id="${
                                product.id
                            }">+</button>
                            <button class="delete-btn" data-product-id="${
                                product.id
                            }">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`;
            cartContainer.innerHTML += cartTemplate;
        }
    });

    document.querySelectorAll(".decrease-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-product-id");
            updateProductQuantity(productId, -1);
        });
    });

    document.querySelectorAll(".increase-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-product-id");
            updateProductQuantity(productId, 1);
        });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-product-id");
            removeFromCart(productId);
        });
    });
}

function updateProductQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = cart.find((item) => item.id == productId);

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter((item) => item.id != productId);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCounter();
        updateTotalPrice();
        renderCartItems();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((product) => product.id != productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    updateTotalPrice();
    renderCartItems();
}

async function fetchProductData() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIds = cart.map((item) => item.id);

    for (const id of productIds) {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const product = await response.json();
        productData[id] = product;
    }

    updateCartCounter();
    updateTotalPrice();
    renderCartItems();
}

function clearCart() {
    localStorage.removeItem("cart");
    updateCartCounter();
    updateTotalPrice();
    renderCartItems();
}

btnCheckout.addEventListener("click", () => {
    clearCart();
});

fetchProductData();
