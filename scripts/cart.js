document.addEventListener('DOMContentLoaded', () => {

    const cartContainer = document.querySelector('.cart-container');
    const totalDisplay = document.querySelector('.cart-total h2');
    const checkoutBtn = document.getElementById('checkout-btn');

    function loadAndRenderCart() {

        const cart =
            JSON.parse(localStorage.getItem('shopEasyCart')) || [];

        document.querySelectorAll('.cart-item').forEach(item => {
            item.remove();
        });

        if (cart.length === 0) {

            if (totalDisplay) {
                totalDisplay.textContent = 'Total: ₹0';
            }

            updateHeaderBadge(0);
            return;
        }

        let cartTotalSum = 0;

        cart.forEach((item, index) => {

            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.qty) || 1;

            cartTotalSum += itemPrice * itemQty;

            const row = document.createElement('div');

            row.className = 'cart-item';

            row.innerHTML = `
                <img
                    src="${item.image}"
                    alt="${item.title}"
                    style="width:80px;height:80px;object-fit:contain;"
                >

                <div style="flex:1;margin-left:15px;">

                    <h3>${item.title}</h3>

                    <p style="color:#ff6600;font-weight:bold;">
                        ₹${itemPrice.toLocaleString('en-IN')}
                    </p>

                    <p style="font-size:0.85rem;">
                        Size: ${item.size}
                        |
                        Color: ${item.color}
                    </p>

                    <p>
                        Subtotal:
                        ₹${(itemPrice * itemQty).toLocaleString('en-IN')}
                    </p>

                    <div style="margin-top:10px;">

                        <button
                            class="qty-btn"
                            onclick="updateQty(${index}, -1)">
                            -
                        </button>

                        <span style="margin:0 10px;font-weight:bold;">
                            ${itemQty}
                        </span>

                        <button
                            class="qty-btn"
                            onclick="updateQty(${index}, 1)">
                            +
                        </button>

                        <button
                            onclick="removeItem(${index})"
                            style="
                                margin-left:20px;
                                color:red;
                                cursor:pointer;
                                border:none;
                                background:none;
                            ">
                            Remove
                        </button>

                    </div>

                </div>
            `;

            cartContainer.insertBefore(
                row,
                document.querySelector('.cart-total')
            );
        });

        if (totalDisplay) {

            totalDisplay.textContent =
                `Total: ₹${cartTotalSum.toLocaleString('en-IN')}`;
        }

        updateHeaderBadge(
            cart.reduce((sum, item) =>
                sum + (Number(item.qty) || 0), 0)
        );
    }

    if (checkoutBtn) {

        checkoutBtn.addEventListener('click', () => {

            const cart =
                JSON.parse(localStorage.getItem('shopEasyCart')) || [];

            const deliveryData = {
                name: document.getElementById('ship-name').value,
                phone: document.getElementById('ship-phone').value,
                address: document.getElementById('ship-address').value,
                city: document.getElementById('ship-city').value,
                pincode: document.getElementById('ship-pincode').value
            };

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            if (
                !deliveryData.name ||
                !deliveryData.phone ||
                !deliveryData.address
            ) {
                alert("Please fill in all shipping details.");
                return;
            }

            alert(
                `Thank you ${deliveryData.name}! Your order has been placed.`
            );

            localStorage.removeItem('shopEasyCart');

            window.location.href = 'index.html';
        });
    }

    function updateHeaderBadge(totalCount) {

        const badge =
            document.querySelector('.cart-count');

        if (badge) {
            badge.textContent = totalCount;
        }
    }

    window.updateQty = function(index, change) {

        let cart =
            JSON.parse(localStorage.getItem('shopEasyCart')) || [];

        cart[index].qty =
            (Number(cart[index].qty) || 1) + change;

        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem(
            'shopEasyCart',
            JSON.stringify(cart)
        );

        loadAndRenderCart();
    };

    window.removeItem = function(index) {

        let cart =
            JSON.parse(localStorage.getItem('shopEasyCart')) || [];

        cart.splice(index, 1);

        localStorage.setItem(
            'shopEasyCart',
            JSON.stringify(cart)
        );

        loadAndRenderCart();
    };

    loadAndRenderCart();
});