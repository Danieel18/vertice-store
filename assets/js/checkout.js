(() => {
  "use strict";
  const PRODUCTS = window.PRODUCTS || [];
  const money = n => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
  const $ = s => document.querySelector(s);
  let cart=[];
  try{cart=JSON.parse(localStorage.getItem("vertice_cart")||"[]")}catch{}
  cart=Array.isArray(cart)?cart.filter(i=>PRODUCTS.some(p=>p.id===i.id)&&i.qty>0):[];
  const coupon=localStorage.getItem("vertice_coupon")||"";
  const subtotal=cart.reduce((s,i)=>s+(PRODUCTS.find(p=>p.id===i.id).price*i.qty),0);
  const discount=coupon==="VERTICE10"?subtotal*.10:0;
  const total=subtotal-discount;
  if(!cart.length){$("#checkoutEmpty").hidden=false;$("#checkoutForm").hidden=true;}
  $("#checkoutSummary").innerHTML=cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return `<div class="summary-line"><span>${p.name} × ${i.qty}</span><strong>${money(p.price*i.qty)}</strong></div>`}).join("")+(discount?`<div class="summary-line"><span>Desconto VERTICE10</span><strong>− ${money(discount)}</strong></div>`:"");
  $("#checkoutTotal").textContent=money(total);
  $("#checkoutForm").addEventListener("submit",e=>{
    e.preventDefault();
    const form=e.target;
    if(!form.checkValidity()){form.reportValidity();return;}
    // Segurança: nenhum dado sensível de pagamento é coletado neste front-end.
    $("#checkoutFeedback").textContent=`Pedido demonstrativo criado. Total: ${money(total)}. Em produção, o servidor deverá validar estoque, preços, cupom e pagamento novamente.`;
    localStorage.removeItem("vertice_cart");localStorage.removeItem("vertice_coupon");
    form.reset();
  });
})();