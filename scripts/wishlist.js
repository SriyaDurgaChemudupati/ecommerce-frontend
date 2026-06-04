localStorage.getItem("wishlist")
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.querySelector(".wishlist-btn");

  if (!btn) return;

  btn.addEventListener("click", () => {

    const product = {
      id: btn.dataset.id,
      title: btn.dataset.title,
      price: btn.dataset.price,
      image: btn.dataset.image
    };

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.find(item => item.id === product.id);

    if (!exists) {

      wishlist.push(product);

      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      console.log("Saved wishlist:", wishlist);

      alert("Added to wishlist ❤️");

    } else {
      alert("Already in wishlist");
    }

  });

});