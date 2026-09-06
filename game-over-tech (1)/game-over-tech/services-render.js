// ============================================
// GAME OVER TECH — Renderizado dinámico de servicios
// ============================================

function escapeHtmlSrv(str){
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function serviceCardHTML(s){
  const featuredClass = s.featured ? ' service-featured' : '';
  const badge = s.featured ? `<span class="service-badge">Oferta de lanzamiento</span>` : '';
  const img = s.image_url
    ? `<div class="service-img-wrap" data-desc="${escapeHtmlSrv(s.description)}" data-name="${escapeHtmlSrv(s.name)}"><img src="${escapeHtmlSrv(s.image_url)}" alt="${escapeHtmlSrv(s.name)}" loading="lazy"><span class="service-img-hint">Ver detalles</span></div>`
    : `<p class="service-desc-fallback">${escapeHtmlSrv(s.description)}</p>`;
  const waText = encodeURIComponent(`Hola, quiero cotizar: ${s.name}`);

  let priceHtml = '';
  if(s.price){
    if(s.price_old){
      priceHtml = `<div class="service-price"><span class="price-old">${escapeHtmlSrv(s.price_old)}</span><span class="price-new">${escapeHtmlSrv(s.price)}</span></div>`;
    }else{
      priceHtml = `<div class="service-price"><span class="price-new">${escapeHtmlSrv(s.price)}</span></div>`;
    }
  }

  return `
    <div class="service-card${featuredClass}">
      ${badge}
      ${img}
      <h4>${escapeHtmlSrv(s.name)}</h4>
      ${priceHtml}
      <a href="https://wa.me/56991668188?text=${waText}" class="service-cta" target="_blank" rel="noopener">Cotizar por WhatsApp →</a>
    </div>
  `;
}

async function GOT_loadServices(){
  const grid = document.getElementById('servicesGrid');
  if(!grid) return;

  try{
    const { data, error } = await supabaseClient
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if(error) throw error;

    if(!data || data.length === 0){
      grid.innerHTML = '<p class="loading-note">Aún no hay servicios cargados. Consulta por WhatsApp.</p>';
      return;
    }

    grid.innerHTML = data.map(serviceCardHTML).join('');
    GOT_bindServiceLightbox();

  }catch(err){
    console.error('Error cargando servicios:', err);
    grid.innerHTML = '<p class="loading-note">No pudimos cargar los servicios. Intenta recargar o escríbenos por WhatsApp.</p>';
  }
}

document.addEventListener('DOMContentLoaded', GOT_loadServices);

// ============ Lightbox de servicios (foto + descripción al hacer clic) ============
function GOT_bindServiceLightbox(){
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if(!lightbox) return;

  document.querySelectorAll('.service-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if(lightboxCaption){
        lightboxCaption.innerHTML = `<strong>${wrap.dataset.name}</strong><br>${wrap.dataset.desc}`;
        lightboxCaption.style.display = 'block';
      }
      lightbox.classList.add('open');
    });
  });
}
