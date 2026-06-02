const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetails = document.getElementById("product-details");

fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => response.json())
    .then(product => {

        productDetails.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>₹${(product.price * 83).toLocaleString("en-IN")}</p>
            <p>${product.description}</p>
            <button type="button" id="add-cart">Add to Cart</button>
        `;

        const addToCartBtn = document.getElementById("add-cart");

        addToCartBtn.addEventListener("click", () => {

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            cart.push(product);

            localStorage.setItem("cart", JSON.stringify(cart));

            alert("Product added to cart!");

        });

    })
    .catch(error => {

        console.error(error);

        productDetails.innerHTML =
            "<p>Failed to load product.</p>";

    });
    addToCartBtn.addEventListener("click", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");

});