console.log("APP JS LOADED");
document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.getElementById('product-grid');
    const productModal = document.getElementById('product-modal');
    const modalDynamicBody = document.getElementById('modal-dynamic-body');
    const cartCount = document.querySelector('.cart-count');

    let globalProductsCache = [];
    let activeProduct = null;
    // =========================
// HAMBURGER MENU
// =========================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}
    // =========================


    // =========================
    // MODAL HELPERS
    // =========================
    const closeModal = () => {
        if (productModal) {
            productModal.classList.remove('open-modal');
        }
    };

    // =========================
    // CART BADGE
    // =========================
    function updateBadge() {
        const cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];

        const total = cart.reduce((sum, item) => {
            return sum + (Number(item.qty) || 0);
        }, 0);

        if (cartCount) {
            cartCount.textContent = total;
        }
    }

    updateBadge();

    // =========================
    // SAVE TO CART
    // =========================
    function saveToCart(product, qty, size, color) {

        let cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];

        const priceValue = Math.round(product.price * 83);

        cart.push({
            id: product.id,
            title: product.title,
            price: priceValue,
            qty: parseInt(qty),
            size,
            color,
            image: product.image
        });

        localStorage.setItem(
            'shopEasyCart',
            JSON.stringify(cart)
        );

        updateBadge();

        alert("Added to cart!");
    }

    // =========================
    // PRODUCT MODAL
    // =========================
    function openModal(product) {

        modalDynamicBody.innerHTML = `
            <div class="modal-product">

                <div class="modal-image-container">
                    <img
                        src="${product.image}"
                        id="zoom-target"
                        class="modal-product-image"
                        alt="${product.title}"
                    >
                </div>

                <h2>${product.title}</h2>

                <p class="price">
                    ₹${Math.round(product.price * 83).toLocaleString('en-IN')}
                </p>

                <p>${product.description}</p>

                <div class="variant-selector">
                    <label>Size</label>
                    <select id="size-select">
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                        <option>XL</option>
                    </select>
                </div>

                <div class="variant-selector">
                    <label>Color</label>
                    <select id="color-select">
                        <option>Black</option>
                        <option>White</option>
                        <option>Blue</option>
                        <option>Red</option>
                    </select>
                </div>

                <div class="variant-selector">
                    <label>Quantity</label>
                    <input
                        type="number"
                        id="qty"
                        min="1"
                        value="1"
                    >
                </div>

                <button
                    id="modal-add"
                    class="modal-add-btn">
                    Add To Cart
                </button>

            </div>
        `;

        productModal.classList.add('open-modal');
    }

    // =========================
    // FETCH PRODUCTS
    // =========================
    async function fetchProducts() {

        if (!productGrid) return;

        try {

            const response =
                await fetch('https://fakestoreapi.com/products');

            const data = await response.json();

            globalProductsCache = data.slice(0, 8);

            renderProducts(globalProductsCache);

        } catch (error) {

            console.error(error);

            productGrid.innerHTML =
                '<p>Failed to load products.</p>';
        }
    }

    // =========================
    // RENDER PRODUCTS
    // =========================
    function renderProducts(products) {

        productGrid.innerHTML = products.map(product => `
            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.title}"
                >

                <h3>
                    ${product.title.substring(0, 30)}...
                </h3>

                <p>
                    ₹${Math.round(product.price * 83).toLocaleString('en-IN')}
                </p>

                <div class="button-container">

                    <button
                        class="view-btn"
                        data-id="${product.id}">
                        View
                    </button>

                    <button
                        class="add-btn"
                        data-id="${product.id}">
                        Add
                    </button>

                </div>

            </div>
        `).join('');
    }

    // =========================
    // PRODUCT CARD BUTTONS
    // =========================
    if (productGrid) {

        productGrid.addEventListener('click', (e) => {

            const button = e.target.closest('button');

            if (!button) return;

            const id = parseInt(button.dataset.id);

            const product =
                globalProductsCache.find(
                    p => p.id === id
                );

            if (!product) return;

            if (button.classList.contains('view-btn')) {

                activeProduct = product;

                openModal(product);
            }

            if (button.classList.contains('add-btn')) {

                saveToCart(
                    product,
                    1,
                    "Medium",
                    "Black"
                );
            }
        });
    }

    // =========================
    // MODAL EVENTS
    // =========================
    if (productModal) {

        productModal.addEventListener('mouseover', (e) => {

            if (e.target.id === 'zoom-target') {

                e.target.style.transform = 'scale(1.8)';
            }
        });

        productModal.addEventListener('mouseout', (e) => {

            if (e.target.id === 'zoom-target') {

                e.target.style.transform = 'scale(1)';
            }
        });

        productModal.addEventListener('click', (e) => {

            if (e.target.id === 'modal-add') {

                const qty =
                    document.getElementById('qty').value;

                const size =
                    document.getElementById('size-select').value;

                const color =
                    document.getElementById('color-select').value;

                saveToCart(
                    activeProduct,
                    qty,
                    size,
                    color
                );

                closeModal();
            }

            if (
                e.target === productModal ||
                e.target.classList.contains('modal-close-btn')
            ) {
                closeModal();
            }
        });
    }

    // =========================
    // CART PAGE
    // =========================
    function renderCart() {

        const cart =
            JSON.parse(
                localStorage.getItem('shopEasyCart')
            ) || [];

        const cartItemsContainer =
            document.getElementById('cart-items');

        const totalElement =
            document.getElementById('cart-total');

        if (!cartItemsContainer || !totalElement) return;

        let total = 0;

        if (cart.length === 0) {

            cartItemsContainer.innerHTML =
                "<p>Your cart is empty.</p>";

            totalElement.textContent = "0";

            return;
        }

        cartItemsContainer.innerHTML =
            cart.map((item, index) => {

                const price =
                    Number(item.price) || 0;

                const qty =
                    Number(item.qty) || 0;

                total += price * qty;

                return `
                    <div class="cart-item">

                        <img
                            src="${item.image}"
                            width="60"
                        >

                        <div>

                            <h3>${item.title}</h3>

                            <p>Size: ${item.size}</p>

                            <p>Color: ${item.color}</p>

                            <p>Price: ₹${price}</p>

                            <p>Qty: ${qty}</p>

                            <p>
                                Subtotal:
                                ₹${price * qty}
                            </p>

                            <button
                                onclick="removeCartItem(${index})">
                                Remove
                            </button>

                        </div>

                    </div>
                `;
            }).join('');

        totalElement.textContent =
            total.toLocaleString('en-IN');
    }

    // =========================
    // REMOVE ITEM
    // =========================
    window.removeCartItem = function(index) {

        let cart =
            JSON.parse(
                localStorage.getItem('shopEasyCart')
            ) || [];

        cart.splice(index, 1);

        localStorage.setItem(
            'shopEasyCart',
            JSON.stringify(cart)
        );

        renderCart();

        updateBadge();
    };

    // =========================
    // START APP
    // =========================
    fetchProducts();

    if (document.getElementById('cart-items')) {
        renderCart();
    }
});
localStorage.setItem(
    "userName",
    document.getElementById("name").value
);