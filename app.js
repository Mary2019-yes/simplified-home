// app.js — handles cart, WhatsApp, and search features

// Select elements
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartDrawer = document.getElementById('cartDrawer');
const cartList = document.getElementById('cartList');
const cartEmpty = document.getElementById('cartEmpty');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const whatsappBtn = document.getElementById('whatsappBtn');

let cart = [];

// ✅ Open and close cart
openCartBtn.addEventListener('click', () => {
  cartDrawer.style.display = 'block';
});
closeCartBtn.addEventListener('click', () => {
  cartDrawer.style.display = 'none';
});

// ✅ Add “Order Now” button actions
const orderButtons = document.querySelectorAll('.order-btn');
orderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-item');
    const price = btn.getAttribute('data-price');
    addToCart(name, price);
    cartDrawer.style.display = 'block';
  });
});

// ✅ Add item to cart
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCart();
}

// ✅ Update cart display
function updateCart() {
  cartList.innerHTML = '';
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartCount.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartCount.style.display = 'inline-block';
    cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);

    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <strong>${item.name}</strong><br>
        ${item.price} x ${item.qty}
        <hr>
      `;
      cartList.appendChild(div);
    });
  }
}

// ✅ Checkout button (sends WhatsApp message)
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  const message = cart.map(i => `${i.name} - ${i.price} x ${i.qty}`).join('\n');
  const total = cart.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/\D/g, ''));
    return sum + num * item.qty;
  }, 0);
  const fullMsg = `Hello, I'd like to order:\n${message}\n\nTotal: KES ${total}`;
  const phone = '254743039253'; // your WhatsApp number
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(fullMsg)}`, '_blank');
});

// ✅ WhatsApp button (general chat)
whatsappBtn.addEventListener('click', () => {
  const phone = '254743039253';
  window.open(`https://wa.me/${phone}?text=Hi! I'm interested in your kitchen and electronics products.`, '_blank');
});
