// ============================================
// GAME OVER TECH — Renderizado dinámico de productos
// Trae el catálogo desde Supabase y arma las tarjetas
// con el mismo HTML/estilo que antes, pero sin tocar código.
// ============================================

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function productCardHTML(p){
  const agotadoClass = p.in_stock ? '' : ' agotado';
  const waText = encodeURIComponent(`Hola, me interesa: ${p.name}`);
  return `
    <div class="product-card${agotadoClass}" data-category="${escapeHtml(p.category)}" data-name="${escapeHtml(p.name)}" data-price="${escapeHtml(p.price)}">
      <div class="img-wrap"><img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy"></div>
      <div class="pc-body">
        <h4>${escapeHtml(p.name)}</h4>
        <span class="price">${escapeHtml(p.price)}</span>
        <button class="pc-add" type="button">+ Agregar al pedido</button>
        <span class="sold-out-badge">Agotado por ahora</span>
      </div>
    </div>
  `;
}

async function GOT_loadProducts(){
  const grid = document.getElementById('productGrid');
  const loadingNote = document.getElementById('loadingNote');
  if(!grid) return;

  try{
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if(error) throw error;

    if(loadingNote) loadingNote.remove();

    if(!data || data.length === 0){
      grid.innerHTML = '<p class="loading-note">Aún no hay productos cargados. Vuelve pronto o consulta por WhatsApp.</p>';
      return;
    }

    grid.innerHTML = data.map(productCardHTML).join('');

    // avisa a script.js que ya puede enlazar botones, carrito y lightbox
    if(window.GOT_bindProductCards) window.GOT_bindProductCards();

  }catch(err){
    console.error('Error cargando productos:', err);
    if(loadingNote) loadingNote.textContent = 'No pudimos cargar el catálogo. Intenta recargar la página o escríbenos por WhatsApp.';
  }
}

document.addEventListener('DOMContentLoaded', GOT_loadProducts);
