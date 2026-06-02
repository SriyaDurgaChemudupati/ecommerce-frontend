const cartItemsContainer =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");

const checkoutBtn =
    document.getElementById("checkout-btn");

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {

    cartItemsContainer.innerHTML = "";

    let total = 0;

    let totalCount = 0;

    cart.forEach((item, index) => {

        total += item.price * 83 * item.quantity;

        totalCount += item.quantity;

        const div = document.createElement("div");

        div.classList.add("cart-item");

        div.innerHTML = `
            <img src="${item.image}" width="100">

            <h3>${item.title}</h3>

            <p>
                ₹${(item.price * 83)
                    .toLocaleString("en-IN")}
            </p>

            <p>Size: ${item.size}</p>

            <p>Color: ${item.color}</p>

            <div>
                <button onclick="decreaseQuantity(${index})">
                    -
                </button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>
            </div>

            <button onclick="removeItem(${index})">
                Remove
            </button>

            <hr>
        `;

        cartItemsContainer.appendChild(div);

    });

    cartTotal.textContent =
        `Total: ₹${total.toLocaleString("en-IN")}`;

    document.querySelector(".cart-count")
        .textContent = totalCount;

    checkoutBtn.disabled = cart.length === 0;
}

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();
}

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

        saveCart();
    }
}

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
}

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();
}

checkoutBtn.addEventListener("click", () => {

    alert("Checkout Page Coming Soon!");

});

renderCart();