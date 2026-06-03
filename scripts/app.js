document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Global DOM Selectors
    const productGrid = document.getElementById('product-grid');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Modal Element Hooks
    const productModal = document.getElementById('product-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalDynamicBody = document.getElementById('modal-dynamic-body');

    // Global cache for products
    let globalProductsCache = [];

    // Initialize Navbar Cart Counter Badge right away on load
    updateCartNavbarBadge();

    // 2. Mobile Menu Toggle Logic
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. Modal Box Visibility Management
    if (modalCloseBtn && productModal) {
        modalCloseBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeModal();
            }
        });
    }

    function openModal() {
        if (productModal) productModal.classList.add('open-modal');
    }

    function closeModal() {
        if (productModal) productModal.classList.remove('open-modal');
    }

    // 4. FakeStore Live Data Pipeline
    async function fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            globalProductsCache = data.slice(0, 8); // Keep the first 8 items
            renderProductGrid(globalProductsCache);
        } catch (error) {
            console.error("API Error encountered. Loading fallback data routes:", error);
            globalProductsCache = getFallbackProducts();
            renderProductGrid(globalProductsCache);
        }
    }

    // 5. Build Grid UI View Cards
    function renderProductGrid(items) {
        if (!productGrid) return;
        productGrid.innerHTML = '';

        if (items.length === 0) {
            productGrid.innerHTML = '<p>No featured products available at this moment.</p>';
            return;
        }

        let cardsHTML = '';
        for (let i = 0; i < items.length; i++) {
            const product = items[i];
            const cleanTitle = product.title.length > 35 ? product.title.substring(0, 35) + '...' : product.title;
            const priceInINR = Math.round(product.price * 83);

            cardsHTML += `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image-wrapper">
                        <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async">
                    </div>
                    <h3>${cleanTitle}</h3>
                    <p class="product-price">₹${priceInINR.toLocaleString('en-IN')}</p>
                    
                    <div class="card-action-row" style="display:flex; gap:10px; margin-top:10px; width: 100%;">
                        <button class="view-product-btn" data-id="${product.id}" style="width:50%;">View</button>
                        <button class="add-to-cart-btn" data-id="${product.id}" style="width:50%;">Add</button>
                    </div>
                </div>
            `;
        }

        productGrid.innerHTML = cardsHTML;
        setupInteractionEventListeners();
    }

    // 6. Direct Event Interceptor Mappings
    function setupInteractionEventListeners() {
        // Quick Add to Cart from Grid View
        const addButtons = document.querySelectorAll('.add-to-cart-btn');
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id')) || e.target.getAttribute('data-id');
                const targetProduct = globalProductsCache.find(p => p.id === productId);
                if (targetProduct) {
                    saveItemToLocalStorage(targetProduct, "Medium", "Black");
                }
            });
        });

        // Open Detailed View Window Modal
        const viewButtons = document.querySelectorAll('.view-product-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id')) || e.target.getAttribute('data-id');
                triggerDetailedModal(productId);
            });
        });
    }

    // 7. Dynamic Modal Content Engine Setup
    function triggerDetailedModal(productId) {
        const targetProduct = globalProductsCache.find(p => p.id === productId);
        if (!targetProduct || !modalDynamicBody) return;

        const priceInINR = Math.round(targetProduct.price * 83);

        modalDynamicBody.innerHTML = `
            <div class="modal-detailed-view">
                <img src="${targetProduct.image}" alt="${targetProduct.title}">
                
                <div class="modal-info-pane">
                    <h2>${targetProduct.title}</h2>
                    <p class="modal-price">₹${priceInINR.toLocaleString('en-IN')}</p>
                    <p class="modal-desc">${targetProduct.description}</p>
                    
                    <div class="modal-actions">
                        <div class="variant-selector">
                            <label>Size:</label>
                            <select id="modal-size-select">
                                <option value="Small">Small</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="Large">Large</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>
                        
                        <div class="variant-selector" style="margin-bottom: 15px;">
                            <label>Color:</label>
                            <select id="modal-color-select">
                                <option value="Black" selected>Black</option>
                                <option value="Blue">Blue</option>
                                <option value="Grey">Grey</option>
                            </select>
                        </div>
                        
                        <button id="modal-submit-cart" style="background:#ff6600; color:white; border:none; padding:12px; font-weight:bold; width:100%; border-radius:5px; cursor:pointer;">
                            Add Variant to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to cart inside modal handler
        document.getElementById('modal-submit-cart').addEventListener('click', () => {
            const size = document.getElementById('modal-size-select').value;
            const color = document.getElementById('modal-color-select').value;
            saveItemToLocalStorage(targetProduct, size, color);
            closeModal();
        });

        openModal();
    }

    // 8. LocalStorage Cart Core Save Mechanism
    function saveItemToLocalStorage(product, size, color) {
        // Read existing cart array from local storage, or default to an empty list []
        let cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];

        // Check if this exact product item with the same variant configurations already exists
        const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && item.size === size && item.color === color
        );

        if (existingItemIndex > -1) {
            // Increment its item count matching state metrics
            cart[existingItemIndex].quantity += 1;
        } else {
            // Push item data profile parameters dynamically 
            cart.push({
                id: product.id,
                title: product.title,
                price: Math.round(product.price * 83),
                image: product.image,
                size: size,
                color: color,
                quantity: 1
            });
        }

        // Commit modifications right back down to local machine registry
        localStorage.setItem('shopEasyCart', JSON.stringify(cart));
        
        // Update browser badges and fire short confirmation popup
        updateCartNavbarBadge();
        alert(`Added to your cart!\n${product.title}\nSize: ${size}\nColor: ${color}`);
    }

    function updateCartNavbarBadge() {
        const cartCountBadge = document.querySelector('.cart-count');
        if (cartCountBadge) {
            let cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];
            // Sum up total units across all items
            let totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountBadge.textContent = totalItemsCount;
        }
    }

    // Safe Offline Core Fallbacks
    function getFallbackProducts() {
        return [
            {
                id: 1,
                title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                price: 109.95,
                description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
            },
            {
                id: 2,
                title: "Mens Casual Premium Slim Fit T-Shirts",
                price: 22.30,
                description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
                image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
            }
        ];
    }

    fetchProducts();
});