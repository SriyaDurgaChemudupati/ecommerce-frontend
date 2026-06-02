const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetails = document.getElementById("product-details");

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

fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => response.json())
    .then(product => {

        productDetails.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.title}"
                class="zoom-image"
            >

            <h2>${product.title}</h2>

            <p id="total-price">
                ₹${(product.price * 83).toLocaleString("en-IN")}
            </p>

            <p>${product.description}</p>

            <br>

            <label>Size:</label>

            <select id="size">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
            </select>

            <br><br>

            <label>Color:</label>

            <div class="color-options">
                <button type="button" class="color-btn" data-color="Black">Black</button>
                <button type="button" class="color-btn" data-color="Blue">Blue</button>
                <button type="button" class="color-btn" data-color="Red">Red</button>
            </div>

            <p id="selected-color">Selected: Black</p>

            <div class="quantity-container">
                <button type="button" id="minus">−</button>
                <span id="quantity">1</span>
                <button type="button" id="plus">+</button>
            </div>

            <br>

            <button type="button" id="add-cart">
                Add to Cart
            </button>
        `;

        let quantity = 1;
        let selectedColor = "Black";

        const quantityText = document.getElementById("quantity");
        const totalPrice = document.getElementById("total-price");

        document.getElementById("plus").addEventListener("click", () => {

            quantity++;

            quantityText.textContent = quantity;

            totalPrice.textContent =
                "₹" + (product.price * 83 * quantity).toLocaleString("en-IN");

        });

        document.getElementById("minus").addEventListener("click", () => {

            if (quantity > 1) {

                quantity--;

                quantityText.textContent = quantity;

                totalPrice.textContent =
                    "₹" + (product.price * 83 * quantity).toLocaleString("en-IN");
            }

        });

        document.querySelectorAll(".color-btn").forEach(btn => {

            btn.addEventListener("click", () => {

                selectedColor = btn.dataset.color;

                document.getElementById("selected-color").textContent =
                    "Selected: " + selectedColor;

                document.querySelectorAll(".color-btn").forEach(button =>
                    button.classList.remove("active-color")
                );

                btn.classList.add("active-color");

            });

        });

        document.getElementById("add-cart").addEventListener("click", () => {

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const selectedSize =
                document.getElementById("size").value;

            const existingProduct = cart.find(item =>
                item.id === product.id &&
                item.size === selectedSize &&
                item.color === selectedColor
            );

            if (existingProduct) {

                existingProduct.quantity += quantity;

            } else {

                cart.push({
                    ...product,
                    quantity: quantity,
                    size: selectedSize,
                    color: selectedColor
                });

            }

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            updateCartCount();

            const msg = document.createElement("div");

            msg.textContent = "✅ Added to Cart!";
            msg.className = "cart-message";

            document.body.appendChild(msg);

            setTimeout(() => {
                msg.remove();
            }, 2000);

        });

    })
    .catch(error => {

        console.error(error);

        productDetails.innerHTML =
            "<p>Failed to load product.</p>";

    });