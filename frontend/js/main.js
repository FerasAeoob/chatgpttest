const api = window.APP_CONFIG.API_BASE_URL;
const uploads = window.APP_CONFIG.UPLOADS_BASE_URL;

const categoryList = document.getElementById('categoryList');
const categoryFilter = document.getElementById('categoryFilter');
const placesGrid = document.getElementById('placesGrid');
const searchInput = document.getElementById('searchInput');

let categories = [];
let places = [];

const toHtml = (str = '') => str.replace(/[&<>"']/g, (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[tag]));

const loadCategories = async () => {
  const res = await fetch(`${api}/categories`);
  categories = await res.json();

  categoryList.innerHTML = categories
    .filter((c) => c.isActive)
    .map((category) => `<div class="category-pill">${toHtml(category.nameEn)}</div>`)
    .join('');

  categoryFilter.innerHTML = `<option value="">All categories</option>${categories
    .map((category) => `<option value="${category._id}">${toHtml(category.nameEn)}</option>`)
    .join('')}`;
};

const placeCard = (place) => {
  const gallery = (place.gallery || []).slice(0, 4).map((img) => `<img src="${uploads}/${img}" alt="${toHtml(place.titleEn)}">`).join('');
  return `
    <article class="place-card">
      <img src="${uploads}/${place.mainImage}" alt="${toHtml(place.titleEn)}" loading="lazy">
      <div class="place-content">
        <h3>${toHtml(place.titleEn)}</h3>
        <p>${toHtml(place.descriptionEn)}</p>
        <p class="place-meta"><strong>Category:</strong> ${toHtml(place.category?.nameEn || 'Unknown')}</p>
        <p class="place-meta"><strong>Location:</strong> ${toHtml(place.locationName)}</p>
        <p class="place-meta"><strong>Hours:</strong> ${toHtml(place.openingHours)}</p>
        <p class="place-meta"><strong>Contact:</strong> ${toHtml(place.contactInfo)}</p>
        <p class="place-meta"><strong>Price:</strong> ${toHtml(place.priceInfo)}</p>
        <div class="gallery-row">${gallery}</div>
        <iframe class="place-embed" loading="lazy" src="${place.googleMapsEmbed}" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </article>
  `;
};

const renderPlaces = () => {
  const q = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = places.filter((place) => {
    const byName = place.titleEn.toLowerCase().includes(q);
    const byCategory = !category || place.category?._id === category;
    return byName && byCategory;
  });

  placesGrid.innerHTML = filtered.length
    ? filtered.map(placeCard).join('')
    : '<p>No places found for your filter.</p>';
};

const loadPlaces = async () => {
  const res = await fetch(`${api}/places?published=true`);
  places = await res.json();
  renderPlaces();
};

searchInput?.addEventListener('input', renderPlaces);
categoryFilter?.addEventListener('change', renderPlaces);

document.getElementById('year').textContent = new Date().getFullYear();

Promise.all([loadCategories(), loadPlaces()]).catch(() => {
  placesGrid.innerHTML = '<p>Could not load data. Please ensure backend API is running.</p>';
});
