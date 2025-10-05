// ======= CART SETUP =======
let cart = [];

// DOM Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartEmpty = document.getElementById('cartEmpty');

// Open & Close Cart
document.getElementById('openCart').addEventListener('click', () => {
  cartDrawer.style.display = 'block';
});
document.getElementById('closeCart').addEventListener('click', () => {
  cartDrawer.style.display = 'none';
});

// Add to Cart function
function addToCart(item, price, quantity = 1) {
  const existing = cart.find(i => i.name === item);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name: item, price, quantity });
  }
  updateCart();
}

// Update cart UI
function updateCart() {
  cartList.innerHTML = '';
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartCount.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartCount.style.display = 'block';
    cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-name">${item.name}</div>
        <div class="qty">
          <button class="minus">-</button>
          <span>${item.quantity}</span>
          <button class="plus">+</button>
        </div>
        <div class="cart-price">${item.price}</div>
      `;
      // Qty buttons
      div.querySelector('.plus').addEventListener('click', () => { addToCart(item.name, item.price, 1); });
      div.querySelector('.minus').addEventListener('click', () => { 
        item.quantity--;
        if(item.quantity <= 0) cart = cart.filter(i => i.name !== item.name);
        updateCart();
      });
      cartList.appendChild(div);
    });
  }
}

// ======= PRODUCT DETAIL MODAL =======
const modal = document.createElement('div');
modal.id = 'productModal';
modal.style.cssText = `
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);
  display:none;align-items:center;justify-content:center;z-index:1000;
`;
modal.innerHTML = `
  <div style="background:#fff;padding:20px;border-radius:12px;max-width:400px;width:90%;">
    <button id="closeModal" style="float:right;background:#ddd;border:none;padding:4px 8px;border-radius:6px;cursor:pointer">X</button>
    <div id="modalContent"></div>
  </div>
`;
document.body.appendChild(modal);

document.getElementById('closeModal').addEventListener('click', () => {
  modal.style.display = 'none';
});

// Event listener for "Order Now" buttons
document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.item;
    const price = btn.dataset.price;
    const description = btn.parentElement.querySelector('p').innerText;

    const content = document.getElementById('modalContent');
    content.innerHTML = `
      <h2>${name}</h2>
      <p style="font-weight:bold">${price}</p>
      <p>${description}</p>
      <label>Quantity</label>
      <input type="number" id="modalQty" value="1" min="1" style="width:60px;padding:4px;margin:6px 0"/>
      <button id="addModalCart" style="background:#ff4d6d;color:#fff;padding:8px 12px;border:none;border-radius:6px;cursor:pointer">Add to Bag</button>
    `;
    modal.style.display = 'flex';

    document.getElementById('addModalCart').addEventListener('click', () => {
      const qty = parseInt(document.getElementById('modalQty').value);
      addToCart(name, price, qty);
      modal.style.display = 'none';
    });
  });
});

// ======= SEARCH FUNCTIONALITY =======
document.getElementById('searchBtn').addEventListener('click', () => {
  const term = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(term) ? 'flex' : 'none';
  });
});
document.getElementById('whatsappBtn').addEventListener('click', () => {
  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  const message = cart.map(i => `${i.name} x${i.quantity} - ${i.price}`).join('\n');
  const phone = "+254743039253"; // your WhatsApp number
  const url = `https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
});
