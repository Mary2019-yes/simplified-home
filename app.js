document.addEventListener('DOMContentLoaded', () => {
  // ---------------- Products Data ----------------
  const products = [
    {
      id: "blender",
      name: "Electric Blender",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400",
      description: "Powerful 2L blender perfect for juices, smoothies, and kitchen prep.",
      price: 4200
    },
    {
      id: "kettle",
      name: "Electric Kettle",
      image: "https://images.unsplash.com/photo-1616627988854-6e2b6a32db23?w=400",
      description: "1.7L stainless steel kettle for fast boiling and elegant design.",
      price: 2800
    },
    {
      id: "airFryer",
      name: "Digital Air Fryer",
      image: "https://images.unsplash.com/photo-1616628188461-9e06d43d0a38?w=400",
      description: "Healthy cooking with less oil — 4L capacity and digital temperature control.",
      price: 8500
    }
    // Add the rest of your products here...
  ];

  // ---------------- Cart ----------------
  let cart = [];
  const cartDrawer = document.getElementById('cartDrawer');
  const cartList = document.getElementById('cartList');
  const cartCount = document.getElementById('cartCount');
  const cartEmpty = document.getElementById('cartEmpty');

  function updateCartUI() {
    cartList.innerHTML = '';
    if(cart.length === 0) {
      cartEmpty.style.display = 'block';
      cartCount.style.display = 'none';
    } else {
      cartEmpty.style.display = 'none';
      cartCount.style.display = 'block';
      cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
      cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong>
            <p>${item.quantity} x KES ${item.price}</p>
          </div>
        `;
        cartList.appendChild(div);
      });
    }
  }

  document.getElementById('openCart').addEventListener('click', () => cartDrawer.style.display='block');
  document.getElementById('closeCart').addEventListener('click', () => cartDrawer.style.display='none');
  document.getElementById('checkoutBtn').addEventListener('click', () => alert('Proceed to checkout'));

  // ---------------- WhatsApp Button ----------------
  document.getElementById('whatsappBtn').addEventListener('click', () => {
    const url = "https://wa.me/254743039253?text=Hello%20Simplifyd%20Home";
    window.open(url, '_blank');
  });

  // ---------------- Search ----------------
  document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('search').value.toLowerCase();
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    if(filtered.length === 0){
      productGrid.innerHTML = '<p>No products found.</p>';
    } else {
      filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = p.id;
        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}">
          <div class="details">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="price">KES ${p.price}</p>
            <button class="order-btn">Order Now</button>
          </div>
        `;
        productGrid.appendChild(card);
      });
      attachOrderButtons(); // re-attach modal functionality after search
    }
  });

  // ---------------- Modal ----------------
  const modal = document.createElement('div');
  modal.id = 'productDetailModal';
  modal.className = 'modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2 id="productName"></h2>
      <img id="productImage" src="" alt="Product Image">
      <p id="productDescription"></p>
      <p id="productPrice"></p>
      <p>Quantity: <input type="number" id="productQuantity" value="1" min="1"></p>
      <button id="addToBag">Add to Bag</button>
    </div>
  `;
  document.body.appendChild(modal);

  const closeModal = modal.querySelector('.close-btn');
  const addToBagBtn = modal.querySelector('#addToBag');
  const productName = modal.querySelector('#productName');
  const productImage = modal.querySelector('#productImage');
  const productDescription = modal.querySelector('#productDescription');
  const productPrice = modal.querySelector('#productPrice');
  const productQuantity = modal.querySelector('#productQuantity');

  closeModal.addEventListener('click', () => modal.style.display='none');

  function attachOrderButtons() {
    const orderBtns = document.querySelectorAll('.order-btn');
    orderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.closest('.product-card').dataset.id;
        const product = products.find(p => p.id === productId);
        if(product){
          productName.textContent = product.name;
          productImage.src = product.image;
          productDescription.textContent = product.description;
          productPrice.textContent = `KES ${product.price}`;
          productQuantity.value = 1;
          modal.style.display = 'flex';
          
          addToBagBtn.onclick = () => {
            const quantity = parseInt(productQuantity.value);
            const existing = cart.find(c => c.id === product.id);
            if(existing) existing.quantity += quantity;
            else cart.push({...product, quantity});
            updateCartUI();
            modal.style.display = 'none';
          };
        }
      });
    });
  }

  attachOrderButtons(); // initial attach for all buttons

  // ---------------- Newsletter ----------------
  document.getElementById('subscribe').addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    if(email) alert(`Subscribed with ${email}`);
  });
});
