// ============================================
// GAME OVER TECH — Categorías dinámicas
// Trae las categorías desde Supabase y arma:
// - el submenú "Productos" del nav (en TODAS las páginas)
// - las tarjetas de /categorias/
// - las pastillas de filtro de /productos/
// ============================================

// Íconos conocidos para las categorías originales.
// Cualquier categoría nueva que se agregue desde el admin usa el ícono genérico de abajo.
const CATEGORY_ICONS = {
  cargadores: '<rect x="6" y="2" width="8" height="20" rx="2"/><path d="M9 6h2"/><path d="M14 10h4v6h-4"/>',
  cables: '<path d="M4 8c4 4 12 4 16 0"/><path d="M4 16c4-4 12-4 16 0"/>',
  audifonos: '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1"/><rect x="17" y="13" width="4" height="6" rx="1"/>',
  teclados: '<rect x="2" y="7" width="20" height="11" rx="2"/><path d="M6 11h.01M9 11h.01M12 11h.01M15 11h.01M18 11h.01M8 15h8"/>',
  mouse: '<rect x="8" y="3" width="8" height="18" rx="4"/><path d="M12 3v6"/>',
  switch: '<rect x="3" y="6" width="18" height="12" rx="6"/><circle cx="8" cy="12" r="1.4"/><circle cx="16" cy="12" r="1.4"/>',
  accesorios: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>'
};
const GENERIC_ICON = '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/>';

function iconSvg(slug){
  const inner = CATEGORY_ICONS[slug] || GENERIC_ICON;
  return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${inner}</svg>`;
}

async function GOT_loadCategories(){
  const { data, error } = await supabaseClient
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if(error || !data){
    console.error('Error cargando categorías:', error);
    return [];
  }
  return data;
}

function renderNavSub(categories){
  const navSub = document.getElementById('navSub');
  if(!navSub) return;
  let html = `<li><a href="/productos/" class="nav-sub-link">Todos los productos</a></li>`;
  html += categories.map(c =>
    `<li><a href="/productos/?cat=${encodeURIComponent(c.slug)}" class="nav-sub-link">${c.label}</a></li>`
  ).join('');
  navSub.innerHTML = html;
}

function renderCatGrid(categories){
  const grid = document.getElementById('catGrid');
  if(!grid) return;
  grid.innerHTML = categories.map(c => `
    <a class="cat-card" href="/productos/?cat=${encodeURIComponent(c.slug)}">
      ${iconSvg(c.slug)}
      <h4>${c.label}</h4><p>${c.description || ''}</p>
    </a>
  `).join('');
}

function renderFilterBar(categories){
  const bar = document.getElementById('filterBar');
  if(!bar) return;
  let html = `<button class="filter-pill active" data-filter="todos">Todos</button>`;
  html += categories.map(c =>
    `<button class="filter-pill" data-filter="${c.slug}">${c.label}</button>`
  ).join('');
  bar.innerHTML = html;

  // vuelve a enlazar los clics de los filtros (script.js ya no los encuentra,
  // porque recién ahora existen en el DOM)
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      if(window.applyFilter) window.applyFilter(pill.dataset.filter);
      const url = new URL(window.location);
      if(pill.dataset.filter === 'todos'){ url.searchParams.delete('cat'); }
      else{ url.searchParams.set('cat', pill.dataset.filter); }
      window.history.replaceState({}, '', url);
    });
  });

  // aplica el filtro de la URL apenas existen las pastillas
  const params = new URLSearchParams(window.location.search);
  if(window.applyFilter) window.applyFilter(params.get('cat') || 'todos');
}

document.addEventListener('DOMContentLoaded', async () => {
  const categories = await GOT_loadCategories();
  renderNavSub(categories);
  renderCatGrid(categories);
  renderFilterBar(categories);
});
