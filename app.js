const STORAGE_KEY = "impactofit_saved_sheets";
const PROFILE_KEY = "impactofit_user_profile";
const TIME_OPTIONS = [5, 10, 15, 20];
const activities = [
  { id: 1, title: "Calentamiento ligero", category: "Preparación", duration: "5 min", notes: "Caminata suave y movilidad articular." },
  { id: 2, title: "Saltos de tijera", category: "Cardio", duration: "45 seg", notes: "Aumenta ritmo cardiaco." },
  { id: 3, title: "Sentadillas", category: "Fuerza", duration: "3 series x 12", notes: "Enfoca glúteos y piernas." },
  { id: 4, title: "Plancha frontal", category: "Core", duration: "3 x 30 seg", notes: "Mantener columna neutra." },
  { id: 5, title: "Fondos en silla", category: "Fuerza", duration: "3 series x 10", notes: "Trabaja tríceps y pecho." },
  { id: 6, title: "Estiramiento de isquiotibiales", category: "Recuperación", duration: "2 min", notes: "Mantener respiración estable." },
  { id: 7, title: "Trote en el lugar", category: "Cardio", duration: "3 min", notes: "Mantener paso constante." },
  { id: 8, title: "Abdominales bicicleta", category: "Core", duration: "3 series x 20", notes: "Alternar hombro y rodilla opuestos." },
  { id: 9, title: "Estocadas alternas", category: "Fuerza", duration: "3 series x 12", notes: "Mantener rodilla alineada." },
  { id: 10, title: "Puente de glúteos", category: "Fuerza", duration: "3 series x 15", notes: "Aprieta glúteos al subir." },
  { id: 11, title: "Burpees", category: "Funcional/Cross", duration: "3 series x 10", notes: "Combina salto, plancha y flexión para fuerza y cardio." },
  { id: 12, title: "Kettlebell swing", category: "Funcional/Cross", duration: "3 series x 15", notes: "Activa cadena posterior y potencia de cadera." },
  { id: 13, title: "Mountain climbers", category: "Funcional/Cross", duration: "40 seg", notes: "Estimula core y resistencia cardiovascular." },
  { id: 14, title: "Push press", category: "Funcional/Cross", duration: "3 series x 10", notes: "Trabajo de hombros, piernas y explosividad." },
  { id: 15, title: "Wall balls", category: "Funcional/Cross", duration: "3 series x 12", notes: "Potencia fuerza localizada y coordinación." },
  { id: 16, title: "Box jumps", category: "Funcional/Cross", duration: "3 series x 10", notes: "Mejora explosividad y pliometría." },
  { id: 17, title: "Remo o burro de cara", category: "Funcional/Cross", duration: "500 m o 2 min", notes: "Progresión de resistencia total y técnica." }
];

const state = {
  currentSheet: [],
  savedSheets: loadSheets(),
  customActivities: loadCustomActivities(),
  filter: "",
  filterActivities: "",
  activityTimeSelection: Object.fromEntries(activities.map((activity) => [activity.id, 5])),
  editingSheetIndex: null,
  editingActivityIndex: null,
  userProfile: loadProfile()
};

// ELEMENTOS DEL DOM
// Navegación
const navButtons = document.querySelectorAll(".nav-item");

// Perfil
const saveProfileButton = document.getElementById("saveProfileButton");
const profileFullName = document.getElementById("profileFullName");
const profileMobile = document.getElementById("profileMobile");
const profileWebsite = document.getElementById("profileWebsite");
const profileInstagram = document.getElementById("profileInstagram");
const profileFacebook = document.getElementById("profileFacebook");
const profileLinkedin = document.getElementById("profileLinkedin");
const profilePreview = document.getElementById("profilePreview");
const profilePreviewContent = document.getElementById("profilePreviewContent");

// Nuevo Hoja
const activityList = document.getElementById("activityList");
const currentSheetElement = document.getElementById("currentSheet");
const searchInput = document.getElementById("searchInput");
const sheetNameInput = document.getElementById("sheetNameInput");
const saveSheetButton = document.getElementById("saveSheetButton");
const duplicateSheetButton = document.getElementById("duplicateSheetButton");
const shareWhatsappButton = document.getElementById("shareWhatsappButton");
const clearSheetButton = document.getElementById("clearSheetButton");

// Actividades
const activityListFull = document.getElementById("activityListFull");
const searchInputActivities = document.getElementById("searchInputActivities");
const savedSheetsElement = document.getElementById("savedSheets");
const savedCategoryFilter = document.getElementById("savedCategoryFilter");
const savedSortOrder = document.getElementById("savedSortOrder");
const exportSheetsButton = document.getElementById("exportSheetsButton");
const importSheetsButton = document.getElementById("importSheetsButton");
const importFileInput = document.getElementById("importFileInput");

// Agregar Actividad Propia
const customTitleInput = document.getElementById("customTitle");
const customCategoryInput = document.getElementById("customCategory");
const customDurationInput = document.getElementById("customDuration");
const customNotesInput = document.getElementById("customNotes");
const addCustomActivityButton = document.getElementById("addCustomActivityButton");
const customActivitiesList = document.getElementById("customActivitiesList");

// Otros
const sheetDurationLabel = document.getElementById("sheetDuration");
const sheetStatsLabel = document.getElementById("sheetStats");
const editModal = document.getElementById("editModal");
const editTitle = document.getElementById("editTitle");
const editCategory = document.getElementById("editCategory");
const editDuration = document.getElementById("editDuration");
const editPlannedTime = document.getElementById("editPlannedTime");
const editNotes = document.getElementById("editNotes");
const closeModalButton = document.getElementById("closeModalButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const saveEditButton = document.getElementById("saveEditButton");

// FUNCIONES AUXILIARES
const normalizeText = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

// NAVEGACIÓN Y MÓDULOS
function switchModule(moduleName) {
  const modules = document.querySelectorAll(".module");
  const navItems = document.querySelectorAll(".nav-item");
  
  modules.forEach(m => m.classList.remove("active"));
  navItems.forEach(btn => btn.classList.remove("active"));
  
  const targetModule = document.getElementById(`module-${moduleName}`);
  if (targetModule) {
    targetModule.classList.add("active");
  }
  
  const activeButton = document.querySelector(`[data-module="${moduleName}"]`);
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

// FUNCIONES DE PERFIL
function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProfile() {
  const profile = {
    fullName: profileFullName.value.trim(),
    mobile: profileMobile.value.trim(),
    website: profileWebsite.value.trim(),
    instagram: profileInstagram.value.trim(),
    facebook: profileFacebook.value.trim(),
    linkedin: profileLinkedin.value.trim()
  };
  
  state.userProfile = profile;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  renderProfilePreview();
}

function renderProfilePreview() {
  const profile = state.userProfile;
  const hasProfile = profile.fullName || profile.mobile || profile.website;
  
  if (hasProfile) {
    profilePreview.classList.remove("hidden");
    
    let html = `
      ${profile.fullName ? `<div class="profile-preview-item"><strong>Nombre:</strong> <span>${profile.fullName}</span></div>` : ""}
      ${profile.mobile ? `<div class="profile-preview-item"><strong>Móvil:</strong> <span><a href="tel:${profile.mobile}">${profile.mobile}</a></span></div>` : ""}
      ${profile.website ? `<div class="profile-preview-item"><strong>Web:</strong> <span><a href="${profile.website}" target="_blank">${profile.website}</a></span></div>` : ""}
    `;
    
    if (profile.instagram || profile.facebook || profile.linkedin) {
      html += `<div class="profile-preview-item"><strong>Redes:</strong>`;
      html += `<div class="profile-preview-social">`;
      if (profile.instagram) html += `<a href="https://instagram.com/${profile.instagram}" target="_blank">Instagram</a>`;
      if (profile.facebook) html += `<a href="https://facebook.com/${profile.facebook}" target="_blank">Facebook</a>`;
      if (profile.linkedin) html += `<a href="https://linkedin.com/in/${profile.linkedin}" target="_blank">LinkedIn</a>`;
      html += `</div></div>`;
    }
    
    profilePreviewContent.innerHTML = html;
  } else {
    profilePreview.classList.add("hidden");
  }
}

function loadProfileForm() {
  const profile = state.userProfile;
  profileFullName.value = profile.fullName || "";
  profileMobile.value = profile.mobile || "";
  profileWebsite.value = profile.website || "";
  profileInstagram.value = profile.instagram || "";
  profileFacebook.value = profile.facebook || "";
  profileLinkedin.value = profile.linkedin || "";
  renderProfilePreview();
}

// FUNCIONES DE ACTIVIDADES PERSONALIZADAS
function loadCustomActivities() {
  try {
    return JSON.parse(localStorage.getItem("impactofit_custom_activities")) || [];
  } catch {
    return [];
  }
}

function saveCustomActivitiesToStorage() {
  localStorage.setItem("impactofit_custom_activities", JSON.stringify(state.customActivities));
}

function addCustomActivity() {
  const title = customTitleInput.value.trim();
  const category = customCategoryInput.value.trim();
  const duration = customDurationInput.value.trim();
  const notes = customNotesInput.value.trim();

  if (!title || !category || !duration) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const newActivity = {
    id: Date.now(),
    title,
    category,
    duration,
    notes,
    custom: true
  };

  state.customActivities.push(newActivity);
  saveCustomActivitiesToStorage();
  
  customTitleInput.value = "";
  customCategoryInput.value = "";
  customDurationInput.value = "";
  customNotesInput.value = "";
  
  renderCustomActivitiesList();
}

function renderCustomActivitiesList() {
  customActivitiesList.innerHTML = "";
  if (!state.customActivities.length) {
    customActivitiesList.innerHTML = `<div class="card"><p>Aún no hay actividades personalizadas. ¡Crea una!</p></div>`;
    return;
  }

  state.customActivities.forEach((activity) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="activity-title">
          <span class="material-icons activity-icon">star</span>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-meta">
          <span class="badge">${activity.category}</span>
          <span>${activity.duration}</span>
        </div>
        <p>${activity.notes}</p>
      </div>
      <div class="sheet-item-actions">
        <button class="secondary" data-tooltip="Eliminar actividad personalizada"><span class="material-icons">delete</span>Eliminar</button>
      </div>
    `;
    
    const deleteBtn = card.querySelector("button");
    deleteBtn.addEventListener("click", () => {
      state.customActivities = state.customActivities.filter(a => a.id !== activity.id);
      saveCustomActivitiesToStorage();
      renderCustomActivitiesList();
    });
    
    customActivitiesList.appendChild(card);
  });
}

// FUNCIONES DE HOJAS
function loadSheets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function persistSheets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedSheets));
}

// FUNCIONES DE BÚSQUEDA Y RENDERIZADO
const updateFilter = () => {
  state.filter = normalizeText(searchInput.value.trim());
  renderActivityList();
};

const updateFilterActivities = () => {
  state.filterActivities = normalizeText(searchInputActivities.value.trim());
  renderActivityListFull();
};

searchInput.addEventListener("input", updateFilter);
searchInput.addEventListener("keyup", updateFilter);
searchInputActivities.addEventListener("input", updateFilterActivities);
searchInputActivities.addEventListener("keyup", updateFilterActivities);

function renderActivityList() {
  const allActivities = [...activities, ...state.customActivities];
  const filtered = allActivities.filter((activity) => {
    const text = normalizeText(`${activity.title} ${activity.category} ${activity.notes}`);
    return text.includes(state.filter);
  });
  
  activityList.innerHTML = "";
  if (!filtered.length) {
    activityList.innerHTML = `<div class="card"><p>No se encontraron actividades.</p></div>`;
    return;
  }

  filtered.forEach((activity) => {
    const selectedTime = state.activityTimeSelection[activity.id] || 5;
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="activity-title">
          <span class="material-icons activity-icon">${activity.custom ? "star" : "fitness_center"}</span>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-meta">
          <span class="badge">${activity.category}</span>
          <span>${activity.duration}</span>
        </div>
        <p>${activity.notes}</p>
      </div>
      <div class="activity-actions">
        <label class="time-label">
          <span>Tiempo</span>
          <select data-activity-id="${activity.id}">
            ${TIME_OPTIONS.map((minutes) => `<option value="${minutes}" ${minutes === selectedTime ? "selected" : ""}>${minutes} min</option>`).join("")}
          </select>
        </label>
        <button class="primary" data-tooltip="Agregar esta actividad a la hoja"><span class="material-icons">add</span>Agregar</button>
      </div>
    `;

    const timeSelect = card.querySelector("select");
    timeSelect.addEventListener("change", (event) => {
      const activityId = Number(event.target.dataset.activityId);
      state.activityTimeSelection[activityId] = Number(event.target.value);
    });

    card.querySelector("button").addEventListener("click", () => addToSheet(activity));
    activityList.appendChild(card);
  });
}

function renderActivityListFull() {
  const allActivities = [...activities, ...state.customActivities];
  const filtered = allActivities.filter((activity) => {
    const text = normalizeText(`${activity.title} ${activity.category} ${activity.notes}`);
    return text.includes(state.filterActivities);
  });
  
  activityListFull.innerHTML = "";
  if (!filtered.length) {
    activityListFull.innerHTML = `<div class="card"><p>No se encontraron actividades.</p></div>`;
    return;
  }

  filtered.forEach((activity) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="activity-title">
          <span class="material-icons activity-icon">${activity.custom ? "star" : "fitness_center"}</span>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-meta">
          <span class="badge">${activity.category}</span>
          <span>${activity.duration}</span>
        </div>
        <p>${activity.notes}</p>
      </div>
    `;
    
    activityListFull.appendChild(card);
  });
}

function addToSheet(activity) {
  const selectedTime = state.activityTimeSelection[activity.id] || 5;
  state.currentSheet.push({
    ...activity,
    plannedTime: selectedTime
  });
  renderCurrentSheet();
  saveCurrentSheetIfLoaded();
  switchModule("new-sheet");
}

function renderCurrentSheet() {
  currentSheetElement.innerHTML = "";
  if (!state.currentSheet.length) {
    currentSheetElement.innerHTML = `<div class="card"><p>Aún no hay actividades en esta hoja.</p></div>`;
    updateSheetDuration();
    updateSheetStats();
    return;
  }

  state.currentSheet.forEach((activity, index) => {
    const plannedTime = activity.plannedTime ? `${activity.plannedTime} min` : "Sin tiempo";
    const card = document.createElement("article");
    card.className = "card sheet-card";
    card.innerHTML = `
      <div>
        <div class="activity-title">
          <span class="material-icons activity-icon">${activity.custom ? "star" : "fitness_center"}</span>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-meta">
          <span class="badge">${activity.category}</span>
          <span>${activity.duration}</span>
          <span class="badge planned-time">${plannedTime}</span>
        </div>
        <p>${activity.notes}</p>
      </div>
      <div class="sheet-item-actions">
        <button class="secondary" data-tooltip="Editar la actividad en esta hoja"><span class="material-icons">edit</span>Editar</button>
        <button class="secondary" data-tooltip="Eliminar la actividad de esta hoja"><span class="material-icons">delete</span>Eliminar</button>
      </div>
    `;
    
    const [editButton, deleteButton] = card.querySelectorAll("button");
    editButton.addEventListener("click", () => editSheetItem(index));
    deleteButton.addEventListener("click", () => removeFromSheet(index));
    currentSheetElement.appendChild(card);
  });
  
  updateSheetDuration();
  updateSheetStats();
}

function updateSheetDuration() {
  const totalMinutes = state.currentSheet.reduce((sum, activity) => {
    const minutes = parseInt(activity.plannedTime) || 0;
    return sum + minutes;
  }, 0);
  
  sheetDurationLabel.textContent = `Duración total: ${totalMinutes} min`;
}

function updateSheetStats() {
  const totalActivities = state.currentSheet.length;
  const categories = Array.from(new Set(state.currentSheet.map((activity) => activity.category || "General")));
  sheetStatsLabel.textContent = `Total de actividades: ${totalActivities} · Categorías: ${categories.length}`;
  clearSheetButton.style.display = totalActivities ? "inline-flex" : "none";
}

function removeFromSheet(index) {
  state.currentSheet.splice(index, 1);
  renderCurrentSheet();
  saveCurrentSheetIfLoaded();
}

function editSheetItem(index) {
  const activity = state.currentSheet[index];
  state.editingActivityIndex = index;
  
  editTitle.value = activity.title;
  editCategory.value = activity.category;
  editDuration.value = activity.duration;
  editPlannedTime.value = activity.plannedTime || 5;
  editNotes.value = activity.notes;
  
  editModal.classList.remove("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  state.editingActivityIndex = null;
}

function saveEditModal() {
  if (state.editingActivityIndex === null) return;
  
  const activity = state.currentSheet[state.editingActivityIndex];
  activity.title = editTitle.value.trim();
  activity.category = editCategory.value.trim();
  activity.duration = editDuration.value.trim();
  activity.plannedTime = Number(editPlannedTime.value);
  activity.notes = editNotes.value.trim();
  
  renderCurrentSheet();
  saveCurrentSheetIfLoaded();
  closeEditModal();
}

function saveCurrentSheetIfLoaded() {
  if (state.editingSheetIndex !== null) {
    state.savedSheets[state.editingSheetIndex].activities = state.currentSheet;
    persistSheets();
  }
}

function saveSheet() {
  const name = sheetNameInput.value.trim() || `Hoja sin nombre`;
  
  const sheet = {
    name,
    activities: state.currentSheet,
    savedAt: new Date().toISOString(),
    userProfile: state.userProfile
  };
  
  state.savedSheets.push(sheet);
  persistSheets();
  
  state.currentSheet = [];
  sheetNameInput.value = "";
  state.editingSheetIndex = null;
  
  renderCurrentSheet();
  renderSavedSheets();
  renderActivityListFull();
  
  alert("¡Hoja guardada exitosamente!");
}

function duplicateCurrentSheet() {
  if (!state.currentSheet.length) {
    alert("No hay actividades para duplicar.");
    return;
  }
  
  const newSheet = state.currentSheet.map(activity => ({ ...activity }));
  state.currentSheet = newSheet;
  renderCurrentSheet();
}

function deleteSheet(index) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta hoja?")) return;
  
  state.savedSheets.splice(index, 1);
  persistSheets();
  renderSavedSheets();
}

function loadSheet(index) {
  state.currentSheet = state.savedSheets[index].activities.map(activity => ({ ...activity }));
  sheetNameInput.value = state.savedSheets[index].name;
  state.editingSheetIndex = index;
  renderCurrentSheet();
  switchModule("new-sheet");
}

function renderSavedSheets() {
  savedSheetsElement.innerHTML = "";
  if (!state.savedSheets.length) {
    savedSheetsElement.innerHTML = `<div class="card"><p>No tienes hojas guardadas todavía.</p></div>`;
    populateSavedCategoryFilter();
    return;
  }

  const selectedCategory = savedCategoryFilter.value || "all";
  const selectedSort = savedSortOrder.value || "date_desc";

  const sheetsWithIndex = state.savedSheets
    .map((sheet, index) => ({ sheet, index }))
    .filter(({ sheet }) => {
      if (selectedCategory === "all") return true;
      return sheet.activities.some((activity) => activity.category === selectedCategory);
    });

  if (!sheetsWithIndex.length) {
    savedSheetsElement.innerHTML = `<div class="card"><p>No se encontraron hojas con esa categoría.</p></div>`;
    populateSavedCategoryFilter();
    return;
  }

  sheetsWithIndex.sort((a, b) => {
    if (selectedSort === "duration_desc") {
      return getSheetDuration(b.sheet) - getSheetDuration(a.sheet);
    }
    if (selectedSort === "duration_asc") {
      return getSheetDuration(a.sheet) - getSheetDuration(b.sheet);
    }
    const dateA = new Date(a.sheet.savedAt).getTime();
    const dateB = new Date(b.sheet.savedAt).getTime();
    if (selectedSort === "date_asc") return dateA - dateB;
    return dateB - dateA;
  });

  sheetsWithIndex.forEach(({ sheet, index }) => {
    const card = document.createElement("article");
    card.className = "card saved-card";
    const listItems = sheet.activities.map((activity) => `<li>${activity.title} (${activity.category}) — ${activity.plannedTime ? `${activity.plannedTime} min` : activity.duration}</li>`).join("");
    card.innerHTML = `
      <header>
        <div>
          <h3>${sheet.name}</h3>
          <small>Guardada: ${formatSavedAt(sheet.savedAt)}</small>
        </div>
        <div class="sheet-card-actions">
          <button class="primary" data-tooltip="Editar esta hoja"><span class="material-icons">edit</span>Editar</button>
          <button class="secondary" data-tooltip="Eliminar esta hoja"><span class="material-icons">delete</span>Eliminar</button>
        </div>
      </header>
      ${sheet.userProfile && sheet.userProfile.fullName ? `
        <div class="profile-header" style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 12px; margin-bottom: 12px;">
          <strong>${sheet.userProfile.fullName}</strong>
          ${sheet.userProfile.mobile ? `<span> • ${sheet.userProfile.mobile}</span>` : ""}
        </div>
      ` : ""}
      <ul>${listItems}</ul>
    `;

    const [editButton, deleteButton] = card.querySelectorAll("button");
    editButton.addEventListener("click", () => loadSheet(index));
    deleteButton.addEventListener("click", () => deleteSheet(index));
    savedSheetsElement.appendChild(card);
  });

  populateSavedCategoryFilter();
}

function getSheetDuration(sheet) {
  return sheet.activities.reduce((sum, activity) => sum + (parseInt(activity.plannedTime) || 0), 0);
}

function formatSavedAt(isoDate) {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Hoy a las ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer a las ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  return date.toLocaleDateString("es-AR");
}

function populateSavedCategoryFilter() {
  const categories = new Set();
  state.savedSheets.forEach((sheet) => {
    sheet.activities.forEach((activity) => {
      categories.add(activity.category);
    });
  });

  savedCategoryFilter.innerHTML = `<option value="all">Todas</option>`;
  Array.from(categories)
    .sort()
    .forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      savedCategoryFilter.appendChild(option);
    });
}

function shareSheetByWhatsapp() {
  if (!state.currentSheet.length) {
    alert("No hay actividades para compartir.");
    return;
  }

  const sheetName = sheetNameInput.value.trim() || "Hoja de entrenamiento";
  const profile = state.userProfile;
  
  let message = `🏋️ *${sheetName}*\n\n`;
  
  if (profile && profile.fullName) {
    message += `👤 *${profile.fullName}*\n`;
    if (profile.mobile) message += `📱 ${profile.mobile}\n`;
    if (profile.website) message += `🌐 ${profile.website}\n`;
    message += "\n---\n\n";
  }
  
  state.currentSheet.forEach((activity) => {
    const time = activity.plannedTime ? `${activity.plannedTime}min` : activity.duration;
    message += `• *${activity.title}* (${activity.category}) — ${time}\n  _${activity.notes}_\n\n`;
  });

  const totalTime = state.currentSheet.reduce((sum, a) => sum + (parseInt(a.plannedTime) || 0), 0);
  message += `\n⏱️ *Duración total: ${totalTime} min*`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
}

function startNewSheet() {
  if (state.currentSheet.length && !confirm("¿Deseas crear una nueva hoja? Perderás la hoja actual si no la guardas.")) {
    return;
  }
  
  state.currentSheet = [];
  sheetNameInput.value = "";
  state.editingSheetIndex = null;
  renderCurrentSheet();
  switchModule("new-sheet");
}

function exportSheets() {
  const dataStr = JSON.stringify(state.savedSheets, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `impactofit_hojas_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Formato inválido");

      state.savedSheets = [...state.savedSheets, ...imported];
      persistSheets();
      renderSavedSheets();
      alert("¡Hojas importadas exitosamente!");
    } catch {
      alert("Error al importar hojas. Verifica que el archivo sea válido.");
    }
  };
  reader.readAsText(file);
  
  event.target.value = "";
}

function updateFooterYear() {
  document.getElementById("footerYear").textContent = new Date().getFullYear();
}

// EVENT LISTENERS
// Navegación
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const module = button.dataset.module;
    switchModule(module);
  });
});

// Perfil
saveProfileButton.addEventListener("click", saveProfile);

// Nuevo Hoja
duplicateSheetButton.addEventListener("click", duplicateCurrentSheet);
shareWhatsappButton.addEventListener("click", shareSheetByWhatsapp);
clearSheetButton.addEventListener("click", () => {
  if (!state.currentSheet.length) return;
  if (!confirm("¿Deseas borrar la hoja actual?")) return;
  state.currentSheet = [];
  state.editingSheetIndex = null;
  sheetNameInput.value = "";
  renderCurrentSheet();
});
saveSheetButton.addEventListener("click", saveSheet);

// Actividades
savedCategoryFilter.addEventListener("change", () => renderSavedSheets());
savedSortOrder.addEventListener("change", () => renderSavedSheets());
exportSheetsButton.addEventListener("click", exportSheets);
importSheetsButton.addEventListener("click", () => importFileInput.click());
importFileInput.addEventListener("change", handleImportFile);

// Agregar Actividad Propia
addCustomActivityButton.addEventListener("click", addCustomActivity);

// Modal
closeModalButton.addEventListener("click", closeEditModal);
cancelEditButton.addEventListener("click", closeEditModal);
saveEditButton.addEventListener("click", saveEditModal);
editModal.addEventListener("click", (event) => {
  if (event.target === editModal) closeEditModal();
});

// INICIALIZACIÓN
updateFooterYear();
loadProfileForm();
renderActivityList();
renderActivityListFull();
renderCurrentSheet();
renderSavedSheets();
renderCustomActivitiesList();

function renderActivityList() {
  const filtered = activities.filter((activity) => {
    const text = normalizeText(`${activity.title} ${activity.category} ${activity.notes}`);
    return text.includes(state.filter);
  });
  activityList.innerHTML = "";
  if (!filtered.length) {
    activityList.innerHTML = `<div class="card"><p>No se encontraron actividades.</p></div>`;
    return;
  }

  filtered.forEach((activity) => {
    const selectedTime = state.activityTimeSelection[activity.id] || 5;
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="activity-title">
          <span class="material-icons activity-icon">fitness_center</span>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-meta">
          <span class="badge">${activity.category}</span>
          <span>${activity.duration}</span>
        </div>
        <p>${activity.notes}</p>
      </div>
      <div class="activity-actions">
        <label class="time-label">
          <span>Tiempo</span>
          <select data-activity-id="${activity.id}">
            ${TIME_OPTIONS.map((minutes) => `<option value="${minutes}" ${minutes === selectedTime ? "selected" : ""}>${minutes} min</option>`).join("")}
          </select>
        </label>
        <button class="primary" data-tooltip="Agregar esta actividad a la hoja"><span class="material-icons">add</span>Agregar</button>
      </div>
    `;

    const timeSelect = card.querySelector("select");
    timeSelect.addEventListener("change", (event) => {
      const activityId = Number(event.target.dataset.activityId);
      state.activityTimeSelection[activityId] = Number(event.target.value);
    });

    card.querySelector("button").addEventListener("click", () => addToSheet(activity));
    activityList.appendChild(card);
  });
}

function renderCurrentSheet() {
  currentSheetElement.innerHTML = "";
  if (!state.currentSheet.length) {
    currentSheetElement.innerHTML = `<div class="card"><p>Aún no hay actividades en esta hoja.</p></div>`;
    updateSheetDuration();
    updateSheetStats();
    return;
  }

  state.currentSheet.forEach((activity, index) => {
    const plannedTime = activity.plannedTime ? `${activity.plannedTime} min` : "Sin tiempo";
    const card = document.createElement("article");
    card.className = "card sheet-card";
    card.innerHTML = `
      <div>
        <div class="activity-title">
          <span class="material-icons activity-icon">fitness_center</span>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-meta">
          <span class="badge">${activity.category}</span>
          <span>${activity.duration}</span>
          <span class="badge planned-time">${plannedTime}</span>
        </div>
        <p>${activity.notes}</p>
      </div>
      <div class="sheet-item-actions">
        <button class="secondary" data-tooltip="Editar la actividad en esta hoja"><span class="material-icons">edit</span>Editar</button>
        <button class="secondary" data-tooltip="Eliminar la actividad de esta hoja"><span class="material-icons">delete</span>Eliminar</button>
      </div>
    `;
    const [editButton, deleteButton] = card.querySelectorAll("button");
    editButton.addEventListener("click", () => editSheetItem(index));
    deleteButton.addEventListener("click", () => removeFromSheet(index));
    currentSheetElement.appendChild(card);
  });
  updateSheetDuration();
  updateSheetStats();
}

function updateSheetStats() {
  const totalActivities = state.currentSheet.length;
  const categories = Array.from(new Set(state.currentSheet.map((activity) => activity.category || "General")));
  sheetStatsLabel.textContent = `Total de actividades: ${totalActivities} · Categorías: ${categories.length}`;
  clearSheetButton.style.display = totalActivities ? "inline-flex" : "none";
}

function renderSavedSheets() {
  savedSheetsElement.innerHTML = "";
  if (!state.savedSheets.length) {
    savedSheetsElement.innerHTML = `<div class="card"><p>No tienes hojas guardadas todavía.</p></div>`;
    populateSavedCategoryFilter();
    return;
  }

  const selectedCategory = savedCategoryFilter.value || "all";
  const selectedSort = savedSortOrder.value || "date_desc";

  const sheetsWithIndex = state.savedSheets
    .map((sheet, index) => ({ sheet, index }))
    .filter(({ sheet }) => {
      if (selectedCategory === "all") return true;
      return sheet.activities.some((activity) => activity.category === selectedCategory);
    });

  if (!sheetsWithIndex.length) {
    savedSheetsElement.innerHTML = `<div class="card"><p>No se encontraron hojas con esa categoría.</p></div>`;
    populateSavedCategoryFilter();
    return;
  }

  sheetsWithIndex.sort((a, b) => {
    if (selectedSort === "duration_desc") {
      return getSheetDuration(b.sheet) - getSheetDuration(a.sheet);
    }
    if (selectedSort === "duration_asc") {
      return getSheetDuration(a.sheet) - getSheetDuration(b.sheet);
    }
    const dateA = new Date(a.sheet.savedAt).getTime();
    const dateB = new Date(b.sheet.savedAt).getTime();
    if (selectedSort === "date_asc") return dateA - dateB;
    return dateB - dateA;
  });

  sheetsWithIndex.forEach(({ sheet, index }) => {
    const card = document.createElement("article");
    card.className = "card saved-card";
    const listItems = sheet.activities.map((activity) => `<li>${activity.title} (${activity.category}) — ${activity.plannedTime ? `${activity.plannedTime} min` : activity.duration}</li>`).join("");
    card.innerHTML = `
      <header>
        <div>
          <h3>${sheet.name}</h3>
          <small>Guardada: ${formatSavedAt(sheet.savedAt)}</small>
        </div>
        <div class="sheet-card-actions">
          <button class="primary" data-tooltip="Editar esta hoja"><span class="material-icons">edit</span>Editar</button>
          <button class="secondary" data-tooltip="Eliminar esta hoja"><span class="material-icons">delete</span>Eliminar</button>
        </div>
      </header>
      <ul>${listItems}</ul>
    `;

    const [editButton, deleteButton] = card.querySelectorAll("button");
    editButton.addEventListener("click", () => loadSheet(index));
    deleteButton.addEventListener("click", () => deleteSheet(index));
    savedSheetsElement.appendChild(card);
  });

  populateSavedCategoryFilter();
}

function addToSheet(activity) {
  const selectedTime = state.activityTimeSelection[activity.id] || 5;
  state.currentSheet.push({
    ...activity,
    plannedTime: selectedTime
  });
  renderCurrentSheet();
  saveCurrentSheetIfLoaded();
}

function removeFromSheet(index) {
  state.currentSheet.splice(index, 1);
  renderCurrentSheet();
  saveCurrentSheetIfLoaded();
}

function addCustomActivity() {
  const title = customTitleInput.value.trim();
  const category = customCategoryInput.value.trim() || "General";
  const duration = customDurationInput.value.trim() || "Personalizado";
  const notes = customNotesInput.value.trim() || "";

  if (!title) {
    alert("Ingresa el nombre de la actividad.");
    customTitleInput.focus();
    return;
  }

  const nextId = Math.max(...activities.map((activity) => activity.id)) + 1;
  const newActivity = {
    id: nextId,
    title,
    category,
    duration,
    notes
  };

  activities.unshift(newActivity);
  state.activityTimeSelection[newActivity.id] = 5;
  renderActivityList();
  customTitleInput.value = "";
  customCategoryInput.value = "";
  customDurationInput.value = "";
  customNotesInput.value = "";
  alert("Actividad propia agregada.");
}

function editSheetItem(index) {
  const activity = state.currentSheet[index];
  state.editingActivityIndex = index;
  editTitle.value = activity.title;
  editCategory.value = activity.category;
  editDuration.value = activity.duration;
  editPlannedTime.value = activity.plannedTime || 5;
  editNotes.value = activity.notes;
  editModal.classList.remove("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  state.editingActivityIndex = null;
}

function saveEditModal() {
  if (state.editingActivityIndex === null) return;

  const index = state.editingActivityIndex;
  const activity = state.currentSheet[index];
  const title = editTitle.value.trim();
  const category = editCategory.value.trim() || "General";
  const duration = editDuration.value.trim() || activity.duration;
  const plannedTime = Number(editPlannedTime.value) || 5;
  const notes = editNotes.value.trim();

  if (!title) {
    alert("Ingresa el nombre de la actividad.");
    editTitle.focus();
    return;
  }

  state.currentSheet[index] = {
    ...activity,
    title,
    category,
    duration,
    plannedTime,
    notes
  };
  renderCurrentSheet();
  closeEditModal();
  saveCurrentSheetIfLoaded();
}

function saveSheet(name) {
  const sheetData = {
    name,
    activities: state.currentSheet.map((activity) => ({ ...activity })),
    savedAt: new Date().toISOString()
  };

  if (state.editingSheetIndex !== null) {
    state.savedSheets[state.editingSheetIndex] = sheetData;
    state.editingSheetIndex = null;
    alert(`Hoja actualizada: ${name}`);
  } else {
    state.savedSheets.unshift(sheetData);
    alert(`Hoja guardada: ${name}`);
  }

  persistSheets();
  sheetNameInput.value = "";
  renderSavedSheets();
}

function updateSheetDuration() {
  const totalMinutes = state.currentSheet.reduce((sum, activity) => sum + (Number(activity.plannedTime) || 0), 0);
  sheetDurationLabel.textContent = `Duración total: ${totalMinutes} min`;
}

function shareSheetByWhatsapp() {
  if (!state.currentSheet.length) {
    alert("Agrega actividades a la hoja antes de compartir.");
    return;
  }

  const sheetName = sheetNameInput.value.trim() || "Hoja ImpactoFit";
  const doc = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
  const margin = 40;
  let y = 60;
  const lineHeight = 18;
  doc.setFontSize(18);
  doc.text(`Hoja: ${sheetName}`, margin, y);
  y += 30;
  doc.setFontSize(12);
  doc.text(`Duración total: ${state.currentSheet.reduce((sum, activity) => sum + (Number(activity.plannedTime) || 0), 0)} min`, margin, y);
  y += 24;
  doc.text("Actividades:", margin, y);
  y += 22;

  state.currentSheet.forEach((activity, index) => {
    const planned = activity.plannedTime ? `${activity.plannedTime} min` : activity.duration;
    const line = `${index + 1}. ${activity.title} (${activity.category}) — ${planned}`;
    const split = doc.splitTextToSize(line, 520);
    doc.text(split, margin, y);
    y += split.length * lineHeight;
    if (y > 720) {
      doc.addPage();
      y = margin;
    }
  });

  const filename = `${sheetName.replace(/[^a-zA-Z0-9_-]/g, "_") || "hoja"}.pdf`;
  const pdfBlob = doc.output("blob");
  const pdfFile = new File([pdfBlob], filename, { type: "application/pdf" });
  const message = `Te comparto mi hoja ImpactoFit: ${sheetName}`;

  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    navigator.share({ files: [pdfFile], title: sheetName, text: message }).catch(() => {
      downloadAndOpenWhatsapp(pdfBlob, filename, message);
    });
    return;
  }

  downloadAndOpenWhatsapp(pdfBlob, filename, message);
}

function downloadAndOpenWhatsapp(pdfBlob, filename, message) {
  const url = URL.createObjectURL(pdfBlob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + "\n\nHe descargado el PDF desde la app. Adjúntalo en WhatsApp manualmente.")}`;
  window.open(whatsappUrl, "_blank");
}

function saveCurrentSheetIfLoaded() {
  if (state.editingSheetIndex === null) return;
  const currentSheetCopy = state.currentSheet.map((activity) => ({ ...activity }));
  const existingSheet = state.savedSheets[state.editingSheetIndex];
  if (!existingSheet) return;
  state.savedSheets[state.editingSheetIndex] = {
    ...existingSheet,
    activities: currentSheetCopy,
    savedAt: new Date().toISOString()
  };
  persistSheets();
  renderSavedSheets();
}

function startNewSheet() {
  if (state.currentSheet.length || sheetNameInput.value || state.editingSheetIndex !== null) {
    const proceed = confirm("¿Deseas comenzar una nueva hoja en blanco? La hoja actual se reiniciará.");
    if (!proceed) return;
  }
  state.currentSheet = [];
  state.editingSheetIndex = null;
  sheetNameInput.value = "";
  renderCurrentSheet();
}

function getSheetDuration(sheet) {
  return sheet.activities.reduce((sum, activity) => sum + (Number(activity.plannedTime) || 0), 0);
}

function populateSavedCategoryFilter() {
  const categorySet = new Set();
  state.savedSheets.forEach((sheet) => {
    sheet.activities.forEach((activity) => categorySet.add(activity.category));
  });

  const categories = Array.from(categorySet).sort();
  const currentValue = savedCategoryFilter.value || "all";
  savedCategoryFilter.innerHTML = `<option value="all">Todas</option>${categories.map((category) => `<option value="${category}" ${category === currentValue ? "selected" : ""}>${category}</option>`).join("")}`;
}

function formatSavedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function loadSheet(index) {
  const sheet = state.savedSheets[index];
  state.currentSheet = sheet.activities.map((activity) => ({ ...activity }));
  state.editingSheetIndex = index;
  sheetNameInput.value = sheet.name;
  renderCurrentSheet();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteSheet(index) {
  if (!confirm("¿Eliminar esta hoja guardada?")) return;
  state.savedSheets.splice(index, 1);
  persistSheets();
  if (state.editingSheetIndex === index) {
    state.editingSheetIndex = null;
    sheetNameInput.value = "";
    state.currentSheet = [];
    renderCurrentSheet();
  }
  renderSavedSheets();
}

function exportSheets() {
  if (!state.savedSheets.length) {
    alert("No hay hojas guardadas para exportar.");
    return;
  }
  const blob = new Blob([JSON.stringify(state.savedSheets, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "impactofit-hojas.json";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function handleImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const importData = JSON.parse(reader.result);
      if (!Array.isArray(importData)) {
        throw new Error("Formato inválido");
      }

      const validSheets = importData.filter(
        (sheet) => sheet && typeof sheet.name === "string" && Array.isArray(sheet.activities)
      );

      if (!validSheets.length) {
        throw new Error("No se encontraron hojas válidas.");
      }

      state.savedSheets = [...validSheets, ...state.savedSheets];
      persistSheets();
      renderSavedSheets();
      alert(`Se importaron ${validSheets.length} hoja(s).`);
    } catch (error) {
      alert("Error al importar. Asegúrate de usar un archivo JSON válido.");
    } finally {
      importFileInput.value = "";
    }
  };
  reader.readAsText(file);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // No interrumpimos si el registro falla.
    });
  }
}

function updateFooterYear() {
  const yearElement = document.getElementById("footerYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

renderActivityList();
renderCurrentSheet();
renderSavedSheets();
registerServiceWorker();
updateFooterYear();
