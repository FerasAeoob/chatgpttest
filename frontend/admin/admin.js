const api = window.APP_CONFIG.API_BASE_URL;

const loginPanel = document.getElementById('loginPanel');
const adminApp = document.getElementById('adminApp');
const loginForm = document.getElementById('loginForm');
const adminStatus = document.getElementById('adminStatus');
const logoutBtn = document.getElementById('logoutBtn');
const categoryForm = document.getElementById('categoryForm');
const categoryAdminList = document.getElementById('categoryAdminList');
const placeForm = document.getElementById('placeForm');
const placeRows = document.getElementById('placeRows');
const placeCategorySelect = document.getElementById('placeCategorySelect');
const clearPlaceForm = document.getElementById('clearPlaceForm');
const totalPlaces = document.getElementById('totalPlaces');
const totalCategories = document.getElementById('totalCategories');

let categories = [];
let places = [];

const getToken = () => localStorage.getItem('adminToken');

const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` };
  return fetch(url, { ...options, headers });
};

const refreshDashboard = async () => {
  const [catRes, placeRes] = await Promise.all([fetch(`${api}/categories`), fetch(`${api}/places`)]);
  categories = await catRes.json();
  places = await placeRes.json();

  totalCategories.textContent = categories.length;
  totalPlaces.textContent = places.length;

  placeCategorySelect.innerHTML = categories.map((c) => `<option value="${c._id}">${c.nameEn}</option>`).join('');

  categoryAdminList.innerHTML = categories
    .map(
      (c) => `<p>${c.nameEn} (${c.slug}) - ${c.isActive ? 'Active' : 'Inactive'}
      <button onclick="toggleCategory('${c._id}', ${!c.isActive})">Toggle</button>
      <button class="danger" onclick="deleteCategory('${c._id}')">Delete</button></p>`
    )
    .join('');

  placeRows.innerHTML = places
    .map(
      (place) => `<tr>
      <td>${place.titleEn}</td>
      <td>${place.category?.nameEn || '-'}</td>
      <td>${place.isPublished ? 'Published' : 'Hidden'}</td>
      <td>
        <button onclick="editPlace('${place._id}')">Edit</button>
        <button onclick="togglePublish('${place._id}', ${!place.isPublished})">Toggle Publish</button>
        <button class="danger" onclick="deletePlace('${place._id}')">Delete</button>
      </td>
    </tr>`
    )
    .join('');
};

const setAuthenticatedUi = (isAuthenticated) => {
  loginPanel.hidden = isAuthenticated;
  adminApp.hidden = !isAuthenticated;
  adminStatus.textContent = isAuthenticated ? 'You are logged in as admin.' : 'Login to manage places, categories, and publication status.';
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  const res = await fetch(`${api}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    adminStatus.textContent = 'Login failed. Check credentials.';
    return;
  }

  const data = await res.json();
  localStorage.setItem('adminToken', data.token);
  setAuthenticatedUi(true);
  await refreshDashboard();
});

logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  setAuthenticatedUi(false);
});

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(categoryForm);
  const payload = {
    nameEn: formData.get('nameEn'),
    nameHe: formData.get('nameHe'),
    slug: formData.get('slug'),
    isActive: Boolean(formData.get('isActive'))
  };

  const res = await authFetch(`${api}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    categoryForm.reset();
    await refreshDashboard();
  }
});

placeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(placeForm);
  const placeId = formData.get('placeId');
  const method = placeId ? 'PUT' : 'POST';
  const endpoint = placeId ? `${api}/places/${placeId}` : `${api}/places`;

  if (!formData.get('mainImage')?.size && !placeId) {
    adminStatus.textContent = 'Main image is required for new places.';
    return;
  }

  const res = await authFetch(endpoint, {
    method,
    body: formData
  });

  if (res.ok) {
    placeForm.reset();
    placeForm.placeId.value = '';
    await refreshDashboard();
  } else {
    const error = await res.json();
    adminStatus.textContent = error.message || 'Failed to save place.';
  }
});

clearPlaceForm.addEventListener('click', () => {
  placeForm.reset();
  placeForm.placeId.value = '';
});

window.toggleCategory = async (id, isActive) => {
  await authFetch(`${api}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive })
  });
  await refreshDashboard();
};

window.deleteCategory = async (id) => {
  await authFetch(`${api}/categories/${id}`, { method: 'DELETE' });
  await refreshDashboard();
};

window.editPlace = (id) => {
  const place = places.find((p) => p._id === id);
  if (!place) return;

  placeForm.placeId.value = place._id;
  placeForm.titleEn.value = place.titleEn || '';
  placeForm.titleHe.value = place.titleHe || '';
  placeForm.descriptionEn.value = place.descriptionEn || '';
  placeForm.descriptionHe.value = place.descriptionHe || '';
  placeForm.locationName.value = place.locationName || '';
  placeForm.googleMapsEmbed.value = place.googleMapsEmbed || '';
  placeForm.openingHours.value = place.openingHours || '';
  placeForm.contactInfo.value = place.contactInfo || '';
  placeForm.priceInfo.value = place.priceInfo || '';
  placeForm.category.value = place.category?._id || '';
  placeForm.featured.checked = Boolean(place.featured);
  placeForm.isPublished.checked = Boolean(place.isPublished);
  adminStatus.textContent = `Editing ${place.titleEn}`;
};

window.togglePublish = async (id, isPublished) => {
  await authFetch(`${api}/places/${id}`, {
    method: 'PUT',
    body: new URLSearchParams({ isPublished })
  });
  await refreshDashboard();
};

window.deletePlace = async (id) => {
  await authFetch(`${api}/places/${id}`, { method: 'DELETE' });
  await refreshDashboard();
};

const boot = async () => {
  const token = getToken();
  if (!token) {
    setAuthenticatedUi(false);
    return;
  }

  setAuthenticatedUi(true);
  await refreshDashboard();
};

boot().catch(() => {
  setAuthenticatedUi(false);
});
