// ============ Estado de atención en vivo (Chile) ============
function renderStatus(){
  const wrap = document.getElementById('statusBadgeWrap');
  if(!wrap) return;

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
  const day = now.getDay(); // 0 domingo, 1 lunes ... 6 sábado
  const hour = now.getHours() + now.getMinutes()/60;

  let isOpen = false;
  let label = '';
  let nextInfo = '';

  if(day >= 1 && day <= 5){ // lunes a viernes: online 10-20
    isOpen = hour >= 10 && hour < 20;
    label = isOpen ? 'Atendiendo online ahora' : 'Cerrado por hoy';
    if(isOpen){
      nextInfo = 'Escríbenos, respondemos enseguida';
    }else if(hour < 10){
      nextInfo = 'Abrimos hoy a las 10:00';
    }else if(day === 5){ // viernes cerrado tras las 20h
      nextInfo = 'Abrimos el sábado a las 10:00 en el Persa 40';
    }else{
      nextInfo = 'Volvemos mañana a las 10:00';
    }
  }else{ // sábado / domingo: presencial 10-19
    isOpen = hour >= 10 && hour < 19;
    label = isOpen ? 'Puesto abierto ahora' : 'Puesto cerrado';
    if(isOpen){
      nextInfo = 'Visítanos en Persa 40, local 563';
    }else if(hour < 10){
      nextInfo = 'Abrimos hoy a las 10:00';
    }else if(day === 6){ // sábado cerrado tras las 19h
      nextInfo = 'Mañana domingo abrimos de 10:00 a 19:00';
    }else{ // domingo cerrado tras las 19h
      nextInfo = 'Volvemos el próximo sábado a las 10:00';
    }
  }

  const badge = document.createElement('div');
  badge.className = 'status-badge ' + (isOpen ? 'is-open' : 'is-closed');
  badge.innerHTML = `<span class="status-dot"></span>${label} · ${nextInfo}`;
  wrap.innerHTML = '';
  wrap.appendChild(badge);
}
renderStatus();
setInterval(renderStatus, 60000);

// ============ Menú móvil ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle){
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ============ FAQ accordion ============
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});
// set initial open faq height
window.addEventListener('load', () => {
  const openItem = document.querySelector('.faq-item.open .faq-a');
  if(openItem) openItem.style.maxHeight = openItem.scrollHeight + 'px';
});

// ============ Footer year ============
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

const WA_NUMBER = '56991668188';
const CART_KEY = 'got_cart_v1';

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveCart(cart){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
}

let cart = loadCart();

function buildCartMessage(){
  let msg = 'Hola Game Over Tech, quiero consultar disponibilidad de:\n';
  cart.forEach(item => { msg += `• ${item.name} (${item.price})\n`; });
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ---- Elementos: panel completo (solo existe en /productos/) ----
const cartFab = document.getElementById('cartFab');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSend = document.getElementById('cartSend');
const cartClose = document.getElementById('cartClose');
const waFloat = document.getElementById('waFloat');

// ---- Elementos: banner liviano (existe en el resto de las páginas) ----
const cartBanner = document.getElementById('cartBanner');
const cartBannerText = document.getElementById('cartBannerText');
const cartBannerSend = document.getElementById('cartBannerSend');

function renderCart(){
  const hasItems = cart.length > 0;

  // --- Panel completo (Productos) ---
  if(cartItemsEl){
    cartItemsEl.innerHTML = '';
    if(!hasItems){
      cartEmptyEl.style.display = 'block';
      cartSend.style.display = 'none';
    }else{
      cartEmptyEl.style.display = 'none';
      cartSend.style.display = 'flex';
      cart.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${item.price}</span>
          <button class="cart-item-remove" data-idx="${idx}" aria-label="Quitar">✕</button>
        `;
        cartItemsEl.appendChild(row);
      });
    }
    if(cartCount) cartCount.textContent = cart.length;
    if(cartFab) cartFab.classList.toggle('show', hasItems);
    if(hasItems && cartSend) cartSend.href = buildCartMessage();
  }

  // --- Banner liviano (otras páginas) ---
  if(cartBanner){
    cartBanner.classList.toggle('show', hasItems);
    if(hasItems){
      const n = cart.length;
      cartBannerText.textContent = `🛒 Tienes ${n} producto${n>1?'s':''} en tu pedido`;
      cartBannerSend.href = buildCartMessage();
    }
  }

  // --- Botón flotante de WhatsApp: se oculta si hay carrito activo, para no duplicar CTAs ---
  if(waFloat) waFloat.classList.toggle('hide', hasItems);

  // --- Estado "agregado" en los botones de producto ---
  document.querySelectorAll('.pc-add').forEach(btn => {
    const card = btn.closest('.product-card');
    const name = card.dataset.name;
    const isAdded = cart.some(i => i.name === name);
    btn.classList.toggle('added', isAdded);
    btn.textContent = isAdded ? '✓ Agregado al pedido' : '+ Agregar al pedido';
  });
}

// ============ Enlaza interacciones a las tarjetas de producto ============
// Se llama al cargar la página Y otra vez cada vez que products-render.js
// termina de dibujar las tarjetas que vienen desde Supabase.
function GOT_bindProductCards(){
  document.querySelectorAll('.pc-add').forEach(btn => {
    if(btn.dataset.bound) return; // evita duplicar el listener
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card.dataset.name;
      const price = card.dataset.price;
      const existingIdx = cart.findIndex(i => i.name === name);
      if(existingIdx > -1){
        cart.splice(existingIdx, 1);
      }else{
        cart.push({ name, price });
      }
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll('.product-card .img-wrap img').forEach(img => {
    if(img.dataset.bound) return;
    img.dataset.bound = '1';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  renderCart();

  // aplica el filtro de categoría vigente (URL) apenas llegan las tarjetas
  if(document.getElementById('productGrid')){
    const params = new URLSearchParams(window.location.search);
    applyFilter(params.get('cat') || 'todos');
  }
}
window.GOT_bindProductCards = GOT_bindProductCards;

if(cartFab){
  cartFab.addEventListener('click', () => cartPanel.classList.toggle('open'));
}
if(cartClose){
  cartClose.addEventListener('click', () => cartPanel.classList.remove('open'));
}
if(cartItemsEl){
  cartItemsEl.addEventListener('click', (e) => {
    if(e.target.classList.contains('cart-item-remove')){
      const idx = parseInt(e.target.dataset.idx, 10);
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    }
  });
}

renderCart();

// ============ Lightbox (zoom de fotos al hacer clic, solo en /productos/) ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function closeLightbox(){ if(lightbox){ lightbox.classList.remove('open'); lightboxImg.src=''; } }
if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if(lightbox) lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLightbox(); });

// ============ Filtro de categorías (solo en /productos/) ============
function applyFilter(cat){
  const cards = document.querySelectorAll('#productGrid .product-card');
  if(cards.length === 0) return;
  let visibleCount = 0;
  cards.forEach(card => {
    const matches = cat === 'todos' || card.dataset.category === cat;
    card.classList.toggle('filtered-out', !matches);
    if(matches) visibleCount++;
  });
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === cat);
  });
  const emptyMsg = document.getElementById('filterEmpty');
  if(emptyMsg) emptyMsg.classList.toggle('show', visibleCount === 0);
}

document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    applyFilter(pill.dataset.filter);
    // refleja el filtro activo en la URL, sin recargar la página
    const url = new URL(window.location);
    if(pill.dataset.filter === 'todos'){ url.searchParams.delete('cat'); }
    else{ url.searchParams.set('cat', pill.dataset.filter); }
    window.history.replaceState({}, '', url);
  });
});

// ============ Toggle del submenú "Productos" en el nav ============
const navProductosToggle = document.getElementById('navProductosToggle');
if(navProductosToggle){
  navProductosToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navProductosToggle.closest('.nav-has-sub').classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    const wrap = navProductosToggle.closest('.nav-has-sub');
    if(wrap.classList.contains('open') && !wrap.contains(e.target)){
      wrap.classList.remove('open');
    }
  });
}
