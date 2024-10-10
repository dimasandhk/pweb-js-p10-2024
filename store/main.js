const cartCounter = document.querySelector(".cartCounter");
const cardContainer = document.querySelector(".prods");

const all = document.querySelector(".all"); // 'https://dummyjson.com/products'
const beauty = document.querySelector(".bty"); // /beauty
const furniture = document.querySelector(".furn"); // /furniture
const grocery = document.querySelector(".groc"); // /groceries
const laptop = document.querySelector(".lapt"); // /laptops
const fragrance = document.querySelector(".frag"); // /fragrances
const smartphones = document.querySelector(".smart"); // /smartphones
const dropdown = document.querySelector(".dd"); // Dropdown for limit

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");

const categoryButtons = [
    all,
    beauty,
    furniture,
    grocery,
    laptop,
    fragrance,
    smartphones,
];

let currentPage = 1;
let totalPages = 1;
let currentCategory = "all";

// Function to fetch products and display them
async function fetchProducts(category, limit = 30, page = 1) {
    try {
        const skip = (page - 1) * limit;
        const url =
            category === "all"
                ? `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
                : `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        cardContainer.innerHTML = "";
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

        currentPage = page;
        totalPages = Math.ceil(data.total / limit);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please try again later.");
    }
}

// Function to show toast message
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

// Function to add product to cart
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

// Function to update cart counter
function updateCartCounter(count) {
    cartCounter.textContent = `Keranjang Kuning (${count})`;
}

// Function to render cart items
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

// Function to set active category button
function setActiveCategoryButton(activeButton) {
    categoryButtons.forEach((button) => button.classList.remove("active"));
    activeButton.classList.add("active");
}

// Function to handle category selection
function handleCategorySelection(category, button) {
    setActiveCategoryButton(button);
    currentCategory = category;
    currentPage = 1;
    if (category === "all") {
        dropdown.style.display = "inline-block";
        fetchProducts(category, dropdown.value, currentPage);
    } else {
        dropdown.style.display = "none";
        fetchProducts(category, dropdown.value, currentPage);
    }
}

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
updateCartCounter(totalItems);
renderCartItems();

// Fetch products for the default category (all) on page load
fetchProducts("all", dropdown.value, currentPage);
setActiveCategoryButton(all);

// Add event listeners to category buttons
all.addEventListener("click", () => handleCategorySelection("all", all));
beauty.addEventListener("click", () =>
    handleCategorySelection("beauty", beauty)
);
furniture.addEventListener("click", () =>
    handleCategorySelection("furniture", furniture)
);
grocery.addEventListener("click", () =>
    handleCategorySelection("groceries", grocery)
);
laptop.addEventListener("click", () =>
    handleCategorySelection("laptops", laptop)
);
fragrance.addEventListener("click", () =>
    handleCategorySelection("fragrances", fragrance)
);
smartphones.addEventListener("click", () =>
    handleCategorySelection("smartphones", smartphones)
);

// Add event listener to dropdown
dropdown.addEventListener("change", () => {
    if (all.classList.contains("active")) {
        fetchProducts("all", dropdown.value, currentPage);
    }
});

// Add event listeners to pagination buttons
prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        fetchProducts(currentCategory, dropdown.value, currentPage - 1);
    }
});

nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        fetchProducts(currentCategory, dropdown.value, currentPage + 1);
    }
});

// Back to Top Button
const backToTopBtn = document.getElementById("backToTopBtn");

// Show or hide the button based on scroll position
window.onscroll = function () {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

// Scroll to the top of the document when the button is clicked
backToTopBtn.addEventListener("click", function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});
