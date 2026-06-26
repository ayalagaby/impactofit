const STORAGE_KEY = "impactofit_saved_sheets";
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
  filter: "",
  activityTimeSelection: Object.fromEntries(activities.map((activity) => [activity.id, 5])),
  editingSheetIndex: null,
  editingActivityIndex: null
};

const activityList = document.getElementById("activityList");
const currentSheetElement = document.getElementById("currentSheet");
const savedSheetsElement = document.getElementById("savedSheets");
const searchInput = document.getElementById("searchInput");
const sheetNameInput = document.getElementById("sheetNameInput");
const saveSheetButton = document.getElementById("saveSheetButton");
const duplicateSheetButton = document.getElementById("duplicateSheetButton");
const shareWhatsappButton = document.getElementById("shareWhatsappButton");
const newSheetButton = document.getElementById("newSheetButton");
const clearSheetButton = document.getElementById("clearSheetButton");
const customTitleInput = document.getElementById("customTitle");
const customCategoryInput = document.getElementById("customCategory");
const customDurationInput = document.getElementById("customDuration");
const customNotesInput = document.getElementById("customNotes");
const addCustomActivityButton = document.getElementById("addCustomActivityButton");
const exportSheetsButton = document.getElementById("exportSheetsButton");
const importSheetsButton = document.getElementById("importSheetsButton");
const importFileInput = document.getElementById("importFileInput");
const savedCategoryFilter = document.getElementById("savedCategoryFilter");
const savedSortOrder = document.getElementById("savedSortOrder");
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

const normalizeText = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const updateFilter = () => {
  state.filter = normalizeText(searchInput.value.trim());
  renderActivityList();
};

searchInput.addEventListener("input", updateFilter);
searchInput.addEventListener("keyup", updateFilter);

savedCategoryFilter.addEventListener("change", () => {
  renderSavedSheets();
});

savedSortOrder.addEventListener("change", () => {
  renderSavedSheets();
});

sheetNameInput.addEventListener("input", () => {
  if (state.editingSheetIndex !== null) {
    saveCurrentSheetIfLoaded();
  }
});

duplicateSheetButton.addEventListener("click", duplicateCurrentSheet);
shareWhatsappButton.addEventListener("click", shareSheetByWhatsapp);
newSheetButton.addEventListener("click", startNewSheet);

addCustomActivityButton.addEventListener("click", () => {
  addCustomActivity();
});

closeModalButton.addEventListener("click", closeEditModal);
cancelEditButton.addEventListener("click", closeEditModal);
saveEditButton.addEventListener("click", saveEditModal);
editModal.addEventListener("click", (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

saveSheetButton.addEventListener("click", () => {
  const name = sheetNameInput.value.trim();
  if (!name) {
    alert("Por favor ingresa un nombre para la hoja.");
    sheetNameInput.focus();
    return;
  }
  if (!state.currentSheet.length) {
    alert("La hoja está vacía. Agrega actividades antes de guardar.");
    return;
  }
  saveSheet(name);
});

clearSheetButton.addEventListener("click", () => {
  if (!state.currentSheet.length) return;
  if (!confirm("¿Deseas borrar la hoja actual?")) return;
  state.currentSheet = [];
  state.editingSheetIndex = null;
  sheetNameInput.value = "";
  renderCurrentSheet();
});

exportSheetsButton.addEventListener("click", () => {
  exportSheets();
});

importSheetsButton.addEventListener("click", () => {
  importFileInput.click();
});

importFileInput.addEventListener("change", (event) => {
  handleImportFile(event);
});

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
        <button class="primary"><span class="material-icons">add</span>Agregar</button>
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
        <button class="secondary"><span class="material-icons">edit</span>Editar</button>
        <button class="secondary"><span class="material-icons">delete</span>Eliminar</button>
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
          <button class="primary"><span class="material-icons">open_in_new</span>Abrir</button>
          <button class="secondary"><span class="material-icons">delete</span>Eliminar</button>
        </div>
      </header>
      <ul>${listItems}</ul>
    `;

    const [openButton, deleteButton] = card.querySelectorAll("button");
    openButton.addEventListener("click", () => loadSheet(index));
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
