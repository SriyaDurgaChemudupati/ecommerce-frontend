console.log("JS is running");

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

    const totalItems = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
    );

    const cartCount = document.querySelector(".cart-count");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

updateCartCount();

// --------------------
// PRODUCTS
// --------------------

const productGrid = document.getElementById("product-grid");
const loading = document.getElementById("loading");

if (productGrid) {

    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(products => {

            console.log(products);

            if (loading) {
                loading.remove();
            }

            products.forEach(product => {

                const card = document.createElement("div");

                card.classList.add("product-card");

                card.style.cursor = "pointer";

                card.innerHTML = `
                    <img
                        src="${product.image}"
                        alt="${product.title}"
                        loading="lazy"
                    >

                    <h3>${product.title}</h3>

                    <p>
                        ₹${Math.round(product.price * 83)}
                    </p>

                    <small>
                        ${product.description.substring(0, 80)}...
                    </small>

                    <br><br>

                    <button>
                        View Product
                    </button>
                `;

                card.addEventListener("click", () => {
                    window.location.href =
                        `product.html?id=${product.id}`;
                });

                productGrid.appendChild(card);

            });

        })
        .catch(error => {

            console.error(
                "Error loading products:",
                error
            );

            productGrid.innerHTML = `
                <p>
                    Failed to load products.
                    Please try again later.
                </p>
            `;
        });

}