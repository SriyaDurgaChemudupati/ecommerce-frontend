document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    const totalDisplay = document.querySelector('.cart-total h2');
    const checkoutBtn = document.getElementById('checkout-btn');

    // 1. Core Logic to Render Items
    function loadAndRenderCart() {
        const cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];
        
        // Remove old rows
        document.querySelectorAll('.cart-item').forEach(item => item.remove());

        if (cart.length === 0) {
            if (totalDisplay) totalDisplay.textContent = 'Total: ₹0';
            updateHeaderBadge(0);
            return;
        }

        let cartTotalSum = 0;

        cart.forEach((item, index) => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQty = parseInt(item.quantity) || 0;
            cartTotalSum += (itemPrice * itemQty);

            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.title}" style="width:80px; height:80px; object-fit:contain;">
                <div style="flex:1; margin-left:15px;">
                    <h3>${item.title}</h3>
                    <p style="color:#ff6600; font-weight:bold;">₹${itemPrice.toLocaleString('en-IN')}</p>
                    <p style="font-size:0.8rem;">Size: ${item.size} | Color: ${item.color}</p>
                    <div style="margin-top:10px;">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span style="margin: 0 10px; font-weight:bold;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                        <button onclick="removeItem(${index})" style="margin-left:20px; color:red; cursor:pointer; border:none; background:none;">Remove</button>
                    </div>
                </div>
            `;
            // Insert before the total display
            cartContainer.insertBefore(row, document.querySelector('.cart-total'));
        });

        if (totalDisplay) {
            totalDisplay.textContent = `Total: ₹${cartTotalSum.toLocaleString('en-IN')}`;
        }
        
        updateHeaderBadge(cart.reduce((sum, item) => sum + item.quantity, 0));
    }

    // 2. Checkout Logic (Captures Delivery Form)
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];
            
            // Capture Delivery Details from form
            const deliveryData = {
                name: document.getElementById('ship-name').value,
                phone: document.getElementById('ship-phone').value,
                address: document.getElementById('ship-address').value,
                city: document.getElementById('ship-city').value,
                pincode: document.getElementById('ship-pincode').value
            };

            // Validation
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            if (!deliveryData.name || !deliveryData.address || !deliveryData.phone) {
                alert("Please fill in all shipping details.");
                return;
            }

            // Process
            alert(`Thank you, ${deliveryData.name}! Your order is being processed for delivery to ${deliveryData.address}.`);
            
            // Clear everything
            localStorage.removeItem('shopEasyCart');
            window.location.href = 'index.html';
        });
    }

    // 3. Helper: Badge Sync
    function updateHeaderBadge(totalCount) {
        const cartCountBadge = document.querySelector('.cart-count');
        if (cartCountBadge) cartCountBadge.textContent = totalCount;
    }

    // 4. Global Window Actions (for onclick handlers)
    window.updateQty = (index, change) => {
        let cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        localStorage.setItem('shopEasyCart', JSON.stringify(cart));
        loadAndRenderCart();
    };

    window.removeItem = (index) => {
        let cart = JSON.parse(localStorage.getItem('shopEasyCart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('shopEasyCart', JSON.stringify(cart));
        loadAndRenderCart();
    };

    loadAndRenderCart();
});