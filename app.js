// ======= CART FUNCTIONALITY =======
let cart = [];

const cartDrawer = document.getElementById('cartDrawer');
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartEmpty = document.getElementById('cartEmpty');

function updateCartUI() {
    cartList.innerHTML = '';
    if(cart.length === 0){
        cartEmpty.style.display = 'block';
        cartCount.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartCount.style.display = 'block';
        cartCount.textContent = cart.reduce((acc,i)=>acc+i.quantity,0);

        cart.forEach(item=>{
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}" />
                <div>
                  <p>${item.name}</p>
                  <p>${item.price}</p>
                  <div class="qty">
                    <button class="dec">-</button>
                    <span>${item.quantity}</span>
                    <button class="inc">+</button>
                  </div>
                </div>
            `;
            div.querySelector('.dec').addEventListener('click', ()=>{
                if(item.quantity>1) item.quantity--;
                else cart = cart.filter(i=>i!==item);
                updateCartUI();
            });
            div.querySelector('.inc').addEventListener('click', ()=>{
                item.quantity++;
                updateCartUI();
            });
            cartList.appendChild(div);
        });
    }
}

document.getElementById('openCart').addEventListener('click', ()=>cartDrawer.style.display='block');
document.getElementById('closeCart').addEventListener('click', ()=>cartDrawer.style.display='none');

// ======= ORDER NOW / PRODUCT DETAIL VIEW =======
const productCards = document.querySelectorAll('.order-btn');

productCards.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const parent = btn.closest('.product-card');
        const product = {
            name: btn.dataset.item,
            price: btn.dataset.price,
            image: parent.querySelector('img').src,
            quantity: 1
        };
        // Show product detail like your example
        const detailHTML = `
            <div style="background:#fff;padding:20px;border-radius:12px;max-width:400px;margin:20px auto;box-shadow:0 4px 15px rgba(0,0,0,0.1)">
              <h2>${product.name}</h2>
              <p class="price">${product.price}</p>
              <ul>
                <li>Stylish & Durable</li>
                <li>Stainless Steel & Non Stick function heads</li>
                <li>Soft Grip & Non Slip handle</li>
                <li>Ideal for Stainless Steel and Non Stick cookware</li>
                <li>Rossetti Quality Assured</li>
                <li>Available</li>
              </ul>
              <div style="display:flex;gap:8px;align-items:center;margin-top:12px">
                <label>Quantity</label>
                <input type="number" value="1" min="1" id="detailQty" style="width:60px;padding:4px;border:1px solid #ddd;border-radius:6px"/>
              </div>
              <button id="addToCart" style="margin-top:12px;background:#ff4d6d;color:#fff;padding:10px 20px;border:none;border-radius:25px;cursor:pointer">Add to Bag</button>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = detailHTML;
        document.body.appendChild(tempDiv);

        document.getElementById('addToCart').addEventListener('click', ()=>{
            const qty = parseInt(document.getElementById('detailQty').value);
            const existing = cart.find(i=>i.name===product.name);
            if(existing) existing.quantity += qty;
            else cart.push({...product, quantity: qty});
            updateCartUI();
            tempDiv.remove();
        });
    });
});

// ======= WHATSAPP BUTTON =======
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
