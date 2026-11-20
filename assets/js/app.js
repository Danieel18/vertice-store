(() => {
  "use strict";
  const PRODUCTS = window.PRODUCTS || [];
  const $ = (s) => document.querySelector(s);
  const money = (n) => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
  const safeText = (v) => String(v ?? "").replace(/[<>&"'`]/g, c => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;","`":"&#96;"}[c]));
  const state = {cart: loadCart(), coupon: localStorage.getItem("vertice_coupon") || "", category:"Todos", sort:"featured", query:""};

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem("vertice_cart") || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.filter(i => PRODUCTS.some(p=>p.id===i.id) && Number.isInteger(i.qty) && i.qty>0 && i.qty<=20)
        .map(i=>({id:i.id,qty:i.qty,size: PRODUCTS.find(p=>p.id===i.id).sizes.includes(i.size)?i.size:PRODUCTS.find(p=>p.id===i.id).sizes[0]}));
    } catch { return []; }
  }
  function persist(){ localStorage.setItem("vertice_cart", JSON.stringify(state.cart)); if(state.coupon) localStorage.setItem("vertice_coupon",state.coupon); else localStorage.removeItem("vertice_coupon"); }

  function renderProducts() {
    let list = PRODUCTS.filter(p => (state.category==="Todos" || p.category===state.category) &&
      (!state.query || `${p.name} ${p.category}`.toLowerCase().includes(state.query.toLowerCase())));
    if(state.sort==="price-asc") list.sort((a,b)=>a.price-b.price);
    if(state.sort==="price-desc") list.sort((a,b)=>b.price-a.price);
    if(state.sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
    const grid=$("#productGrid"), empty=$("#emptyState");
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map(p=>`
      <article class="product-card">
        <div class="product-image"><span>${p.icon}</span>${p.oldPrice?'<b class="sale">OFERTA</b>':''}</div>
        <div class="product-info">
          <small>${safeText(p.category)}</small><h3>${safeText(p.name)}</h3>
          <div class="price">${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:""}<strong>${money(p.price)}</strong></div>
          <div class="size-row">${p.sizes.map(s=>`<button class="size-btn" type="button" data-size="${safeText(s)}" aria-label="Tamanho ${safeText(s)}" aria-pressed="false">${safeText(s)}</button>`).join("")}</div>
          <button class="btn btn-dark btn-full add-btn" data-id="${p.id}" type="button" aria-label="Adicionar ${safeText(p.name)} ao carrinho">Adicionar</button>
        </div>
      </article>`).join("");
    grid.querySelectorAll(".product-card").forEach(card=>{
      card.querySelector(".size-btn")?.classList.add("selected");card.querySelector(".size-btn")?.setAttribute("aria-pressed","true");
      card.querySelectorAll(".size-btn").forEach(b=>b.addEventListener("click",()=>{card.querySelectorAll(".size-btn").forEach(x=>{x.classList.remove("selected");x.setAttribute("aria-pressed","false")});b.classList.add("selected");b.setAttribute("aria-pressed","true")}));
      card.querySelector(".add-btn").addEventListener("click",()=> {
        const p=PRODUCTS.find(x=>x.id===card.querySelector(".add-btn").dataset.id);
        const size=card.querySelector(".size-btn.selected")?.dataset.size || p.sizes[0];
        addToCart(p,size);
      });
    });
  }

  function addToCart(p,size){
    const existing=state.cart.find(i=>i.id===p.id && i.size===size);
    if(existing) { if(existing.qty < Math.min(p.stock,20)) existing.qty++; else return toast("Limite de estoque atingido."); }
    else state.cart.push({id:p.id,size,qty:1});
    persist(); renderCart(); toast("Produto adicionado ao carrinho.");
  }
  function removeFromCart(id,size){state.cart=state.cart.filter(i=>!(i.id===id&&i.size===size));persist();renderCart();}
  function updateQty(id,size,delta){
    const item=state.cart.find(i=>i.id===id&&i.size===size), p=PRODUCTS.find(x=>x.id===id);
    if(!item)return; item.qty=Math.max(0,Math.min(p.stock, item.qty+delta)); if(!item.qty) removeFromCart(id,size); else {persist();renderCart();}
  }
  function totals(){
    const subtotal=state.cart.reduce((s,i)=>s+(PRODUCTS.find(p=>p.id===i.id)?.price||0)*i.qty,0);
    const discount=state.coupon==="VERTICE10"?subtotal*.10:0;
    return {subtotal,discount,total:subtotal-discount};
  }
  function renderCart(){
    const qty=state.cart.reduce((s,i)=>s+i.qty,0); $("#cartCount").textContent=qty;
    const box=$("#cartItems");
    if(!state.cart.length) box.innerHTML='<p class="empty-cart">Seu carrinho está vazio.</p>';
    else box.innerHTML=state.cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return `<div class="cart-item"><div class="mini-image">${p.icon}</div><div class="cart-item-info"><strong>${safeText(p.name)}</strong><small>Tamanho: ${safeText(i.size)}</small><div class="qty"><button data-action="minus" data-id="${p.id}" data-size="${safeText(i.size)}" aria-label="Diminuir quantidade de ${safeText(p.name)}">−</button><span>${i.qty}</span><button data-action="plus" data-id="${p.id}" data-size="${safeText(i.size)}" aria-label="Aumentar quantidade de ${safeText(p.name)}">+</button><button class="remove" data-action="remove" data-id="${p.id}" data-size="${safeText(i.size)}" aria-label="Remover ${safeText(p.name)} do carrinho">Remover</button></div></div><strong>${money(p.price*i.qty)}</strong></div>`}).join("");
    box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{const {action,id,size}=b.dataset;if(action==="remove")removeFromCart(id,size);else updateQty(id,size,action==="plus"?1:-1)}));
    const t=totals();$("#cartSubtotal").textContent=money(t.subtotal);$("#cartDiscount").textContent=`− ${money(t.discount)}`;$("#cartTotal").textContent=money(t.total);$("#couponInput").value=state.coupon;
  }
  function openCart(){ $("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");$("#overlay").hidden=false; }
  function closeCart(){ $("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");$("#overlay").hidden=true; }
  function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
  function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}

  $("#categoryFilter").addEventListener("change",e=>{state.category=e.target.value;renderProducts()});
  $("#sortFilter").addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});
  document.querySelectorAll(".category-card").forEach(b=>b.addEventListener("click",()=>{$("#categoryFilter").value=b.dataset.category;state.category=b.dataset.category;renderProducts();location.hash="produtos"}));
  $("#cartBtn").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#overlay").addEventListener("click",closeCart);
  $("#checkoutBtn").addEventListener("click",()=>{if(!state.cart.length)return toast("Adicione algum produto primeiro.");location.href="pages/checkout.html"});
  $("#applyCoupon").addEventListener("click",()=>{const c=$("#couponInput").value.trim().toUpperCase();if(c==="VERTICE10"){state.coupon=c;persist();renderCart();toast("Cupom aplicado!")}else{state.coupon="";persist();renderCart();toast("Cupom inválido.")}});
  $("#copyCoupon").addEventListener("click",async()=>{try{await navigator.clipboard.writeText("VERTICE10");toast("Cupom copiado: VERTICE10")}catch{toast("Cupom: VERTICE10")}});
  $("#searchBtn").addEventListener("click",()=>{const p=$("#searchPanel");p.hidden=!p.hidden;if(!p.hidden)$("#searchInput").focus()});
  $("#searchApply").addEventListener("click",()=>{state.query=$("#searchInput").value.trim();state.category="Todos";$("#categoryFilter").value="Todos";renderProducts();$("#produtos").scrollIntoView({behavior:"smooth"})});
  $("#searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("#searchApply").click()});
  $("#menuBtn").addEventListener("click",()=>{const n=$("#mainNav");const open=n.classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",String(open))});
  $("#contactForm").addEventListener("submit",e=>{e.preventDefault();const n=$("#contactName").value.trim(),em=$("#contactEmail").value.trim(),m=$("#contactMessage").value.trim();if(!n||!validEmail(em)||m.length<5){$("#contactFeedback").textContent="Preencha os campos corretamente.";return}$("#contactFeedback").textContent="Mensagem validada localmente. Em produção, ela seria enviada a um backend seguro.";e.target.reset()});
  renderProducts();renderCart();
})();