// Demo product data (replace with backend calls later)
    const PRODUCTS = [
      {id:1,title:'Compact Blender 1.5L',price:2999,cat:'kitchen',img:'https://images.unsplash.com/photo-1586201375761-83865001e4a5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',desc:'500W blender, stainless steel blades.'},
      {id:2,title:'Air Fryer 3.5L',price:7499,cat:'kitchen',img:'https://images.unsplash.com/photo-1581578017421-1b9aaf3e5a4f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',desc:'Healthy frying with little oil.'},
      {id:3,title:'Non-stick Frying Pan 28cm',price:1299,cat:'cookware',img:'https://images.unsplash.com/photo-1542444459-db1d2f1b8a6f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',desc:'Durable non-stick coating.'},
      {id:4,title:'Electric Kettle 1.7L',price:1999,cat:'kitchen',img:'https://images.unsplash.com/photo-1556911220-e15b29be8c3d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',desc:'Auto shut-off and boil-dry protection.'},
      {id:5,title:'Portable Bluetooth Speaker',price:2499,cat:'electronics',img:'https://images.unsplash.com/photo-1518444022206-0a5b0e5a9f37?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',desc:'Small, loud and clear.'},
      {id:6,title:'Toaster 2-Slice',price:899,cat:'kitchen',img:'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',desc:'2-slice with browning control.'},
      {id:7,title:'USB Charging Station',price:799,cat:'accessories',img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',desc:'Charge multiple devices.'}
    ];

    // Cart state (persist in localStorage)
    let CART = JSON.parse(localStorage.getItem('simplifyd_cart')||'{}');

    // Helpers
    function formatKES(n){return new Intl.NumberFormat('en-KE',{style:'currency',currency:'KES'}).format(n)}

    // Render products
    const grid = document.getElementById('productGrid');
    function renderProducts(list){
      grid.innerHTML='';
      list.forEach(p=>{
        const div=document.createElement('div');div.className='card';
        div.innerHTML=`
          <img src="${p.img}" alt="${p.title}">
          <h3>${p.title}</h3>
          <div class="muted">${p.desc}</div>
          <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;margin-top:10px">
            <div class="price">${formatKES(p.price)}</div>
            <div><button onclick="addToCart(${p.id})">Add to Cart</button></div>
          </div>
        `;
        grid.appendChild(div);
      });
    }

    // Initial render
    renderProducts(PRODUCTS);

    // Search and filters
    document.getElementById('searchBtn').addEventListener('click',()=>applyFilters());
    document.getElementById('search').addEventListener('keyup',e=>{ if(e.key==='Enter') applyFilters(); });
    document.getElementById('categoryChips').addEventListener('click',e=>{ if(e.target.dataset.cat) applyFilters(e.target.dataset.cat); });
    document.getElementById('sort').addEventListener('change',applyFilters);

    function applyFilters(category){
      const q=document.getElementById('search').value.toLowerCase();
      const sort=document.getElementById('sort').value;
      let results = PRODUCTS.filter(p=>{
        const matchQ = q? (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) : true;
        const matchCat = category && category!=='all' ? p.cat===category : true;
        return matchQ && matchCat;
      });
      if(sort==='price-asc') results.sort((a,b)=>a.price-b.price);
      if(sort==='price-desc') results.sort((a,b)=>b.price-a.price);
      renderProducts(results);
    }

    // Cart functions
    function saveCart(){ localStorage.setItem('simplifyd_cart',JSON.stringify(CART)); updateCartCount(); }
    function addToCart(id){
      CART[id] = (CART[id]||0)+1; saveCart(); renderCart();
      alert('Added to cart');
    }
    function removeFromCart(id){ delete CART[id]; saveCart(); renderCart(); }
    function changeQty(id,delta){ CART[id] = Math.max(0,(CART[id]||0)+delta); if(CART[id]===0) delete CART[id]; saveCart(); renderCart(); }

    function updateCartCount(){
      const count = Object.values(CART).reduce((s,n)=>s+n,0);
      const el = document.getElementById('cartCount');
      if(count>0){ el.style.display='block'; el.textContent=count; } else { el.style.display='none'; }
    }

    function renderCart(){
      const listEl = document.getElementById('cartList');
      const emptyEl = document.getElementById('cartEmpty');
      listEl.innerHTML='';
      const ids = Object.keys(CART);
      if(ids.length===0){ emptyEl.style.display='block'; } else { emptyEl.style.display='none'; }
      let total=0;
      ids.forEach(id=>{
        const p = PRODUCTS.find(x=>x.id==id);
        const qty = CART[id];
        if(!p) return;
        total += p.price*qty;
        const item = document.createElement('div'); item.className='cart-item';
        item.innerHTML = `
          <img src="${p.img}" alt="${p.title}">
          <div style="flex:1">
            <div style="font-weight:600">${p.title}</div>
            <div class="muted">${formatKES(p.price)} x ${qty} = <strong>${formatKES(p.price*qty)}</strong></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
            <div class="qty"><button onclick="changeQty(${p.id},-1)">-</button><div style="padding:6px">${qty}</div><button onclick="changeQty(${p.id},1)">+</button></div>
            <button style="background:#ff6b6b" onclick="removeFromCart(${p.id})">Remove</button>
          </div>
        `;
        listEl.appendChild(item);
      });

      // total and checkout actions
      const checkoutBtn = document.getElementById('checkoutBtn');
      checkoutBtn.disabled = ids.length===0;
      // show simple total
      if(ids.length>0){
        let totDiv = document.getElementById('cartTotal');
        if(!totDiv){ totDiv = document.createElement('div'); totDiv.id='cartTotal'; totDiv.style.marginTop='12px'; document.getElementById('cartDrawer').insertBefore(totDiv, document.querySelector('.checkout'));
        }
        totDiv.innerHTML = `<strong>Total: ${formatKES(total)}</strong>`;
      } else {
        const t = document.getElementById('cartTotal'); if(t) t.remove();
      }

      updateCartCount();
    }

    // Drawer open/close
    document.getElementById('openCart').addEventListener('click',()=>{ document.getElementById('cartDrawer').style.display='block'; renderCart(); });
    document.getElementById('closeCart').addEventListener('click',()=>{ document.getElementById('cartDrawer').style.display='none'; });

    // Checkout flow (simple demo)
    document.getElementById('checkoutBtn').addEventListener('click',()=>{
      const ids = Object.keys(CART); if(ids.length===0) return alert('Cart is empty');
      // show a prompt-based checkout (replace with real form or payment flow)
      const name = prompt('Full name'); if(!name) return;
      const phone = prompt('Phone (e.g. 07...)'); if(!phone) return;
      const address = prompt('Delivery address'); if(!address) return;
      // For real M-Pesa integration, you will use the Daraja API server-side to request STK Push.
      alert('Order placed!\nWe will contact you on WhatsApp to confirm payment and delivery.');
      // clear cart
      CART = {}; saveCart(); renderCart(); document.getElementById('cartDrawer').style.display='none';
    });

    // Subscribe button
    document.getElementById('subscribe').addEventListener('click',()=>{
      const e = document.getElementById('emailInput').value;
      if(!e) return alert('Enter email');
      alert('Thanks! Subscribed: '+e);
      document.getElementById('emailInput').value='';
    });

// WhatsApp button with your number
document.getElementById('whatsappBtn').addEventListener('click',()=>{
  const wa = 'https://wa.me/254743039253?text=' + encodeURIComponent('Hi Mary 👋, I need help with an order or want to buy a product.');
  window.open(wa,'_blank');
});


  // Checkout flow with WhatsApp message
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  const ids = Object.keys(CART); 
  if(ids.length===0) return alert('Cart is empty');

  const name = prompt('Full name'); if(!name) return;
  const phone = prompt('Phone (e.g. 07...)'); if(!phone) return;
  const address = prompt('Delivery address'); if(!address) return;

  // Collect cart summary
  let orderDetails = '🛒 *Simplified Home Order*\n\n';
  ids.forEach(id=>{
    const p = PRODUCTS.find(x=>x.id==id);
    const qty = CART[id];
    orderDetails += `- ${p.title} x${qty} = KES ${p.price*qty}\n`;
  });

  orderDetails += `\n👤 Name: ${name}\n📞 Phone: ${phone}\n🏠 Address: ${address}\n\nThank you!`;

  // Open WhatsApp with order
  const wa = 'https://wa.me/254743039253?text=' + encodeURIComponent(orderDetails);
  window.open(wa,'_blank');

  // clear cart
  CART = {}; saveCart(); renderCart(); document.getElementById('cartDrawer').style.display='none';
});

    // initialize
    updateCartCount(); renderCart();
