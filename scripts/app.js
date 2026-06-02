console.log("JS is running");
fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(products => {
        console.log(products);
    });
const hamburger = document.querySelector(".hamburger");
const navbar = document.querySelector(".navbar");

hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
});
const productGrid = document.getElementById("product-grid");

fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(products => {

        products.forEach(product => {

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button>Add to Cart</button>
            `;

            productGrid.appendChild(card);

        });

    })
    .catch(error => {
        console.error("Error loading products:", error);
    });