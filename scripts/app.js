console.log("JS is running");

// Global array to store fetched API products for live filtering
let allProducts = [];

// --------------------
// HAMBURGER MENU
// --------------------
const hamburger = document.querySelector(".hamburger");
const navbar = document.querySelector(".navbar");

if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
}

// --------------------
// CART COUNT
// --------------------
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.querySelector(".cart-count");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}
updateCartCount();

// --------------------
// PRODUCTS & SEARCH
// --------------------
const productGrid = document.getElementById("product-grid");
const loading = document.getElementById("loading");
const searchInput = document.querySelector(".search-bar");

// Separate display function to dynamically redraw the catalog layout
function displayProducts(productsToRender) {
    if (!productGrid) return;
    
    // Wipe current grid content clean
    productGrid.innerHTML = "";

    // Show empty feedback if search yields zero results
    if (productsToRender.length === 0) {
        productGrid.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: #777; font-size: 1.2rem; margin-top: 20px;">
                No products match your search 🔍
            </p>
        `;
        return;
    }

    // Build product cards
    productsToRender.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <h3>${product.title}</h3>
            <p>₹${Math.round(product.price * 83)}</p>
            <small>${product.description.substring(0, 80)}...</small>
            <br><br>
            <button>View Product</button>
        `;

        card.addEventListener("click", () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        productGrid.appendChild(card);
    });
}

// Fetch Initial Products Data
if (productGrid) {
    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(products => {
            console.log(products);

            if (loading) {
                loading.remove();
            }

            // Save elements into the global array cache
            allProducts = products;
            
            // Render all items initially
            displayProducts(allProducts);
        })
        .catch(error => {
            console.error("Error loading products:", error);
            productGrid.innerHTML = `
                <p>Failed to load products. Please try again later.</p>
            `;
        });
}

// --------------------
// LIVE SEARCH FILTER
// --------------------
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const searchQuery = e.target.value.toLowerCase().trim();

        // Filter by checking if product title matches search query text
        const filteredProducts = allProducts.filter(product => {
            return product.title.toLowerCase().includes(searchQuery);
        });

        // Update view instantly with matched results
        displayProducts(filteredProducts);
    });
}