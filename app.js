const STORAGE_KEY = 'health-check-collector-pwa-v1';
const PDF_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

const indicatorDictionary = [
  ['hgb', 'Hemoglobin', 'Full Blood Count', ['HGB', 'HB', 'HEMOGLOBIN']],
  ['rbc', 'Red Blood Cell Count', 'Full Blood Count', ['RBC']],
  ['hct', 'Hematocrit', 'Full Blood Count', ['HCT']],
  ['mcv', 'MCV', 'Full Blood Count', ['MCV']],
  ['mch', 'MCH', 'Full Blood Count', ['MCH']],
  ['mchc', 'MCHC', 'Full Blood Count', ['MCHC']],
  ['rdw_cv', 'RDW-CV', 'Full Blood Count', ['RDW-CV', 'RDW CV']],
  ['rdw_sd', 'RDW-SD', 'Full Blood Count', ['RDW-SD', 'RDW SD']],
  ['plt', 'Platelet Count', 'Full Blood Count', ['PLT', 'PLATELET']],
  ['mpv', 'MPV', 'Full Blood Count', ['MPV']],
  ['wbc', 'White Blood Cell Count', 'Full Blood Count', ['WBC']],
  ['nlr', 'Neutrophil Lymphocyte Ratio', 'Full Blood Count', ['NEUTROPHILS LYMPHOCYTE RATIO', 'NLR']],
  ['neu_percent', 'Neutrophils %', 'Auto Differential', ['NEU%']],
  ['neu', 'Neutrophils', 'Auto Differential', ['NEU']],
  ['lym_percent', 'Lymphocytes %', 'Auto Differential', ['LYM%']],
  ['lym', 'Lymphocytes', 'Auto Differential', ['LYM']],
  ['mono_percent', 'Monocytes %', 'Auto Differential', ['MONO%']],
  ['mono', 'Monocytes', 'Auto Differential', ['MONO']],
  ['eos_percent', 'Eosinophils %', 'Auto Differential', ['EOS%']],
  ['eos', 'Eosinophils', 'Auto Differential', ['EOS']],
  ['baso_percent', 'Basophils %', 'Auto Differential', ['BASO%']],
  ['baso', 'Basophils', 'Auto Differential', ['BASO']],
  ['ig', 'Immature Granulocytes', 'Auto Differential', ['IG']],
  ['ig_percent', 'Immature Granulocytes %', 'Auto Differential', ['IG%']],
  ['nrbc', 'NRBC', 'Auto Differential', ['NRBC']],
  ['nrbc_percent', 'NRBC %', 'Auto Differential', ['NRBC%']],
  ['pt_test', 'PT Test', 'Coagulation', ['PT TEST']],
  ['pt_control', 'PT Control', 'Coagulation', ['PT CONTROL']],
  ['pt_inr', 'PT INR', 'Coagulation', ['PT INR', 'INR']],
  ['aptt_test', 'APTT Test', 'Coagulation', ['APTT TEST']],
  ['aptt_control', 'APTT Control', 'Coagulation', ['APTT CONTROL']],
  ['aptt_ratio', 'APTT Ratio', 'Coagulation', ['APTT RATIO']],
  ['sodium', 'Sodium', 'Kidney & Electrolytes', ['SODIUM', 'NA']],
  ['potassium', 'Potassium', 'Kidney & Electrolytes', ['POTASSIUM', 'K']],
  ['chloride', 'Chloride', 'Kidney & Electrolytes', ['CHLORIDE', 'CL']],
  ['urea', 'Urea', 'Kidney & Electrolytes', ['UREA']],
  ['creatinine', 'Creatinine', 'Kidney & Electrolytes', ['CREATININE']],
  ['egfr', 'eGFR CKD-EPI 2021', 'Kidney & Electrolytes', ['EGFR CKD-EPI 2021', 'EGFR']],
  ['total_protein', 'Total Protein', 'Liver & Protein', ['TOTAL PROTEIN']],
  ['albumin', 'Albumin', 'Liver & Protein', ['ALBUMIN']],
  ['globulin', 'Globulin', 'Liver & Protein', ['GLOBULIN']],
  ['total_bilirubin', 'Total Bilirubin', 'Liver & Protein', ['TOTAL BILIRUBIN']],
  ['alt', 'ALT', 'Liver & Protein', ['ALT', 'SGPT']],
  ['ast', 'AST', 'Liver & Protein', ['AST', 'SGOT']],
  ['alp', 'ALP', 'Liver & Protein', ['ALP']],
  ['calcium', 'Calcium', 'Minerals & Enzymes', ['CALCIUM']],
  ['adjusted_calcium', 'Adjusted Calcium', 'Minerals & Enzymes', ['ADJUSTED CALCIUM']],
  ['phosphate', 'Phosphate', 'Minerals & Enzymes', ['PHOSPHATE']],
  ['magnesium', 'Magnesium', 'Minerals & Enzymes', ['MAGNESIUM']],
  ['creatine_kinase', 'Creatine Kinase', 'Minerals & Enzymes', ['CREATINE KINASE', 'CK']],
  ['ldh', 'LDH', 'Minerals & Enzymes', ['LDH']],
  ['triglycerides', 'Triglycerides', 'Lipids', ['TRIGLYCERIDES', 'TG']],
  ['cholesterol', 'Total Cholesterol', 'Lipids', ['CHOLESTEROL', 'TOTAL CHOLESTEROL']],
  ['hdl_cholesterol', 'HDL Cholesterol', 'Lipids', ['HDL CHOLESTEROL', 'HDL']],
  ['ldl_cholesterol', 'LDL Cholesterol', 'Lipids', ['LDL CHOLESTEROL', 'LDL']],
  ['non_hdl_cholesterol', 'Non-HDL Cholesterol', 'Lipids', ['NON HDL-CHOL', 'NON-HDL CHOLESTEROL', 'NON HDL CHOL']],
  ['glucose', 'Glucose', 'Glucose', ['GLUCOSE', 'GLUCOSE (T)']],
  ['fasting_plasma_glucose', 'Fasting Plasma Glucose', 'Glucose', ['FASTING PLASMA GLUCOSE', 'FPG']],
].map(([key, displayName, category, aliases]) => ({ key, displayName, category, aliases }));

const state = {
  profiles: [],
  selectedProfileId: null,
  draftPages: [],
  draftResults: [],
  editingProfileId: null,
  editingReportId: null,
  activeReportId: null,
  waitingServiceWorker: null,
};

const $ = (id) => document.getElementById(id);

const indicatorDescriptions = {
  hgb: 'Hemoglobin is the oxygen-carrying protein in red blood cells. It helps screen for anemia, bleeding, dehydration, and some blood disorders.',
  rbc: 'Red blood cell count measures how many red blood cells are present. It is interpreted together with hemoglobin, hematocrit, and red cell indices.',
  hct: 'Hematocrit estimates the proportion of blood made up of red blood cells. It can rise with dehydration and fall with anemia or blood loss.',
  mcv: 'MCV shows the average size of red blood cells. It helps classify anemia as small-cell, normal-cell, or large-cell.',
  mch: 'MCH estimates the amount of hemoglobin in each red blood cell. It is usually interpreted with MCV and MCHC.',
  mchc: 'MCHC estimates hemoglobin concentration inside red blood cells. It helps describe red cell color and anemia patterns.',
  rdw_cv: 'RDW-CV shows variation in red blood cell size. A higher value can suggest mixed cell sizes from anemia, recovery, or nutrient deficiency.',
  rdw_sd: 'RDW-SD is another measure of red blood cell size variation. It is interpreted together with MCV and other blood count results.',
  plt: 'Platelet count measures cells involved in clotting. Low or high results can relate to bleeding risk, inflammation, infection, or bone marrow activity.',
  mpv: 'MPV shows average platelet size. It may give context about platelet production and turnover.',
  wbc: 'White blood cell count measures immune cells. It may increase with infection or inflammation and decrease with some viral illnesses, medicines, or marrow problems.',
  nlr: 'Neutrophil-to-lymphocyte ratio compares two white cell groups. It is sometimes used as a general inflammation or stress marker.',
  neu_percent: 'Neutrophils percentage shows the proportion of white cells that are neutrophils, commonly involved in bacterial infection and inflammation.',
  neu: 'Absolute neutrophil count measures neutrophils directly. It is important for infection risk and immune function.',
  lym_percent: 'Lymphocytes percentage shows the proportion of white cells that are lymphocytes, commonly involved in viral and immune responses.',
  lym: 'Absolute lymphocyte count measures lymphocytes directly. It is interpreted with the full white cell pattern.',
  mono_percent: 'Monocytes percentage shows the proportion of white cells that are monocytes, which help clean up infection and inflammation.',
  mono: 'Absolute monocyte count measures monocytes directly. It can rise with some infections, inflammation, and recovery phases.',
  eos_percent: 'Eosinophils percentage shows the proportion of white cells linked with allergies, asthma, parasites, and some drug reactions.',
  eos: 'Absolute eosinophil count measures eosinophils directly. It gives clearer context than percentage alone.',
  baso_percent: 'Basophils percentage shows a small white cell group involved in allergic and inflammatory signaling.',
  baso: 'Absolute basophil count measures basophils directly. Changes are usually interpreted with the whole blood count.',
  ig: 'Immature granulocytes are early white blood cells. Their presence can suggest marrow response to infection, inflammation, or stress.',
  ig_percent: 'Immature granulocyte percentage shows the proportion of early white cells among white blood cells.',
  nrbc: 'NRBC means nucleated red blood cells. They are usually not seen in adult peripheral blood and need clinical context if present.',
  nrbc_percent: 'NRBC percentage shows nucleated red blood cells relative to white blood cells.',
  pt_test: 'PT measures how long blood takes to clot through the extrinsic clotting pathway. It is often used with INR.',
  pt_control: 'PT control is the laboratory comparison value used to calculate and interpret PT results.',
  pt_inr: 'INR standardizes PT results between laboratories. It is commonly used to monitor warfarin and clotting tendency.',
  aptt_test: 'APTT measures clotting time through the intrinsic pathway. It can help assess bleeding disorders or heparin effect.',
  aptt_control: 'APTT control is the laboratory comparison value used to interpret APTT.',
  aptt_ratio: 'APTT ratio compares the patient APTT with the laboratory control value.',
  sodium: 'Sodium is a major blood electrolyte that helps control fluid balance, nerves, and muscles.',
  potassium: 'Potassium is an electrolyte important for heart rhythm, nerves, and muscles.',
  chloride: 'Chloride is an electrolyte that helps maintain fluid and acid-base balance.',
  urea: 'Urea is a waste product from protein metabolism. It is interpreted with creatinine, hydration, and kidney function.',
  creatinine: 'Creatinine is a waste product from muscle metabolism. It is commonly used to assess kidney filtration.',
  egfr: 'eGFR estimates kidney filtering capacity using creatinine, age, and sex. Persistent low values may suggest chronic kidney disease.',
  total_protein: 'Total protein measures albumin and globulin together. It reflects nutrition, liver function, inflammation, and hydration context.',
  albumin: 'Albumin is a major blood protein made by the liver. It helps assess nutrition, liver function, kidney loss, and inflammation.',
  globulin: 'Globulin includes immune and carrier proteins. It is interpreted with albumin and total protein.',
  total_bilirubin: 'Bilirubin comes from red blood cell breakdown. Higher levels can relate to liver, bile duct, or red cell problems.',
  alt: 'ALT is a liver enzyme. Higher values can suggest liver cell irritation or injury.',
  ast: 'AST is an enzyme found in liver, muscle, and other tissues. It is interpreted with ALT and clinical context.',
  alp: 'ALP is an enzyme linked with bile ducts and bone. Higher values may relate to liver bile flow or bone activity.',
  calcium: 'Calcium is important for bones, muscles, nerves, and heart function.',
  adjusted_calcium: 'Adjusted calcium estimates calcium after correcting for albumin level, giving a clearer view of biologically relevant calcium.',
  phosphate: 'Phosphate supports bones, energy metabolism, and cell function. It is interpreted with kidney and mineral results.',
  magnesium: 'Magnesium supports muscle, nerve, heart, and enzyme function.',
  creatine_kinase: 'Creatine kinase is an enzyme released from muscle. Higher values can occur after muscle injury, exercise, or some medicines.',
  ldh: 'LDH is an enzyme found in many tissues. It can rise with tissue damage but is not specific by itself.',
  triglycerides: 'Triglycerides are blood fats used for energy storage. Higher values can increase cardiovascular and pancreatitis risk.',
  cholesterol: 'Total cholesterol measures all cholesterol particles together. It is interpreted with HDL, LDL, non-HDL, and risk factors.',
  hdl_cholesterol: 'HDL cholesterol is often called protective cholesterol because it helps remove cholesterol from blood vessels.',
  ldl_cholesterol: 'LDL cholesterol is a key treatment target because higher values increase cardiovascular risk.',
  non_hdl_cholesterol: 'Non-HDL cholesterol includes LDL and other atherogenic particles. It can be useful for cardiovascular risk assessment.',
  glucose: 'Glucose measures blood sugar. It helps screen for diabetes, low sugar, and metabolic control.',
  fasting_plasma_glucose: 'Fasting plasma glucose is blood sugar after fasting. It is used to screen for diabetes and prediabetes.',
};

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  wireEvents();
  render();
  registerServiceWorker();
});

function wireEvents() {
  $('addProfileBtn').addEventListener('click', openAddProfileDialog);
  $('editProfileBtn').addEventListener('click', openEditProfileDialog);
  $('deleteProfileBtn').addEventListener('click', deleteSelectedProfile);
  $('addReportBtn').addEventListener('click', openReportDialog);
  $('editReportBtn').addEventListener('click', editActiveReport);
  $('deleteReportBtn').addEventListener('click', deleteActiveReport);
  $('backupBtn').addEventListener('click', exportBackup);
  $('refreshAppBtn').addEventListener('click', refreshApp);
  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });

  $('profileForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const existingProfile = state.profiles.find((profile) => profile.id === state.editingProfileId);
    if (existingProfile) {
      existingProfile.name = $('newProfileName').value.trim();
      existingProfile.birthDate = $('newProfileBirthDate').value;
      existingProfile.sex = $('newProfileSex').value;
      state.editingProfileId = null;
      $('profileForm').reset();
      $('profileDialog').close();
      saveState();
      render();
      return;
    }

    const profile = {
      id: crypto.randomUUID(),
      name: $('newProfileName').value.trim(),
      birthDate: $('newProfileBirthDate').value,
      sex: $('newProfileSex').value,
      reports: [],
    };
    state.profiles.push(profile);
    state.selectedProfileId = profile.id;
    $('profileForm').reset();
    $('profileDialog').close();
    saveState();
    render();
  });

  $('reportFiles').addEventListener('change', previewReportFiles);
  $('runOcrBtn').addEventListener('click', runOcr);
  $('addManualResultBtn').addEventListener('click', () => {
    state.draftResults.push(blankResult());
    renderResultEditor();
  });

  $('reportForm').addEventListener('submit', (event) => {
    event.preventDefault();
    saveReport();
  });
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    state.profiles = parsed.profiles || [];
    state.selectedProfileId = parsed.selectedProfileId || state.profiles[0]?.id || null;
  } catch {
    state.profiles = [];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    profiles: state.profiles,
    selectedProfileId: state.selectedProfileId,
  }));
}

function render() {
  renderProfiles();
  renderSelectedProfile();
}

function openAddProfileDialog() {
  state.editingProfileId = null;
  $('profileDialogTitle').textContent = 'Add profile';
  $('profileSubmitBtn').textContent = 'Save';
  $('profileForm').reset();
  $('profileDialog').showModal();
}

function openEditProfileDialog(profileId = state.selectedProfileId) {
  const profile = state.profiles.find((item) => item.id === profileId);
  if (!profile) return;
  state.editingProfileId = profile.id;
  $('profileDialogTitle').textContent = 'Edit profile';
  $('profileSubmitBtn').textContent = 'Update';
  $('newProfileName').value = profile.name;
  $('newProfileBirthDate').value = profile.birthDate || '';
  $('newProfileSex').value = profile.sex || '';
  $('profileDialog').showModal();
}

function deleteSelectedProfile() {
  deleteProfile(state.selectedProfileId);
}

function deleteProfile(profileId) {
  const profile = state.profiles.find((item) => item.id === profileId);
  if (!profile) return;
  const confirmed = confirm(`Delete ${profile.name} and all saved reports? This cannot be undone.`);
  if (!confirmed) return;
  state.profiles = state.profiles.filter((item) => item.id !== profileId);
  state.selectedProfileId = state.profiles[0]?.id || null;
  saveState();
  render();
}

function renderProfiles() {
  const list = $('profileList');
  list.innerHTML = '';
  state.profiles.forEach((profile) => {
    const card = document.createElement('div');
    card.className = `profile-card ${profile.id === state.selectedProfileId ? 'active' : ''}`;
    card.innerHTML = `
      <button class="profile-card-main text-button" type="button">
        <span class="card-title">${escapeHtml(profile.name)}</span>
        <span class="card-meta">${profile.reports.length} blood test reports</span>
      </button>
      <div class="card-actions">
        <button class="tonal-button icon-button" type="button" title="Edit ${escapeAttribute(profile.name)}" data-profile-edit="${profile.id}">
          <span class="material-symbols-rounded" aria-hidden="true">edit</span>
        </button>
        <button class="danger-button icon-button" type="button" title="Delete ${escapeAttribute(profile.name)}" data-profile-delete="${profile.id}">
          <span class="material-symbols-rounded" aria-hidden="true">delete</span>
        </button>
      </div>
    `;
    card.querySelector('.profile-card-main').addEventListener('click', () => {
      state.selectedProfileId = profile.id;
      saveState();
      render();
    });
    card.querySelector('[data-profile-edit]').addEventListener('click', () => openEditProfileDialog(profile.id));
    card.querySelector('[data-profile-delete]').addEventListener('click', () => deleteProfile(profile.id));
    list.append(card);
  });
}

function renderSelectedProfile() {
  const profile = selectedProfile();
  $('emptyState').classList.toggle('hidden', Boolean(profile));
  $('profileView').classList.toggle('hidden', !profile);
  if (!profile) return;

  $('profileName').textContent = profile.name;
  const profileMeta = [
    profile.birthDate && `Birthday ${formatDate(profile.birthDate)}`,
    profile.birthYear && `Born ${profile.birthYear}`,
    profile.sex,
  ].filter(Boolean);
  $('profileMeta').textContent = profileMeta.join(' - ') || 'Personal blood test record';

  const list = $('reportList');
  list.innerHTML = '';
  if (profile.reports.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No reports saved yet.</p></div>';
    return;
  }

  profile.reports.forEach((report) => {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.innerHTML = `
      <button class="report-card-main text-button" type="button">
        <span class="card-title">${formatDate(report.date)}</span>
        <span class="card-meta">${escapeHtml(report.labName || 'Unknown lab')} - ${report.results.length} results - ${flaggedCount(report)} flagged</span>
      </button>
      <div class="card-actions">
        <button class="tonal-button icon-button" type="button" title="Edit report" data-report-edit="${report.id}">
          <span class="material-symbols-rounded" aria-hidden="true">edit</span>
        </button>
        <button class="danger-button icon-button" type="button" title="Delete report" data-report-delete="${report.id}">
          <span class="material-symbols-rounded" aria-hidden="true">delete</span>
        </button>
      </div>
    `;
    card.querySelector('.report-card-main').addEventListener('click', () => openReportDetail(report));
    card.querySelector('[data-report-edit]').addEventListener('click', () => openEditReportDialog(report.id));
    card.querySelector('[data-report-delete]').addEventListener('click', () => deleteReport(report.id));
    list.append(card);
  });
}

function openReportDialog() {
  state.editingReportId = null;
  state.draftPages = [];
  state.draftResults = [];
  $('reportDialogTitle').textContent = 'Add blood test report';
  $('reportSubmitBtn').textContent = 'Save report';
  $('reportForm').reset();
  $('reportDate').valueAsDate = new Date();
  $('imagePreview').innerHTML = '';
  $('ocrStatus').textContent = 'Choose multiple images, one PDF, or a mix of both.';
  renderResultEditor();
  $('reportDialog').showModal();
}

function openEditReportDialog(reportId) {
  const report = findReport(reportId);
  if (!report) return;
  state.editingReportId = report.id;
  state.draftPages = [...(report.pages || report.images || [])];
  state.draftResults = (report.results || []).map((result) => ({ ...result }));
  $('reportDialogTitle').textContent = 'Edit blood test report';
  $('reportSubmitBtn').textContent = 'Update report';
  $('reportForm').reset();
  $('reportDate').value = report.date || '';
  $('labName').value = report.labName || '';
  $('imagePreview').innerHTML = '';
  state.draftPages.forEach((page) => renderDraftPageThumb(page));
  $('ocrStatus').textContent = `${state.draftPages.length} saved page${state.draftPages.length === 1 ? '' : 's'} in this report.`;
  renderResultEditor();
  $('reportDialog').showModal();
}

async function previewReportFiles() {
  state.draftPages = [];
  $('imagePreview').innerHTML = '';
  const files = Array.from($('reportFiles').files || []);
  $('ocrStatus').textContent = files.length
    ? 'Preparing selected files...'
    : 'Choose clear photos or a PDF report.';
  for (const file of files) {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      await addPdfPages(file);
    } else if (file.type.startsWith('image/')) {
      const dataUrl = await fileToDataUrl(file);
      addDraftPage({ name: file.name, dataUrl, text: '', sourceType: 'image' });
    }
  }
  $('ocrStatus').textContent = `${state.draftPages.length} page${state.draftPages.length === 1 ? '' : 's'} ready in this report.`;
}

async function runOcr() {
  if (state.draftPages.length === 0) {
    $('ocrStatus').textContent = 'Choose report images or a PDF first.';
    return;
  }

  state.draftResults = [];
  for (let index = 0; index < state.draftPages.length; index += 1) {
    const page = state.draftPages[index];
    $('ocrStatus').textContent = `Reading page ${index + 1} of ${state.draftPages.length}...`;
    let text = page.text || '';
    if (!text.trim()) {
      if (!window.Tesseract) {
        $('ocrStatus').textContent = 'OCR library is not loaded. You can add rows manually.';
        return;
      }
      const { data } = await Tesseract.recognize(page.dataUrl, 'eng');
      text = data.text;
    }
    state.draftResults.push(...parseResults(text, index + 1));
  }
  $('ocrStatus').textContent = `${state.draftResults.length} possible result rows found. Please review before saving.`;
  renderResultEditor();
}

function parseResults(text, pageNumber) {
  const results = [];
  const lines = text.split(/\r?\n/).map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9%(). /_-]+?)\s+(-?\d+(?:\.\d+)?)\s+([A-Za-z0-9/^繕u%. ]+)?(?:\s+(\*|\(?[HL]\)?))?\s*((?:[<>]\s*)?-?\d+(?:\.\d+)?(?:\s*-\s*-?\d+(?:\.\d+)?)?)?$/i);
    if (!match) continue;
    const definition = findIndicator(match[1]);
    if (!definition) continue;
    results.push({
      id: crypto.randomUUID(),
      key: definition.key,
      name: definition.displayName,
      originalLabel: match[1].trim(),
      category: definition.category,
      value: match[2] || '',
      unit: (match[3] || '').trim(),
      flag: (match[4] || '').replace(/[()]/g, ''),
      referenceRange: (match[5] || '').trim(),
      page: pageNumber,
    });
  }
  return results;
}

function renderResultEditor() {
  const editor = $('resultEditor');
  editor.innerHTML = '';
  state.draftResults.forEach((result, index) => {
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `
      <input aria-label="Name" value="${escapeAttribute(result.name)}" />
      <input aria-label="Value" value="${escapeAttribute(result.value)}" />
      <input aria-label="Unit" value="${escapeAttribute(result.unit)}" />
      <input aria-label="Flag" value="${escapeAttribute(result.flag)}" />
      <input aria-label="Reference range" value="${escapeAttribute(result.referenceRange)}" />
      <button class="delete-row" type="button" title="Delete row"><span class="material-symbols-rounded" aria-hidden="true">delete</span></button>
    `;
    const inputs = row.querySelectorAll('input');
    inputs[0].addEventListener('input', (event) => result.name = event.target.value);
    inputs[1].addEventListener('input', (event) => result.value = event.target.value);
    inputs[2].addEventListener('input', (event) => result.unit = event.target.value);
    inputs[3].addEventListener('input', (event) => result.flag = event.target.value);
    inputs[4].addEventListener('input', (event) => result.referenceRange = event.target.value);
    row.querySelector('button').addEventListener('click', () => {
      state.draftResults.splice(index, 1);
      renderResultEditor();
    });
    editor.append(row);
  });
}

function saveReport() {
  const profile = selectedProfile();
  if (!profile) return;
  const existingReport = profile.reports.find((report) => report.id === state.editingReportId);
  if (existingReport) {
    existingReport.date = $('reportDate').value;
    existingReport.labName = $('labName').value.trim();
    existingReport.pages = state.draftPages;
    existingReport.images = state.draftPages;
    existingReport.results = state.draftResults;
    state.editingReportId = null;
    $('reportDialog').close();
    saveState();
    render();
    if (state.activeReportId === existingReport.id) {
      openReportDetail(existingReport);
    }
    return;
  }

  const report = {
    id: crypto.randomUUID(),
    date: $('reportDate').value,
    labName: $('labName').value.trim(),
    pages: state.draftPages,
    images: state.draftPages,
    results: state.draftResults,
  };
  profile.reports.unshift(report);
  $('reportDialog').close();
  saveState();
  render();
}

function openReportDetail(report) {
  state.activeReportId = report.id;
  $('detailTitle').textContent = formatDate(report.date);
  $('detailMeta').textContent = `${report.labName || 'Unknown lab'} - ${report.results.length} results - ${flaggedCount(report)} flagged`;
  const grouped = groupBy(report.results, (result) => result.category || 'Other');
  const body = $('detailBody');
  body.innerHTML = `
    <div class="summary-card">
      <strong>Saved report pages:</strong> ${(report.pages || report.images || []).length}
    </div>
  `;
  Object.entries(grouped).forEach(([category, results]) => {
    const section = document.createElement('section');
    section.className = 'category-block';
    section.innerHTML = `
      <h3>${escapeHtml(category)}</h3>
      <table class="detail-table">
        <thead>
          <tr>
            <th>Indicator</th>
            <th>Result</th>
            <th>Flag</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          ${results.map((result) => `
            <tr>
              <td>
                <button class="indicator-link" type="button" data-indicator-key="${escapeAttribute(result.key || '')}" data-indicator-name="${escapeAttribute(result.name)}" data-indicator-category="${escapeAttribute(result.category || category)}">
                  ${escapeHtml(result.name)}
                </button>
              </td>
              <td>${escapeHtml(`${result.value} ${result.unit}`.trim())}</td>
              <td class="flag">${escapeHtml(result.flag)}</td>
              <td>${escapeHtml(result.referenceRange)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    body.append(section);
  });
  body.querySelectorAll('.indicator-link').forEach((button) => {
    button.addEventListener('click', () => openIndicatorInfo({
      key: button.dataset.indicatorKey,
      name: button.dataset.indicatorName,
      category: button.dataset.indicatorCategory,
    }));
  });
  if (!$('reportDetailDialog').open) {
    $('reportDetailDialog').showModal();
  }
}

function editActiveReport() {
  if (!state.activeReportId) return;
  $('reportDetailDialog').close();
  openEditReportDialog(state.activeReportId);
}

function deleteActiveReport() {
  if (!state.activeReportId) return;
  deleteReport(state.activeReportId);
}

function deleteReport(reportId) {
  const profile = selectedProfile();
  const report = profile?.reports.find((item) => item.id === reportId);
  if (!profile || !report) return;
  const confirmed = confirm(`Delete the report from ${formatDate(report.date)}? This cannot be undone.`);
  if (!confirmed) return;
  profile.reports = profile.reports.filter((item) => item.id !== reportId);
  if (state.activeReportId === reportId) {
    state.activeReportId = null;
    if ($('reportDetailDialog').open) $('reportDetailDialog').close();
  }
  saveState();
  render();
}

function findReport(reportId) {
  const profile = selectedProfile();
  return profile?.reports.find((report) => report.id === reportId) || null;
}

function openIndicatorInfo(result) {
  const definition = indicatorDictionary.find((item) => item.key === result.key);
  const title = result.name || definition?.displayName || 'Indicator';
  const category = result.category || definition?.category || 'Blood test indicator';
  $('indicatorTitle').textContent = title;
  $('indicatorCategory').textContent = category;
  $('indicatorDescription').textContent = indicatorDescriptions[result.key] || 'This indicator is part of the blood test report. Interpretation depends on age, sex, symptoms, medicines, and the laboratory reference range.';
  $('indicatorDialog').showModal();
}

async function addPdfPages(file) {
  if (!window.pdfjsLib) {
    $('ocrStatus').textContent = 'PDF reader is not loaded. Try images or run from an internet-connected browser.';
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    $('ocrStatus').textContent = `Preparing ${file.name}, page ${pageNumber} of ${pdf.numPages}...`;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;

    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => item.str).join('\n');
    addDraftPage({
      name: `${file.name} page ${pageNumber}`,
      dataUrl: canvas.toDataURL('image/jpeg', 0.88),
      text,
      sourceType: 'pdf',
    });
  }
}

function addDraftPage(page) {
  state.draftPages.push(page);
  renderDraftPageThumb(page);
}

function renderDraftPageThumb(page) {
  const wrapper = document.createElement('figure');
  wrapper.className = 'page-thumb';
  wrapper.innerHTML = `
    <img src="${page.dataUrl}" alt="${escapeAttribute(page.name)}" />
    <figcaption>${escapeHtml(page.name)}</figcaption>
  `;
  $('imagePreview').append(wrapper);
}

function exportBackup() {
  const blob = new Blob([JSON.stringify({ profiles: state.profiles }, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `health-check-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function selectedProfile() {
  return state.profiles.find((profile) => profile.id === state.selectedProfileId) || null;
}

function findIndicator(label) {
  const normalized = normalize(label);
  return indicatorDictionary.find((definition) => (
    definition.aliases.some((alias) => normalize(alias) === normalized)
  ));
}

function normalize(value) {
  return value.toUpperCase().replace(/[^A-Z0-9%]+/g, ' ').trim();
}

function blankResult() {
  return {
    id: crypto.randomUUID(),
    key: 'manual',
    name: '',
    originalLabel: '',
    category: 'Manual',
    value: '',
    unit: '',
    flag: '',
    referenceRange: '',
    page: 1,
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function groupBy(items, getter) {
  return items.reduce((groups, item) => {
    const key = getter(item);
    groups[key] ||= [];
    groups[key].push(item);
    return groups;
  }, {});
}

function flaggedCount(report) {
  return report.results.filter((result) => result.flag?.trim()).length;
}

function formatDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character]));
}

function escapeAttribute(value = '') {
  return escapeHtml(value).replace(/`/g, '&#096;');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then((registration) => {
      if (registration.waiting) {
        showUpdateReady(registration.waiting);
      }

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateReady(worker);
          }
        });
      });
    }).catch(() => {});

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

function showUpdateReady(worker) {
  state.waitingServiceWorker = worker;
  $('updateBar').classList.remove('hidden');
}

function refreshApp() {
  if (!state.waitingServiceWorker) {
    window.location.reload();
    return;
  }
  state.waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
}

