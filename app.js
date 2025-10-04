```js
`;
grid.appendChild(div);
});
}


renderProducts(PRODUCTS);


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


document.getElementById('searchBtn').addEventListener('click',()=>applyFilters());
document.getElementById('search').addEventListener('keyup',e=>{ if(e.key==='Enter') applyFilters(); });
document.getElementById('categoryChips').addEventListener('click',e=>{ if(e.target.dataset.cat) applyFilters(e.target.dataset.cat); });
document.getElementById('sort').addEventListener('change',applyFilters);


function saveCart(){ localStorage.setItem('simplifyd_cart',JSON.stringify(CART)); updateCartCount(); }
function addToCart(id){ CART[id] = (CART[id]||0)+1; saveCart(); renderCart(); alert('Added to cart'); }
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
const qty = CART[id]; if(!p) return;
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
const checkoutBtn = document.getElementById('checkout
