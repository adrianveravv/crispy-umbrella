// BRASA MARINA - Menú digital interactivo
// Cambia este número por el WhatsApp real del restaurante.
// Ecuador: código 593 + número celular sin el 0 inicial. Solo números.
const WHATSAPP_NUMBER = "593999999999";

const products = [
 {id:1,name:"Ceviche de camarón",category:"Entradas",price:8.50,description:"Camarón, limón, cebolla y el toque tradicional de la costa.",image:"https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=900&q=80"},
 {id:2,name:"Patacones con queso",category:"Entradas",price:4.00,description:"Patacones dorados acompañados de queso y salsa de la casa.",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"},
 {id:3,name:"Encocado de pescado",category:"Platos principales",price:12.00,description:"Pescado en salsa de coco, servido con arroz.",image:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80"},
 {id:4,name:"Arroz marinero",category:"Platos principales",price:13.50,description:"Combinación de mariscos con arroz y sazón costeña.",image:"https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80"},
 {id:5,name:"Pescado a la plancha",category:"Platos principales",price:11.00,description:"Filete a la plancha con arroz, ensalada y patacones.",image:"https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=900&q=80"},
 {id:6,name:"Mariscada especial",category:"Platos principales",price:16.00,description:"Selección de mariscos para disfrutar los sabores del mar.",image:"https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80"},
 {id:7,name:"Jugo de maracuyá",category:"Bebidas",price:2.50,description:"Bebida natural de maracuyá, fresca y tropical.",image:"https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80"},
 {id:8,name:"Limonada natural",category:"Bebidas",price:2.00,description:"Limonada preparada al momento.",image:"https://images.unsplash.com/photo-1513558161293-cd1a0b2c5c8a?auto=format&fit=crop&w=900&q=80"}
];

let cart=[];let activeCategory="Todos";
const $=id=>document.getElementById(id);
const money=value=>`$${value.toFixed(2)}`;

function renderProducts(){
 const term=$("search").value.trim().toLowerCase();
 const filtered=products.filter(p=>(activeCategory==="Todos"||p.category===activeCategory)&&(p.name.toLowerCase().includes(term)||p.description.toLowerCase().includes(term)));
 $("products").innerHTML=filtered.length?filtered.map(p=>`
 <article class="card"><div class="photo" style="background-image:url('${p.image}')"><span class="tag">${p.category}</span></div>
 <div class="info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">+ Agregar</button></div></div></article>`).join(""):`<p class="no-results">No encontramos platos con esa búsqueda.</p>`;
}
function renderCart(){
 const count=cart.reduce((s,p)=>s+p.quantity,0),total=cart.reduce((s,p)=>s+p.price*p.quantity,0);
 $("cart-count").textContent=count;$("total").textContent=money(total);$("empty").hidden=cart.length>0;
 $("cart-items").innerHTML=cart.map(p=>`<div class="cart-line"><div><strong>${p.name}</strong><small>${money(p.price)} c/u</small></div><div class="quantity"><button data-change="${p.id}" data-amount="-1">−</button><span>${p.quantity}</span><button data-change="${p.id}" data-amount="1">+</button></div></div>`).join("");
}
function addToCart(id){const item=cart.find(p=>p.id===id);if(item)item.quantity++;else cart.push({...products.find(p=>p.id===id),quantity:1});renderCart();}
function changeQuantity(id,amount){const item=cart.find(p=>p.id===id);if(!item)return;item.quantity+=amount;if(item.quantity<=0)cart=cart.filter(p=>p.id!==id);renderCart();}
function openCart(){$("drawer").classList.add("open");$("overlay").classList.add("show");}
function closeCart(){$("drawer").classList.remove("open");$("overlay").classList.remove("show");}
function checkout(){
 if(!cart.length){alert("Tu carrito está vacío. Agrega al menos un producto.");return;}
 if(WHATSAPP_NUMBER==="593999999999"){alert("Configura el número real de WhatsApp en la variable WHATSAPP_NUMBER del archivo script.js.");return;}
 const lines=cart.map(p=>`• ${p.quantity} x ${p.name} — ${money(p.price*p.quantity)}`);
 const total=cart.reduce((s,p)=>s+p.price*p.quantity,0);
 const message=`¡Hola, Brasa Marina! Quiero realizar este pedido:\n\n${lines.join("\n")}\n\n*Total: ${money(total)}*\n\nPor favor, confirmen disponibilidad y forma de entrega.`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
}
$("categories").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll("[data-category]").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("search").addEventListener("input",renderProducts);
$("products").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
$("cart-items").addEventListener("click",e=>{const b=e.target.closest("[data-change]");if(b)changeQuantity(Number(b.dataset.change),Number(b.dataset.amount));});
$("open-cart").addEventListener("click",openCart);$("close-cart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);$("checkout").addEventListener("click",checkout);
$("year").textContent=new Date().getFullYear();renderProducts();renderCart();
