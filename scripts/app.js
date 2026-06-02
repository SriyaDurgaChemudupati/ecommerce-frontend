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
const loading = document.getElementById("loading");

fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(products => {
        loading.remove();

        products.forEach(product => {

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" loading="lazy">
    <h3>${product.title}</h3>
    <p>₹${Math.round(product.price * 83)}</p>
    <small>${product.description.substring(0, 80)}...</small>
    <br><br>
    <button>Add to Cart</button>
`;

            productGrid.appendChild(card);

        });

    })
    .catch(error => {

    console.error("Error loading products:", error);

    productGrid.innerHTML = `
        <p>Failed to load products. Please try again later.</p>
    `;

});