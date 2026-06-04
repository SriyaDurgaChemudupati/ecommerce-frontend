function updateCounts() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const cartCount = document.querySelector(".cart-count");
    const wishlistCount = document.getElementById("wishlist-count");

    if (cartCount) {
        const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalCartItems;
    }

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

updateCounts();

// 🔥 real-time update across tabs/pages
window.addEventListener("storage", updateCounts);