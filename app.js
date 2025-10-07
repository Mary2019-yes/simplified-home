// app.js — handles product details, cart, and WhatsApp orders

document.addEventListener("DOMContentLoaded", () => {
const modal = document.getElementById("productDetailModal");
const closeBtn = document.querySelector(".close-btn");
const productName = document.getElementById("productName");
const productImage = document.getElementById("productImage");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");
const addToBagBtn = document.getElementById("addToBag");

// WhatsApp & Cart buttons
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartList = document.getElementById("cartList");
const cartEmpty = document.getElementById("cartEmpty");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const whatsappBtn = document.getElementById("whatsappBtn");

let currentProduct = {};
let cart = [];

// ✅ Handle "Order Now" clicks
document.querySelectorAll(".order-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const img = card.querySelector("img").src;
    const name = card.querySelector("h3").textContent;
    const desc = card.querySelector("p").textContent;
    const price = card.querySelector(".price").textContent;

    // 👇 Add this special section here
    if (name === "Kitchen Weighing Scale") {
      productDescription.innerHTML = `
        <ul>
          <li>Digital scale with LCD display for accurate measurements</li>
          <li>High-precision sensor ensures consistent results</li>
          <li>Compact and durable design for daily use</li>
          <li>Easy-to-read LCD screen for quick viewing</li>
          <li>Suitable for both home and business applications</li>
        </ul>
      `;
    } else {
      productDescription.textContent = desc;
    }

    // ✅ Fill modal
    productName.textContent = name;
    productImage.src = img;
    productPrice.textContent = price;
    productQuantity.value = 1;

    currentProduct = { name, img, desc, price };
    modal.style.display = "flex";
  }); // closes event listener
}); // closes forEach

// ✅ Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// ✅ Add to cart
addToBagBtn.addEventListener("click", () => {
  const qty = parseInt(productQuantity.value);
  addToCart(currentProduct.name, currentProduct.price, qty);
  modal.style.display = "none";
  cartDrawer.style.display = "block";
});

// ✅ Add to cart function
function addToCart(name, price, qty = 1) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }
  updateCart();
}

// ✅ Update cart display
function updateCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartCount.style.display = "none";
  } else {
    cartEmpty.style.display = "none";
    cartCount.style.display = "inline-block";
    cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);
    cart.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <strong>${item.name}</strong><br>
        ${item.price} x ${item.qty}
        <hr>
      `;
      cartList.appendChild(div);
    });
  }
}

// ✅ Checkout (send WhatsApp message)
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  const message = cart.map(i => `${i.name} - ${i.price} x ${i.qty}`).join("\n");
  const total = cart.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/\D/g, ""));
    return sum + num * item.qty;
  }, 0);
  const fullMsg = `Hello! I'd like to order:\n${message}\n\nTotal: KES ${total}`;
  const phone = "254743039253"; // your WhatsApp number
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(fullMsg)}`, "_blank");
});

// ✅ WhatsApp general chat
whatsappBtn.addEventListener("click", () => {
  const phone = "254743039253";
  window.open(`https://wa.me/${phone}?text=Hi! I'm interested in your kitchen and electronics products.`, "_blank");
});

// ✅ Open / close cart
openCartBtn.addEventListener("click", () => {
  cartDrawer.style.display = "block";
});
closeCartBtn.addEventListener("click", () => {
  cartDrawer.style.display = "none";
});
