document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");
    const productModal = document.getElementById("product-modal");
    const modalDynamicBody = document.getElementById("modal-dynamic-body");
    const cartCount = document.querySelector(".cart-count");

    let products = [];
    let activeProduct = null;
    let lastFocusedElement = null;

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function updateBadge() {
        const cart = JSON.parse(localStorage.getItem("shopEasyCart")) || [];
        const total = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
        if (cartCount) cartCount.textContent = total;
    }

    function saveToCart(product, qty, size, color) {
        const cart = JSON.parse(localStorage.getItem("shopEasyCart")) || [];
        cart.push({
            id: product.id,
            title: product.title,
            image: product.image,
            price: Math.round(product.price * 83),
            qty: Number(qty),
            size,
            color
        });
        localStorage.setItem("shopEasyCart", JSON.stringify(cart));
        updateBadge();
        alert("🛒 Added To Cart!");
    }

    function saveToWishlist(product) {
        const wishlist = JSON.parse(localStorage.getItem("shopEasyWishlist")) || [];
        wishlist.push(product);
        localStorage.setItem("shopEasyWishlist", JSON.stringify(wishlist));
        alert("❤️ Added To Wishlist!");
    }

    function closeModal() {
        if (!productModal) return;
        productModal.classList.remove("open-modal");
        productModal.setAttribute("aria-hidden", "true");
        modalDynamicBody.innerHTML = "";
        document.documentElement.style.overflow = "";
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    function openModal(product) {
        activeProduct = product;
        lastFocusedElement = document.activeElement;

        modalDynamicBody.innerHTML = `
            <div class="modal-layout" role="document">
                <div class="modal-main">
                    <div class="modal-image-container">
                        <img
                            src="${product.image}"
                            class="modal-product-image"
                            alt="${escapeHtml(product.title)}"
                        >
                    </div>

                    <h2>${escapeHtml(product.title)}</h2>
                    <p class="price">₹${Math.round(product.price * 83)}</p>
                    <p>${escapeHtml(product.description)}</p>

                    <div class="variant-selector">
                        <label for="size-select">Size</label>
                        <select id="size-select">
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                            <option>XL</option>
                        </select>
                    </div>

                    <div class="variant-selector">
                        <label for="color-select">Color</label>
                        <select id="color-select">
                            <option>Black</option>
                            <option>White</option>
                            <option>Blue</option>
                            <option>Red</option>
                        </select>
                    </div>

                    <div class="variant-selector">
                        <label for="qty">Quantity</label>
                        <input type="number" id="qty" value="1" min="1">
                    </div>
                </div>

                <div class="modal-sidebar">
                    <button id="modal-add" class="modal-add-btn">🛒 Add To Cart</button>
                    <button id="modal-wishlist" class="wishlist-side-btn">❤️ Add to Wishlist</button>
                    <button id="modal-close-secondary" class="modal-cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        productModal.classList.add("open-modal");
        productModal.setAttribute("aria-hidden", "false");

        const focusable = productModal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) focusable.focus();

        document.documentElement.style.overflow = "hidden";
    }

    function renderProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${escapeHtml(product.title)}" class="product-thumb">
                <h3>${escapeHtml(product.title.substring(0, 30))}...</h3>
                <p class="product-price">₹${Math.round(product.price * 83)}</p>
                <p class="product-desc">${escapeHtml(product.description.substring(0, 80))}...</p>
                <div class="button-container">
                    <button class="wishlist-btn" data-id="${product.id}">❤️ Wishlist</button>
                    <button class="add-btn" data-id="${product.id}">🛒 Add To Cart</button>
                </div>
            </div>
        `).join("");
    }

    async function fetchProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            if (!response.ok) throw new Error("Failed to fetch products");

            products = (await response.json()).slice(0, 8);
            renderProducts();
        } catch (err) {
            console.error("Failed to load products:", err);
            if (productGrid) productGrid.innerHTML = "<p>Unable to load products.</p>";
        }
    }

    if (productGrid) {
        productGrid.addEventListener("click", (e) => {
            const button = e.target.closest("button");
            if (!button) return;

            e.preventDefault();

            const id = Number(button.dataset.id);
            const product = products.find(p => p.id === id);
            if (!product) return;

            if (button.classList.contains("add-btn")) {
                openModal(product);
                return;
            }

            if (button.classList.contains("wishlist-btn")) {
                saveToWishlist(product);
                return;
            }
        });
    }

    if (productModal) {
        productModal.addEventListener("click", (e) => {
            const target = e.target;

            if (target.id === "modal-add") {
                const qtyEl = document.getElementById("qty");
                const sizeEl = document.getElementById("size-select");
                const colorEl = document.getElementById("color-select");

                const qty = qtyEl ? qtyEl.value : 1;
                const size = sizeEl ? sizeEl.value : "";
                const color = colorEl ? colorEl.value : "";

                if (activeProduct) {
                    saveToCart(activeProduct, qty, size, color);
                }
                closeModal();
                return;
            }

            if (target.id === "modal-wishlist") {
                if (activeProduct) {
                    saveToWishlist(activeProduct);
                }
                return;
            }

            if (target.id === "modal-close-secondary" || target.classList.contains("modal-close-btn")) {
                closeModal();
                return;
            }

            if (target === productModal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && productModal.classList.contains("open-modal")) {
                closeModal();
            }
        });
    }

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => navLinks.classList.toggle("active"));
    }

    updateBadge();
    fetchProducts();
});