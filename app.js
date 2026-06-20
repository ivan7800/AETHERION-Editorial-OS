'use strict';

const STORE_KEY = 'aetherion_editorial_os_v2_fallback';
const STORE_META_KEY = 'aetherion_editorial_os_v2_storage_meta';
const DB_NAME = 'aetherion_editorial_os_db';
const DB_STORE = 'workspace';
const DB_STATE_KEY = 'state';
const $ = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const PROMPTS = {
  maestro: {
    label: 'Prompt maestro editorial',
    body: `Actúa como EDITOR SENIOR DE NOVELA, ARQUITECTO NARRATIVO y AUDITOR KDP.

Analiza todas las fuentes cargadas como si fueran una novela completa o un proyecto narrativo completo.

Debes ayudarme con TODO:
1. Premisa y promesa de lectura.
2. Arquitectura narrativa.
3. Estructura por actos y capítulos.
4. Conflicto central.
5. Ritmo y tensión progresiva.
6. Personajes, motivaciones y arcos.
7. Continuidad interna y canon.
8. Diálogos, subtexto y naturalidad.
9. Voz narrativa, atmósfera e identidad propia.
10. Escenas redundantes, flojas o explicativas.
11. Rastros de prosa artificial o texto con olor a IA.
12. Pulido RAE/KDP en español peninsular.
13. Riesgos comerciales y de lectura.
14. Plan de reescritura priorizado.

No quiero un resumen. Quiero diagnóstico editorial y acciones concretas.`
  },
  editor10: {
    label: 'Auditor supremo',
    body: `MODO AETHERION / AUDITOR SUPREMO.

Actúa como editor literario senior, arquitecto narrativo, corrector de estilo y auditor KDP.

No quiero un análisis bonito. Quiero una intervención editorial útil para mejorar la novela.

Ejecuta estas 5 capas:

CAPA 1 — PRIORIDAD EDITORIAL
Clasifica problemas en críticos, importantes y menores. Para cada problema indica evidencia concreta, impacto en el lector, prioridad y solución.

CAPA 2 — CIRUGÍA DE PROSA
Selecciona fragmentos problemáticos. Para cada uno: texto original, qué falla, reescritura mejorada y por qué funciona mejor.

CAPA 3 — DETECTOR IA / PROSA ROBÓTICA
Busca frases sentenciosas, cierres perfectos, simetría artificial, diálogos limpios, explicaciones innecesarias, metáforas genéricas y tono de resumen en vez de escena.

CAPA 4 — CONTROL GLOBAL
Evalúa progresión de tensión, evolución emocional, coherencia interna, ritmo global y puntos donde el lector podría abandonar.

CAPA 5 — DECISIÓN KDP
Di si está listo, casi listo o no listo para publicación. No seas amable: sé útil.

Termina con los 3 arreglos obligatorios, los 5 fragmentos más urgentes y un plan de reescritura por orden.`
  },
  diagnostico: { label: 'Diagnóstico total', body: `Haz una AUDITORÍA EDITORIAL TOTAL de la novela.

Evalúa fuerza de premisa, claridad del conflicto, progresión dramática, ritmo global, tensión por capítulos, personajes, escenas que sobran, escenas que faltan, coherencia del mundo, voz narrativa, atmósfera, riesgo de prosa artificial y preparación KDP.

Devuelve veredicto final con puntuación del 1 al 10 y lista priorizada de arreglos.` },
  arquitectura: { label: 'Arquitectura', body: `Analiza solo la ARQUITECTURA NARRATIVA.

Extrae premisa, promesa de lectura, conflicto central, reglas del mundo, estructura por actos, puntos de giro, clímax, resolución y cabos sueltos.

Señala dónde la trama fuerza la lógica del mundo o dónde falta causalidad.` },
  capitulos: { label: 'Mapa capítulos', body: `Crea un MAPA DE CAPÍTULOS.

Para cada capítulo indica función dramática, conflicto, revelación o cambio, tensión, personaje dominante, problema principal y si debería recortarse, moverse o reforzarse.

Si no hay capítulos claros, reconstruye una escaleta posible.` },
  personajes: { label: 'Personajes', body: `Analiza PERSONAJES Y ARCOS.

Para cada personaje importante indica deseo externo, necesidad interna, miedo, contradicción, función narrativa, arco, relación con el conflicto central, escenas donde brilla y escenas donde se vuelve plano.

Detecta personajes redundantes o desaprovechados.` },
  continuidad: { label: 'Continuidad / canon', body: `Haz CONTROL DE CONTINUIDAD / CANON.

Busca contradicciones de fechas, cambios de nombres, errores de lugar, objetos que aparecen/desaparecen, motivaciones inconsistentes, reglas del mundo incumplidas, promesas olvidadas y cabos sueltos.

Devuelve tabla: problema / dónde aparece / gravedad / solución.` },
  tension: { label: 'Tensión y ritmo', body: `Analiza TENSIÓN Y RITMO.

Detecta capítulos con tensión baja, escenas explicativas, repeticiones, inicios flojos, finales sin gancho, exceso de calma y falta de consecuencias.

Propón mejoras concretas sin reescribir toda la novela.` },
  subtexto: { label: 'Diálogos y subtexto', body: `Analiza DIÁLOGOS Y SUBTEXTO.

Busca diálogos expositivos, personajes que explican el tema, réplicas demasiado perfectas, falta de fricción humana, tensión no verbal y subtexto real.

Devuelve ejemplos concretos y cómo corregirlos.` },
  voz: { label: 'Voz y atmósfera', body: `Analiza VOZ, PROSA Y ATMÓSFERA.

Extrae ADN narrativo: sintaxis, ritmo, léxico, imágenes sensoriales, tono emocional, atmósfera dominante y frases recurrentes.

Detecta dónde la voz se rompe o se vuelve genérica.` },
  ia: { label: 'Rastros IA', body: `Haz DETECCIÓN DE RASTROS IA / PROSA ARTIFICIAL.

Busca frases sentenciosas, cierres perfectos, simetría excesiva, diálogos demasiado limpios, metáforas genéricas, explicaciones innecesarias, tono de resumen en vez de escena y frases que suenan a plantilla.

Devuelve riesgo bajo/medio/alto y fragmentos concretos.` },
  kdp: { label: 'RAE / KDP', body: `Haz PULIDO RAE / KDP en español peninsular.

Revisa ortografía, puntuación, raya de diálogo, comillas españolas cuando proceda, tiempos verbales, repeticiones, formato de capítulos, naturalidad de párrafos y exceso de cursivas o énfasis.

No reescribas todo. Devuelve correcciones concretas y reglas de limpieza.` },
  cirugia: { label: 'Cirugía de prosa', body: `Actúa como editor quirúrgico.

No reescribas todo. Selecciona SOLO fragmentos problemáticos.

Para cada fragmento: texto original, qué falla, reescritura mejorada y por qué funciona mejor.

Mantén voz, tono, continuidad y español peninsular. Evita embellecer por embellecer. Reduce explicaciones. Conserva misterio cuando convenga.` },
  plan: { label: 'Plan de reescritura', body: `Crea un PLAN DE REESCRITURA PRIORITARIO.

Organiza por fases: problemas estructurales graves, personajes, ritmo y tensión, escenas concretas, limpieza de prosa artificial y pulido RAE/KDP.

Para cada fase indica qué hacer primero, por qué y qué resultado debería producir.` }
};

const DEFAULT_STATE = {
  activeProjectId: null,
  projects: {},
  history: [],
  memory: [],
  dashboard: {},
  lastPrompt: '',
  lastAnalysis: null,
  lastComparison: null,
  lastNovelAudit: null,
  aiConfig: { provider: 'off', endpoint: 'http://localhost:11434', model: 'llama3.1' }
};

let state = loadStateFallback();
let saveTimer = null;
let storageEngine = 'localStorage';

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadStateFallback() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return normalizeState({ ...cloneDefaultState(), ...stored });
  } catch {
    return cloneDefaultState();
  }
}

function normalizeId(value) {
  const raw = String(value || uid()).slice(0, 160);
  const clean = raw.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  return clean || uid();
}

function normalizeState(raw) {
  const normalized = { ...cloneDefaultState(), ...(raw || {}) };

  const projects = normalized.projects && typeof normalized.projects === 'object' ? normalized.projects : {};
  const cleanProjects = {};
  const idMap = new Map();
  Object.entries(projects).slice(0, 120).forEach(([oldId, project]) => {
    if (!project || typeof project !== 'object') return;
    const id = normalizeId(project.id || oldId);
    idMap.set(String(oldId), id);
    cleanProjects[id] = { ...project, id };
  });
  normalized.projects = cleanProjects;
  normalized.activeProjectId = normalized.activeProjectId ? (idMap.get(String(normalized.activeProjectId)) || normalizeId(normalized.activeProjectId)) : null;
  if (normalized.activeProjectId && !normalized.projects[normalized.activeProjectId]) normalized.activeProjectId = null;

  normalized.history = Array.isArray(normalized.history) ? normalized.history.filter(Boolean).slice(0, 80) : [];
  normalized.memory = Array.isArray(normalized.memory) ? normalized.memory.filter(Boolean).slice(0, 120) : [];
  normalized.dashboard = normalized.dashboard && typeof normalized.dashboard === 'object' ? normalized.dashboard : {};
  normalized.aiConfig = normalized.aiConfig && typeof normalized.aiConfig === 'object'
    ? { provider: normalized.aiConfig.provider || 'off', endpoint: normalized.aiConfig.endpoint || 'http://localhost:11434', model: normalized.aiConfig.model || 'llama3.1' }
    : { provider: 'off', endpoint: 'http://localhost:11434', model: 'llama3.1' };
  return normalized;
}

function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB no disponible'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('No se pudo abrir IndexedDB'));
  });
}

async function dbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error || new Error('No se pudo leer IndexedDB'));
  });
}

async function dbSet(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(value, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error('No se pudo guardar IndexedDB'));
  });
}

async function initPersistentStorage() {
  try {
    const stored = await dbGet(DB_STATE_KEY);
    if (stored) {
      state = normalizeState(stored);
      storageEngine = 'IndexedDB';
      try { localStorage.removeItem(STORE_KEY); localStorage.setItem(STORE_META_KEY, JSON.stringify({ migratedToIndexedDB: true, updatedAt: new Date().toISOString() })); } catch (err) {}
      renderAll();
      hydrateAIConfig();
      setAutosave('IndexedDB');
      return;
    }
    await dbSet(DB_STATE_KEY, state);
    storageEngine = 'IndexedDB';
    try { localStorage.removeItem(STORE_KEY); localStorage.setItem(STORE_META_KEY, JSON.stringify({ migratedToIndexedDB: true, updatedAt: new Date().toISOString() })); } catch (err) {}
    setAutosave('Migrado a IndexedDB');
  } catch {
    storageEngine = 'localStorage';
    setAutosave('Local fallback');
  }
}

function saveState() {
  const safeState = sanitizeStateForStorage(state);

  // IndexedDB es el almacén principal. localStorage solo guarda el estado completo
  // cuando IndexedDB no está disponible; si no, se usa una marca mínima de migración.
  try {
    if (storageEngine === 'localStorage') {
      localStorage.setItem(STORE_KEY, JSON.stringify(safeState));
    } else {
      localStorage.removeItem(STORE_KEY);
      localStorage.setItem(STORE_META_KEY, JSON.stringify({ migratedToIndexedDB: true, updatedAt: new Date().toISOString() }));
    }
  } catch (err) {
    // La app puede seguir funcionando en memoria aunque el navegador bloquee storage.
  }

  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await dbSet(DB_STATE_KEY, safeState);
      storageEngine = 'IndexedDB';
      setAutosave('Guardado IndexedDB');
    } catch {
      storageEngine = 'localStorage';
      try { localStorage.setItem(STORE_KEY, JSON.stringify(safeState)); } catch (err) {}
      setAutosave('Guardado local');
    }
  }, 120);
}

function sanitizeStateForStorage(raw) {
  const clean = normalizeState(JSON.parse(JSON.stringify(raw || {})));
  // Nunca persistir claves API aunque el usuario las escriba en la interfaz.
  if (clean.aiConfig) delete clean.aiConfig.apiKey;
  return clean;
}

function setAutosave(text) {
  $('autosaveStatus').textContent = text;
  clearTimeout(setAutosave.timer);
  setAutosave.timer = setTimeout(() => $('autosaveStatus').textContent = storageEngine, 1800);
}

function toast(message, type = 'ok') {
  const node = document.createElement('div');
  node.className = `toast ${type}`;
  node.textContent = message;
  $('toast').appendChild(node);
  setTimeout(() => node.remove(), 2600);
}

function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeDataId(value) {
  return escapeHTML(String(value || '').slice(0, 140));
}

function nowShort() {
  return new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function nowFile() {
  return new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
}

function getMeta() {
  const hardness = $('hardness').value;
  const hardText = hardness === 'brutal'
    ? 'Sé brutalmente honesto, sin complacencia, sin suavizar problemas. Nada de frases de ánimo.'
    : hardness === 'alta'
      ? 'Sé exigente, directo y editorialmente duro. No des palmaditas en la espalda.'
      : 'Sé claro, útil y editorialmente preciso.';
  return {
    title: $('projectTitle').value.trim() || '[TÍTULO DE LA NOVELA]',
    genre: $('projectGenre').value.trim() || '[GÉNERO / TONO]',
    goal: $('projectGoal').value,
    hardness,
    hardText,
    context: $('sourceContext').value.trim() || '[FUENTES CARGADAS EN NOTEBOOKLM O IA]',
    focus: $('focusTarget').value.trim()
  };
}

function generatePrompt(type) {
  const template = PROMPTS[type];
  if (!template) return;
  const m = getMeta();
  const memoryText = state.memory.length
    ? `\nMEMORIA EDITORIAL DEL PROYECTO\n${state.memory.slice(0, 12).map((x, i) => `${i + 1}. ${x.note}`).join('\n')}\n`
    : '';
  const focusText = m.focus ? `\nFOCO ESPECÍFICO\nLimita el análisis a: ${m.focus}\n` : '';
  const prompt = `NOVELA / PROYECTO
Título: ${m.title}
Género: ${m.genre}
Objetivo: ${m.goal}
${focusText}
CRITERIO EDITORIAL
${m.hardText}

CONTEXTO DE FUENTES CARGADAS
${m.context}
${memoryText}
TAREA
${template.body}

REGLAS OBLIGATORIAS
- Usa solo las fuentes cargadas o el texto aportado.
- No inventes datos fuera de las fuentes.
- Si algo no está demostrado, dilo claramente.
- Cita documento, capítulo, escena o fragmento cuando sea posible.
- No hagas resumen argumental salvo que sea necesario para diagnosticar.
- Prioriza problemas que afectan a lectura, tensión, coherencia y publicación.
- Sé concreto: problema → prueba → consecuencia → solución.
- No confundas opinión estética con fallo editorial.

FORMATO DE RESPUESTA
1. Veredicto editorial breve.
2. Hallazgos principales.
3. Evidencia concreta de las fuentes.
4. Problemas críticos.
5. Problemas importantes.
6. Problemas menores.
7. Acciones concretas.
8. Siguiente prompt recomendado.`;

  $('promptOutput').textContent = prompt;
  $('promptTime').textContent = nowShort();
  state.lastPrompt = prompt;
  addHistory(template.label, prompt);
  saveState();
  toast(`Prompt generado: ${template.label}`);
}

function addHistory(label, content) {
  state.history.unshift({ id: uid(), label, content, ts: nowShort() });
  state.history = state.history.slice(0, 40);
  renderHistory();
}

function writeClipboard(text, okMsg) {
  if (!text || !text.trim()) {
    toast('No hay contenido para copiar.', 'warn');
    return;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => toast(okMsg)).catch(() => fallbackCopy(text, okMsg));
  } else {
    fallbackCopy(text, okMsg);
  }
}

function fallbackCopy(text, okMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); toast(okMsg); }
  catch { toast('No se pudo copiar automáticamente.', 'bad'); }
  ta.remove();
}

function hydrateAIConfig() {
  const cfg = state.aiConfig || DEFAULT_STATE.aiConfig;
  if ($('aiProvider')) $('aiProvider').value = cfg.provider || 'off';
  if ($('aiEndpoint')) $('aiEndpoint').value = cfg.endpoint || 'http://localhost:11434';
  if ($('aiModel')) $('aiModel').value = cfg.model || 'llama3.1';
  if ($('aiApiKey')) $('aiApiKey').value = '';
  updateAIHelp();
}

function getAIConfig() {
  const provider = $('aiProvider')?.value || 'off';
  let endpoint = $('aiEndpoint')?.value.trim() || '';
  let model = $('aiModel')?.value.trim() || '';
  if (provider === 'ollama') {
    endpoint = endpoint || 'http://localhost:11434';
    model = model || 'llama3.1';
  }
  if (provider === 'openai_compatible') {
    endpoint = endpoint || 'https://api.openai.com/v1/chat/completions';
    model = model || 'gpt-4o-mini';
  }
  return { provider, endpoint, model, apiKey: $('aiApiKey')?.value || '' };
}

function persistAIConfig() {
  const { provider, endpoint, model } = getAIConfig();
  state.aiConfig = { provider, endpoint, model };
  saveState();
}

function updateAIHelp() {
  if (!$('aiProvider')) return;
  const cfg = getAIConfig();
  if (cfg.provider === 'off') setAIStatus('Desactivado');
  else if (cfg.provider === 'ollama') setAIStatus('Ollama local');
  else setAIStatus('API externa opcional');
}

function setAIStatus(text) {
  if ($('aiBridgeStatus')) $('aiBridgeStatus').textContent = text;
}

async function testAIConnection() {
  const cfg = getAIConfig();
  persistAIConfig();
  if (cfg.provider === 'off') { toast('Activa Ollama o API compatible para probar.', 'warn'); return; }
  setAIStatus('Probando...');
  try {
    const text = await callAI(cfg, 'Responde solo con: conexión correcta');
    setAIStatus('Conectado');
    toast(`Conexión correcta: ${text.slice(0, 80)}`);
  } catch (err) {
    setAIStatus('Error de conexión');
    toast(aiErrorMessage(err), 'bad');
  }
}

async function runPromptWithAI() {
  const prompt = $('promptOutput').textContent.trim();
  if (!prompt || prompt.startsWith('Elige un botón')) { toast('Genera primero un prompt.', 'warn'); return; }
  const cfg = getAIConfig();
  persistAIConfig();
  if (cfg.provider === 'off') { toast('El motor IA está desactivado. Usa modo manual o activa un proveedor.', 'warn'); return; }
  setAIStatus('Generando...');
  try {
    const response = await callAI(cfg, prompt);
    $('aiResponse').value = response;
    setAIStatus('Respuesta recibida');
    evaluateAIResponse();
  } catch (err) {
    setAIStatus('Error IA');
    toast(aiErrorMessage(err), 'bad');
  }
}

function aiErrorMessage(err) {
  const msg = err?.message || String(err || 'error desconocido');
  if (/Failed to fetch|NetworkError|CORS|Load failed/i.test(msg)) {
    return 'No se pudo conectar. Revisa endpoint, CORS, Ollama abierto o ejecuta la app desde servidor local.';
  }
  return msg.slice(0, 180);
}

async function callAI(cfg, prompt) {
  if (!window.fetch) throw new Error('Este navegador no soporta fetch.');
  if (cfg.provider === 'ollama') return callOllama(cfg, prompt);
  if (cfg.provider === 'openai_compatible') return callOpenAICompatible(cfg, prompt);
  throw new Error('Proveedor no configurado.');
}

async function callOllama(cfg, prompt) {
  const endpoint = cfg.endpoint.replace(/\/$/, '');
  const res = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: cfg.model, prompt, stream: false, options: { temperature: 0.2 } })
  });
  if (!res.ok) throw new Error(`Ollama respondió ${res.status}.`);
  const data = await res.json();
  return String(data.response || '').trim() || '[Respuesta vacía de Ollama]';
}

async function callOpenAICompatible(cfg, prompt) {
  const endpoint = cfg.endpoint.includes('/chat/completions') ? cfg.endpoint : `${cfg.endpoint.replace(/\/$/, '')}/chat/completions`;
  const headers = { 'Content-Type': 'application/json' };
  if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Actúa como editor literario senior. Da diagnóstico concreto, duro y accionable.' },
        { role: 'user', content: prompt }
      ]
    })
  });
  if (!res.ok) throw new Error(`La API respondió ${res.status}.`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || data.output_text || data.response || '';
  return String(text).trim() || '[Respuesta vacía de la API]';
}

function normalizeText(text) {
  return (text || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

function words(text) {
  return (normalizeText(text).toLowerCase().match(/[a-záéíóúüñ]{2,}/gi) || []);
}

function sentences(text) {
  const found = normalizeText(text).match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [];
  return found.map(x => x.trim()).filter(x => x.length > 2);
}

function paragraphs(text) {
  return normalizeText(text).split(/\n\s*\n+/).map(x => x.trim()).filter(Boolean);
}

function countRegex(text, regexes) {
  return regexes.reduce((sum, re) => sum + ((text.match(re) || []).length), 0);
}

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function colorClass(value) {
  return value >= 80 ? 'ok' : value >= 60 ? 'warn' : 'bad';
}

function barColor(value) {
  if (value >= 80) return 'var(--ok)';
  if (value >= 60) return 'var(--warn)';
  return 'var(--bad)';
}

function countRepeated(text) {
  const stop = new Set('que para como pero porque desde hasta donde cuando todos todas esto esta este ese esa esos esas entre sobre bajo contra hacia durante antes después muy más menos una uno unas unos los las del con sin por sus tus mis nos soy eres era eran sido ser estar tiene tienen tuve tuvo hay aquí allí entonces también solo sólo algo nada todo cada mismo misma'.split(' '));
  const map = new Map();
  words(text).forEach(w => {
    const clean = w.replace(/[^a-záéíóúüñ]/gi, '').toLowerCase();
    if (clean.length > 4 && !stop.has(clean)) map.set(clean, (map.get(clean) || 0) + 1);
  });
  return Array.from(map.entries()).filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]).slice(0, 12);
}

function textStats(text) {
  const w = words(text);
  const s = sentences(text);
  const p = paragraphs(text);
  const lens = s.map(x => words(x).length);
  const avgSentence = lens.length ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length) : 0;
  return {
    chars: normalizeText(text).length,
    words: w.length,
    sentences: s.length,
    paragraphs: p.length,
    avgSentence,
    longSentences: lens.filter(x => x > 32).length,
    veryLongSentences: lens.filter(x => x > 45).length,
    shortSentences: lens.filter(x => x <= 6).length,
    repeated: countRepeated(text),
    uniqueRatio: w.length ? new Set(w).size / w.length : 0,
    dialogueMarks: countRegex(text, [/—/g, /«/g, /»/g, /"/g])
  };
}

function evaluateAIResponse() {
  const text = $('aiResponse').value.trim();
  if (!text) { toast('Pega primero una respuesta de IA.', 'warn'); return; }
  const result = evaluateEditorialAnswer(text);
  state.lastAnalysis = result;
  $('analysisOutput').textContent = renderAnalysisReport(result);
  $('analysisTime').textContent = nowShort();
  updateAnalysisUI(result);
  updateDashboard();
  saveState();
  toast('Respuesta analizada.');
}

function evaluateEditorialAnswer(text) {
  const st = textStats(text);
  const lower = text.toLowerCase();
  const dimensions = [];
  const evidence = countRegex(text, [/cap[íi]tulo\s*\d+/gi, /escena/gi, /fragmento/gi, /fuente/gi, /documento/gi, /p[aá]gina|p\./gi, /«[^»]{8,}»/g, /"[^"]{8,}"/g, /según el texto/gi]);
  const action = countRegex(text, [/reescrib/gi, /elimin/gi, /recort/gi, /fusion/gi, /mueve|mover/gi, /a[ñn]ad/gi, /cambia/gi, /soluci/gi, /prioridad/gi, /plan/gi, /debe/gi]);
  const diagnosis = countRegex(text, [/problema/gi, /falla|fallo/gi, /debilidad/gi, /riesgo/gi, /inconsisten/gi, /contradic/gi, /no funciona/gi, /rompe/gi, /baja/gi]);
  const coverage = [
    /arquitectura|estructura|acto|premisa|conflicto|trama/gi,
    /personaje|arco|motivaci[oó]n|deseo|miedo/gi,
    /continuidad|canon|fecha|lugar|regla|contradicci[oó]n/gi,
    /tensi[oó]n|ritmo|gancho|cl[ií]max|progresi[oó]n/gi,
    /voz|prosa|estilo|atm[oó]sfera|sintaxis|l[eé]xico/gi,
    /kdp|rae|ortograf[ií]a|puntuaci[oó]n|raya de di[aá]logo/gi,
    /ia|artificial|rob[oó]tic|muletilla|plantilla/gi
  ].reduce((n, re) => n + (re.test(lower) ? 1 : 0), 0);
  const structure = countRegex(text, [/^\s*\d+[\).]/gm, /^\s*[-•]/gm, /^#{1,3}\s+/gm, /crítico|importante|menor/gi]);
  const vague = countRegex(text, [/en general/gi, /podr[ií]a mejorar/gi, /es importante/gi, /cabe se[ñn]alar/gi, /interesante/gi, /potente/gi, /bien trabajado/gi, /profundo/gi]);
  const templateRisk = countRegex(text, [/no era .* sino/gi, /algo dentro/gi, /la verdad era/gi, /en el fondo/gi, /como si el mundo/gi, /silencio pesado/gi, /sombra de/gi, /la oscuridad/gi]);

  pushDim(dimensions, 'Evidencia concreta', evidence, 6, 20);
  pushDim(dimensions, 'Acciones ejecutables', action, 8, 18);
  pushDim(dimensions, 'Diagnóstico específico', diagnosis, 7, 18);
  pushDim(dimensions, 'Cobertura editorial', coverage, 6, 16);
  pushDim(dimensions, 'Estructura útil', structure, 8, 12);
  dimensions.push(scoreByValue('Profundidad', st.words, 600, 16));

  let score = dimensions.reduce((sum, d) => sum + d.points, 0);
  const penalty = Math.min(20, vague * 2 + templateRisk * 2 + st.veryLongSentences);
  score = clamp(Math.round(score - penalty));

  const flags = [];
  dimensions.forEach(d => { if (d.percent < 65) flags.push({ type: 'warn', text: `Falta ${d.name.toLowerCase()}.` }); });
  if (vague >= 3) flags.push({ type: 'bad', text: `Demasiadas frases vagas o diplomáticas: ${vague}.` });
  if (templateRisk >= 3) flags.push({ type: 'bad', text: `Riesgo de prosa plantilla o cierre artificial: ${templateRisk}.` });
  if (st.words < 350) flags.push({ type: 'bad', text: 'Respuesta demasiado corta para una auditoría editorial seria.' });
  if (!/fragmento|cap[íi]tulo|escena|cita|fuente/i.test(text)) flags.push({ type: 'bad', text: 'No hay pruebas textuales claras.' });
  if (!flags.length) flags.push({ type: 'good', text: 'Respuesta sólida: tiene evidencia, acciones y cobertura suficiente.' });

  const next = flags.some(f => /pruebas|evidencia|fragmento/i.test(f.text))
    ? 'Pide una repregunta con citas exactas por capítulo, escena o fragmento.'
    : flags.some(f => /acciones|ejecutables/i.test(f.text))
      ? 'Pide un plan de reescritura con prioridades y tareas concretas.'
      : flags.some(f => /vaga|diplomática/i.test(f.text))
        ? 'Pide que repita el análisis sin diplomacia y con fallos concretos.'
        : 'Pasa a cirugía de prosa o comparación A/B.';

  return { score, penalty, dimensions, flags, next, stats: st, vague, templateRisk, createdAt: nowShort() };
}

function pushDim(arr, name, count, target, weight) {
  const percent = clamp(Math.round((count / target) * 100));
  arr.push({ name, count, target, weight, percent, points: Math.round(weight * percent / 100) });
}

function scoreByValue(name, value, target, weight) {
  const percent = clamp(Math.round((value / target) * 100));
  return { name, count: value, target, weight, percent, points: Math.round(weight * percent / 100) };
}

function renderAnalysisReport(r) {
  return `PUNTUACIÓN: ${r.score}/100
Penalización por vaguedad/plantilla/frases excesivas: -${r.penalty}

DIMENSIONES
${r.dimensions.map(d => `${d.percent >= 65 ? '✓' : '✗'} ${d.name}: ${d.points}/${d.weight} · ${d.count}/${d.target}`).join('\n')}

MÉTRICAS DEL TEXTO
• Palabras: ${r.stats.words}
• Frases: ${r.stats.sentences}
• Media palabras/frase: ${r.stats.avgSentence}
• Frases largas: ${r.stats.longSentences}
• Repeticiones detectadas: ${r.stats.repeated.length}

PROBLEMAS DETECTADOS
${r.flags.map(f => `• ${f.text}`).join('\n')}

SIGUIENTE PASO
${r.next}`;
}

function updateAnalysisUI(r) {
  $('responseScore').textContent = r.score;
  $('responseScore').style.color = barColor(r.score);
  $('responseFill').style.width = `${r.score}%`;
  $('responseScoreText').textContent = r.score >= 82 ? 'Muy buena respuesta editorial.' : r.score >= 62 ? 'Aprovechable, pero necesita repregunta.' : 'Floja: fuerza precisión antes de usarla.';
  $('analysisBreakdown').innerHTML = r.dimensions.map(d => barRow(d.name, d.percent)).join('');
  $('flagsList').classList.remove('empty');
  $('flagsList').innerHTML = r.flags.map(f => `<div class="flag ${f.type}">${escapeHTML(f.text)}</div>`).join('');
  $('nextStep').textContent = r.next;
}

function barRow(name, value) {
  return `<div class="bar-row"><span class="bar-name">${escapeHTML(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%;background:${barColor(value)}"></div></div><span class="bar-value">${value}</span></div>`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

function scoreNovelText(text) {
  const st = textStats(text);
  const lower = text.toLowerCase();
  const actionWords = countRegex(lower, [/golp/gi, /corre/gi, /grit/gi, /sangre/gi, /muert/gi, /romp/gi, /huye/gi, /dispar/gi, /amenaz/gi, /miedo/gi, /peligro/gi]);
  const conflictWords = countRegex(lower, [/pero/gi, /sin embargo/gi, /aunque/gi, /no pod/gi, /prohib/gi, /se neg/gi, /fall/gi, /deuda/gi, /culpa/gi, /secreto/gi]);
  const sensory = countRegex(lower, [/olor/gi, /frío|fria|fría/gi, /sabor/gi, /ruido/gi, /luz/gi, /sombra/gi, /piel/gi, /sangre/gi, /humo/gi, /lluvia/gi]);
  const abstract = countRegex(lower, [/verdad/gi, /destino/gi, /alma/gi, /mundo/gi, /silencio/gi, /oscuridad/gi, /miedo/gi, /tiempo/gi]);
  let prose = 68;
  prose += st.avgSentence >= 8 && st.avgSentence <= 24 ? 9 : -8;
  prose -= Math.min(14, st.longSentences * 2);
  prose -= Math.min(12, st.repeated.length * 2);
  prose += Math.min(8, sensory);
  prose -= Math.min(8, Math.max(0, abstract - sensory));
  prose += st.paragraphs >= 3 ? 5 : -5;
  prose = clamp(prose);

  let tension = 45 + Math.min(25, actionWords * 2) + Math.min(20, conflictWords * 3) + Math.min(10, (text.match(/[?!¿¡]/g) || []).length);
  tension = clamp(tension);

  let artificial = 100;
  artificial -= Math.min(25, st.longSentences * 3);
  artificial -= Math.min(22, st.repeated.length * 3);
  artificial -= Math.min(18, countRegex(lower, [/no era .* sino/gi, /como si/gi, /algo dentro/gi, /en el fondo/gi, /la verdad/gi, /el silencio/gi]) * 2);
  artificial = clamp(artificial);

  return { prose, tension, artificial, stats: st, actionWords, conflictWords, sensory, abstract, overall: Math.round((prose + tension + artificial) / 3) };
}

function compareVersions() {
  const a = $('versionA').value.trim();
  const b = $('versionB').value.trim();
  if (!a || !b) { toast('Pega la versión A y la versión B.', 'warn'); return; }
  const A = scoreNovelText(a);
  const B = scoreNovelText(b);
  const delta = B.overall - A.overall;
  const report = [];
  report.push(`VEREDICTO A/B: ${delta > 8 ? 'La versión B mejora claramente.' : delta >= 0 ? 'La versión B mejora algo, pero no es definitiva.' : 'La versión B empeora o pierde fuerza.'}`);
  report.push(`Mejora neta estimada: ${delta >= 0 ? '+' : ''}${delta} puntos`);
  report.push('');
  report.push('MÉTRICAS');
  report.push(`• Calidad global: A ${A.overall}/100 → B ${B.overall}/100`);
  report.push(`• Prosa: A ${A.prose} → B ${B.prose}`);
  report.push(`• Tensión: A ${A.tension} → B ${B.tension}`);
  report.push(`• Naturalidad anti-IA: A ${A.artificial} → B ${B.artificial}`);
  report.push(`• Palabras: A ${A.stats.words} → B ${B.stats.words} (${B.stats.words - A.stats.words >= 0 ? '+' : ''}${B.stats.words - A.stats.words})`);
  report.push(`• Frases largas: A ${A.stats.longSentences} → B ${B.stats.longSentences}`);
  report.push(`• Repeticiones: A ${A.stats.repeated.length} → B ${B.stats.repeated.length}`);
  report.push('');
  report.push('RIESGOS EN B');
  const risks = [];
  if (B.stats.longSentences > A.stats.longSentences) risks.push('Aumentan las frases largas; puede sonar más denso o artificial.');
  if (B.tension < A.tension) risks.push('B pierde tensión respecto a A; revisa conflicto, amenaza y consecuencia.');
  if (B.stats.words > A.stats.words * 1.25) risks.push('B se alarga demasiado; puede estar explicando de más.');
  if (B.stats.repeated.length > 0) risks.push(`Repeticiones principales en B: ${B.stats.repeated.map(([w, n]) => `${w}(${n})`).join(', ')}.`);
  report.push(risks.length ? risks.map(x => `• ${x}`).join('\n') : '• No se detectan riesgos graves por métrica.');
  report.push('');
  report.push('PRÓXIMO PASO');
  report.push(delta > 8 ? 'Haz lectura en voz alta y pasa a pulido RAE/KDP.' : 'Pide una reescritura quirúrgica centrada en tensión, frases largas y repeticiones.');

  const text = report.join('\n');
  $('compareOutput').textContent = text;
  state.lastComparison = { A, B, delta, text, createdAt: nowShort() };
  updateDashboard();
  saveState();
  toast('Comparación A/B completada.');
}

function parseChapters(text) {
  const src = normalizeText(text);
  if (!src) return [];
  const lines = src.split('\n');
  const headerRe = /^\s*(cap[íi]tulo\s+[\divxlcdm]+|#{1,3}\s+.+|\d{1,2}[\).\-]\s+.+|acto\s+[ivxlcdm]+)\s*$/i;
  const chunks = [];
  let currentTitle = 'Inicio';
  let current = [];
  for (const line of lines) {
    if (headerRe.test(line) && current.join('\n').trim().length > 250) {
      chunks.push({ title: currentTitle, text: current.join('\n').trim() });
      currentTitle = line.trim().replace(/^#+\s*/, '');
      current = [];
    } else if (headerRe.test(line) && current.length === 0) {
      currentTitle = line.trim().replace(/^#+\s*/, '');
    } else {
      current.push(line);
    }
  }
  if (current.join('\n').trim()) chunks.push({ title: currentTitle, text: current.join('\n').trim() });
  if (chunks.length <= 1 && words(src).length > 2500) return splitByWordCount(src, 1800);
  return chunks.filter(c => words(c.text).length > 60);
}

function splitByWordCount(text, size) {
  const tokens = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < tokens.length; i += size) {
    chunks.push({ title: `Bloque ${chunks.length + 1}`, text: tokens.slice(i, i + size).join(' ') });
  }
  return chunks;
}

function renderNovelAudit(audit) {
  if (!audit || !audit.rows) {
    $('novelAuditOutput').textContent = 'Pendiente.';
    return;
  }
  const avg = audit.avg;
  const avgTension = audit.avgTension;
  const rows = audit.rows;
  const weak = rows.filter(r => r.overall < 62 || r.tension < 55).slice(0, 8);
  const html = `<div class="audit-card">
    <strong>Resultado global: <span class="badge ${colorClass(avg)}">${avg}/100</span></strong><br>
    Capítulos/bloques detectados: ${rows.length}. Tensión media: ${avgTension}/100.<br>
    Prioridad: ${weak.length ? `revisar ${weak.map(w => `#${w.index}`).join(', ')}` : 'pulido fino y lectura humana.'}
  </div>
  <div class="table-scroll" tabindex="0" aria-label="Tabla de auditoría de novela">
    <table class="audit-table">
      <thead><tr><th>#</th><th>Bloque</th><th>Global</th><th>Tensión</th><th>Prosa</th><th>Anti-IA</th><th>Problemas</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${r.index}</td><td>${escapeHTML(r.title)}</td><td><span class="badge ${colorClass(r.overall)}">${r.overall}</span></td><td>${r.tension}</td><td>${r.prose}</td><td>${r.artificial}</td><td>${escapeHTML(r.problems.join(', '))}</td></tr>`).join('')}</tbody>
    </table>
  </div>`;
  $('novelAuditOutput').classList.remove('empty');
  $('novelAuditOutput').innerHTML = html;
}

function runNovelAudit() {
  const text = $('novelInput').value.trim();
  if (!text) { toast('Pega la novela, escaleta o capítulos para auditar.', 'warn'); return; }
  const chapters = parseChapters(text);
  if (!chapters.length) { toast('No hay texto suficiente para auditar.', 'warn'); return; }
  const rows = chapters.map((ch, i) => {
    const q = scoreNovelText(ch.text);
    const problems = [];
    if (q.stats.words < 700) problems.push('bloque/capítulo corto');
    if (q.tension < 58) problems.push('tensión baja');
    if (q.prose < 62) problems.push('prosa densa o repetida');
    if (q.artificial < 65) problems.push('riesgo de frase plantilla/IA');
    if (!problems.length) problems.push('funciona por métrica');
    return { index: i + 1, title: ch.title, ...q, problems };
  });
  const avg = Math.round(rows.reduce((s, r) => s + r.overall, 0) / rows.length);
  const avgTension = Math.round(rows.reduce((s, r) => s + r.tension, 0) / rows.length);
  const weak = rows.filter(r => r.overall < 62 || r.tension < 55).slice(0, 8);
  state.lastNovelAudit = { avg, avgTension, chapters: rows.length, rows, createdAt: nowShort() };
  renderNovelAudit(state.lastNovelAudit);
 updateDashboard();
  saveState();
  toast('Auditoría completa generada.');
}

function saveMemory() {
  const note = $('memoryNote').value.trim() || $('analysisOutput').textContent.trim();
  if (!note || note === 'Pendiente.') { toast('Escribe una memoria o genera un diagnóstico.', 'warn'); return; }
  state.memory.unshift({ id: uid(), note, ts: nowShort() });
  state.memory = state.memory.slice(0, 80);
  $('memoryNote').value = '';
  renderMemory();
  updateDashboard();
  saveState();
  toast('Memoria editorial guardada.');
}

function renderMemory() {
  const list = $('memoryList');
  if (!state.memory.length) {
    list.className = 'memory-list empty';
    list.textContent = 'Sin memoria editorial todavía.';
    return;
  }
  list.className = 'memory-list';
  list.innerHTML = state.memory.map(item => `<div class="memory-item"><div class="item-title">${escapeHTML(item.ts)}</div><div>${escapeHTML(item.note)}</div><div class="item-actions"><button data-delete-memory="${safeDataId(item.id)}" class="danger">Eliminar</button><button data-use-memory="${safeDataId(item.id)}">Añadir al prompt</button></div></div>`).join('');
}

function updateDashboard() {
  const analysis = state.lastAnalysis?.score || 0;
  const compare = state.lastComparison ? clamp(65 + state.lastComparison.delta) : 0;
  const novel = state.lastNovelAudit?.avg || 0;
  const tension = state.lastNovelAudit?.avgTension || 0;
  const memory = Math.min(100, state.memory.length * 12);
  const prompt = state.lastPrompt ? 76 : 0;
  const aiBridge = state.aiConfig?.provider && state.aiConfig.provider !== 'off' ? 72 : 0;
  const values = [
    ['Prompts', prompt],
    ['Respuesta IA', analysis],
    ['Comparador A/B', compare],
    ['Novela completa', novel],
    ['Tensión global', tension],
    ['Memoria', memory],
    ['IA opcional', aiBridge]
  ];
  const active = values.filter(([, v]) => v > 0);
  const health = active.length ? Math.round(active.reduce((s, [, v]) => s + v, 0) / active.length) : 0;
  const risk = health ? clamp(100 - health + (state.lastNovelAudit?.rows?.filter(r => r.overall < 62).length || 0) * 3) : 0;
  $('kpiHealth').textContent = health ? `${health}` : '--';
  $('kpiRisk').textContent = health ? `${risk}` : '--';
  $('kpiChapters').textContent = state.lastNovelAudit?.chapters || 0;
  $('kpiMemory').textContent = state.memory.length;
  $('dashboardBars').innerHTML = values.map(([n, v]) => barRow(n, v)).join('');
  $('globalVerdict').textContent = !health ? 'Aún no hay datos suficientes.' : health >= 82 ? 'Muy cerca de publicación: toca pulido fino, lectura humana y comprobación KDP.' : health >= 65 ? 'Buena base: faltan decisiones de reescritura y limpieza de puntos débiles.' : 'No publicar todavía: necesita reescritura prioritaria antes de maquetar.';
  state.dashboard = { health, risk, updatedAt: nowShort() };
}

function saveProject() {
  const id = state.activeProjectId || uid();
  state.activeProjectId = id;
  state.projects[id] = collectProjectData(id);
  saveState();
  renderProjects();
  toast('Proyecto guardado.');
}

function collectProjectData(id = state.activeProjectId) {
  return {
    id,
    updatedAt: nowShort(),
    title: $('projectTitle').value.trim() || 'Proyecto sin título',
    genre: $('projectGenre').value,
    goal: $('projectGoal').value,
    hardness: $('hardness').value,
    context: $('sourceContext').value,
    focus: $('focusTarget').value,
    prompt: $('promptOutput').textContent,
    aiResponse: $('aiResponse').value,
    analysis: $('analysisOutput').textContent,
    versionA: $('versionA').value,
    versionB: $('versionB').value,
    compare: $('compareOutput').textContent,
    novelInput: $('novelInput').value,
    memoryNote: $('memoryNote').value,
    log: $('sessionLog').value,
    stateSnapshot: {
      memory: state.memory,
      lastPrompt: state.lastPrompt,
      lastAnalysis: state.lastAnalysis,
      lastComparison: state.lastComparison,
      lastNovelAudit: state.lastNovelAudit,
      dashboard: state.dashboard,
      aiConfig: state.aiConfig
    }
  };
}

function loadProject(id) {
  const p = state.projects[id];
  if (!p) return;
  state.activeProjectId = id;
  $('projectTitle').value = p.title || '';
  $('projectGenre').value = p.genre || '';
  $('projectGoal').value = p.goal || 'publicacion';
  $('hardness').value = p.hardness || 'alta';
  $('sourceContext').value = p.context || '';
  $('focusTarget').value = p.focus || '';
  $('promptOutput').textContent = p.prompt || 'Elige un botón de la izquierda. Empieza por “Prompt maestro editorial”.';
  $('aiResponse').value = p.aiResponse || '';
  $('analysisOutput').textContent = p.analysis || 'Pendiente.';
  $('versionA').value = p.versionA || '';
  $('versionB').value = p.versionB || '';
  $('compareOutput').textContent = p.compare || 'Pendiente.';
  $('novelInput').value = p.novelInput || '';
  $('memoryNote').value = p.memoryNote || '';
  $('sessionLog').value = p.log || '';
  if (p.stateSnapshot) {
    state.memory = p.stateSnapshot.memory || [];
    state.lastPrompt = p.stateSnapshot.lastPrompt || p.prompt || '';
    state.lastAnalysis = p.stateSnapshot.lastAnalysis || null;
    state.lastComparison = p.stateSnapshot.lastComparison || null;
    state.lastNovelAudit = p.stateSnapshot.lastNovelAudit || null;
    state.dashboard = p.stateSnapshot.dashboard || {};
    if (p.stateSnapshot.aiConfig) state.aiConfig = normalizeState({ aiConfig: p.stateSnapshot.aiConfig }).aiConfig;
  }
  hydrateAIConfig();
  renderMemory();
  if (state.lastNovelAudit) renderNovelAudit(state.lastNovelAudit); else $('novelAuditOutput').textContent = 'Pendiente.';
  if (state.lastAnalysis) updateAnalysisUI(state.lastAnalysis);
  updateDashboard();
  saveState();
  renderProjects();
  toast(`Proyecto cargado: ${p.title}`);
}

function renderProjects() {
  const list = $('projectList');
  const projects = Object.values(state.projects).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  if (!projects.length) {
    list.className = 'stack small-list empty';
    list.textContent = 'Sin proyectos guardados.';
    return;
  }
  list.className = 'stack small-list';
  list.innerHTML = projects.map(p => `<div class="project-item" data-load-project="${safeDataId(p.id)}"><div class="item-title">${escapeHTML(p.title || 'Sin título')}</div><div class="item-meta">${escapeHTML(p.genre || '')} · ${escapeHTML(p.updatedAt || '')}</div><div class="item-actions"><button data-load-project="${safeDataId(p.id)}">Abrir</button><button class="danger" data-delete-project="${safeDataId(p.id)}">Eliminar</button></div></div>`).join('');
}

function newProject() {
  state.activeProjectId = null;
  ['projectTitle','projectGenre','sourceContext','focusTarget','aiResponse','versionA','versionB','novelInput','memoryNote','sessionLog'].forEach(id => $(id).value = '');
  $('projectGoal').value = 'publicacion';
  $('hardness').value = 'alta';
  $('promptOutput').textContent = 'Elige un botón de la izquierda. Empieza por “Prompt maestro editorial”.';
  $('analysisOutput').textContent = 'Pendiente.';
  $('compareOutput').textContent = 'Pendiente.';
  $('novelAuditOutput').textContent = 'Pendiente.';
  state.memory = [];
  state.lastPrompt = '';
  state.lastAnalysis = null;
  state.lastComparison = null;
  state.lastNovelAudit = null;
  renderMemory();
  updateDashboard();
  saveState();
  toast('Proyecto nuevo.');
}

function resetWorkspace() {
  if (!confirm('¿Limpiar el área actual? Los proyectos guardados se conservan.')) return;
  newProject();
}

function renderHistory() {
  const list = $('historyList');
  if (!state.history.length) {
    list.className = 'stack small-list empty';
    list.textContent = 'Sin historial.';
    return;
  }
  list.className = 'stack small-list';
  list.innerHTML = state.history.map(h => `<div class="history-item" data-history="${safeDataId(h.id)}"><div class="item-title">${escapeHTML(h.label)}</div><div class="item-meta">${escapeHTML(h.ts)} · ${escapeHTML(h.content.slice(0, 90).replace(/\n/g, ' '))}...</div></div>`).join('');
}

function addToLog() {
  const entry = `\n\n════ ${nowShort()} ════\nPROMPT\n${$('promptOutput').textContent}\n\nDIAGNÓSTICO\n${$('analysisOutput').textContent}\n\nCOMPARACIÓN\n${$('compareOutput').textContent}`;
  $('sessionLog').value += entry;
  toast('Añadido al registro.');
}

function exportReport() {
  const p = collectProjectData();
  const content = `# AETHERION Editorial OS — Informe de proyecto

**Proyecto:** ${p.title}\n**Género:** ${p.genre || '—'}\n**Fecha:** ${nowShort()}\n
## Dashboard

- Salud: ${state.dashboard.health || '—'}
- Riesgo KDP: ${state.dashboard.risk || '—'}
- Capítulos/bloques: ${state.lastNovelAudit?.chapters || 0}
- Memorias editoriales: ${state.memory.length}

## Prompt actual

\`\`\`text
${p.prompt}
\`\`\`

## Diagnóstico

\`\`\`text
${p.analysis}
\`\`\`

## Comparación A/B

\`\`\`text
${p.compare}
\`\`\`

## Memoria editorial

${state.memory.map((m, i) => `${i + 1}. ${m.ts} — ${m.note}`).join('\n') || 'Sin memoria.'}

## Registro

\`\`\`text
${p.log || 'Sin registro.'}
\`\`\`
`;
  downloadText(content, `informe_aetherion_${slug(p.title)}_${nowFile()}.md`, 'text/markdown');
  toast('Informe exportado.');
}

function exportProjectJSON() {
  saveProject();
  const content = JSON.stringify({ app: 'AETHERION Editorial OS', version: '2.0.0', exportedAt: new Date().toISOString(), state: sanitizeStateForStorage(state) }, null, 2);
  downloadText(content, `aetherion_proyecto_${nowFile()}.json`, 'application/json');
}

function importProjectJSON(file) {
  if (!file) return;
  const maxImportBytes = 25 * 1024 * 1024;
  if (file.size && file.size > maxImportBytes) {
    toast('El JSON supera 25 MB. Divide el proyecto o importa desde un entorno local.', 'bad');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.state || typeof data.state !== 'object') throw new Error('Formato inválido');
      state = normalizeState(data.state);
      saveState();
      renderAll();
      hydrateAIConfig();
      toast('Proyecto importado.');
    } catch {
      toast('No se pudo importar el JSON.', 'bad');
    }
  };
  reader.onerror = () => toast('No se pudo leer el archivo.', 'bad');
  reader.readAsText(file);
}

function downloadText(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function slug(text) {
  return (text || 'proyecto').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 45);
}

function renderAll() {
  hydrateAIConfig();
  renderHistory();
  renderProjects();
  renderMemory();
  if (state.lastPrompt) $('promptOutput').textContent = state.lastPrompt;
  if (state.lastAnalysis) {
    $('analysisOutput').textContent = renderAnalysisReport(state.lastAnalysis);
    updateAnalysisUI(state.lastAnalysis);
  }
  if (state.lastComparison) $('compareOutput').textContent = state.lastComparison.text;
  if (state.lastNovelAudit) renderNovelAudit(state.lastNovelAudit);
  updateDashboard();
}

function bindEvents() {
  $$('[data-prompt]').forEach(btn => btn.addEventListener('click', () => generatePrompt(btn.dataset.prompt)));
  $('btnAnalyzeResponse').addEventListener('click', evaluateAIResponse);
  $('btnCopyPrompt').addEventListener('click', () => writeClipboard($('promptOutput').textContent, 'Prompt copiado.'));
  $('btnAddToLog').addEventListener('click', addToLog);
  $('btnExportReport').addEventListener('click', exportReport);
  $('btnSaveProject').addEventListener('click', saveProject);
  $('btnNewProject').addEventListener('click', newProject);
  $('btnResetWorkspace').addEventListener('click', resetWorkspace);
  $('btnClearHistory').addEventListener('click', () => { state.history = []; renderHistory(); saveState(); toast('Historial vacío.'); });
  $('btnCompare').addEventListener('click', compareVersions);
  $('btnCopyCompare').addEventListener('click', () => writeClipboard($('compareOutput').textContent, 'Informe A/B copiado.'));
  $('btnRunNovelAudit').addEventListener('click', runNovelAudit);
  $('btnSaveMemory').addEventListener('click', saveMemory);
  $('btnExportProject').addEventListener('click', exportProjectJSON);
  $('btnTestAI').addEventListener('click', testAIConnection);
  $('btnRunAI').addEventListener('click', runPromptWithAI);
  ['aiProvider','aiEndpoint','aiModel'].forEach(id => $(id).addEventListener('input', () => { persistAIConfig(); updateAIHelp(); }));
  $('aiProvider').addEventListener('change', () => {
    if ($('aiProvider').value === 'ollama' && !$('aiEndpoint').value.trim()) $('aiEndpoint').value = 'http://localhost:11434';
    if ($('aiProvider').value === 'openai_compatible' && !$('aiEndpoint').value.trim()) $('aiEndpoint').value = 'https://api.openai.com/v1/chat/completions';
    persistAIConfig(); updateAIHelp();
  });
  $('importProjectFile').addEventListener('change', (e) => { if (e.target.files[0]) importProjectJSON(e.target.files[0]); e.target.value = ''; });
  $('btnPasteSample').addEventListener('click', () => {
    $('aiResponse').value = `Veredicto editorial: el capítulo tiene atmósfera, pero pierde tensión porque explica el conflicto en vez de dramatizarlo. En la escena central, el fragmento «la verdad era demasiado grande» suena abstracto y cierra el misterio de forma sentenciosa. Problema crítico: la amenaza se verbaliza antes de tener consecuencias físicas. Impacto en el lector: baja la incertidumbre y aparece sensación de resumen. Solución: recortar explicación, añadir una consecuencia concreta y hacer que el personaje tome una mala decisión bajo presión. Prioridad alta. Reescritura sugerida: convertir el monólogo en una acción con ruido, olor, error humano y una pérdida irreversible. Acciones: eliminar dos párrafos expositivos, fusionar la escena de la llamada con el descubrimiento, reforzar el gancho final del capítulo y revisar continuidad del objeto clave.`;
    toast('Ejemplo cargado.');
  });

  document.body.addEventListener('click', (e) => {
    const del = e.target.closest('[data-delete-project]');
    if (del) {
      e.stopPropagation();
      if (confirm('¿Eliminar este proyecto?')) {
        delete state.projects[del.dataset.deleteProject];
        if (state.activeProjectId === del.dataset.deleteProject) state.activeProjectId = null;
        saveState();
        renderProjects();
        updateDashboard();
        toast('Proyecto eliminado.', 'bad');
      }
      return;
    }

    const memDel = e.target.closest('[data-delete-memory]');
    if (memDel) {
      e.stopPropagation();
      state.memory = state.memory.filter(x => x.id !== memDel.dataset.deleteMemory);
      renderMemory();
      updateDashboard();
      saveState();
      toast('Memoria eliminada.', 'bad');
      return;
    }

    const memUse = e.target.closest('[data-use-memory]');
    if (memUse) {
      e.stopPropagation();
      const item = state.memory.find(x => x.id === memUse.dataset.useMemory);
      if (item) { $('sourceContext').value += `${$('sourceContext').value ? '\n' : ''}Memoria editorial: ${item.note}`; toast('Memoria añadida al contexto.'); }
      return;
    }

    const hist = e.target.closest('[data-history]');
    if (hist) {
      const item = state.history.find(x => x.id === hist.dataset.history);
      if (item) { $('promptOutput').textContent = item.content; state.lastPrompt = item.content; saveState(); toast('Prompt restaurado.'); }
      return;
    }

    const load = e.target.closest('[data-load-project]');
    if (load) loadProject(load.dataset.loadProject);
  });

  ['projectTitle','projectGenre','sourceContext','focusTarget','aiResponse','versionA','versionB','novelInput','memoryNote','sessionLog','aiEndpoint','aiModel'].forEach(id => {
    $(id).addEventListener('input', () => setAutosave('Editando'));
  });
}

bindEvents();
renderAll();
initPersistentStorage();
