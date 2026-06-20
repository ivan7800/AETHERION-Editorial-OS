/* Local smoke test for AETHERION Editorial OS. No dependencies. */
const fs = require('fs');
const vm = require('vm');

const ids = [
  'autosaveStatus','toast','projectTitle','projectGenre','projectGoal','hardness','sourceContext','focusTarget',
  'promptOutput','promptTime','aiResponse','analysisOutput','analysisTime','responseScore','responseFill',
  'responseScoreText','analysisBreakdown','flagsList','nextStep','versionA','versionB','compareOutput',
  'novelInput','novelAuditOutput','memoryNote','memoryList','sessionLog','kpiHealth','kpiRisk','kpiChapters',
  'kpiMemory','dashboardBars','globalVerdict','historyList','projectList','importProjectFile','btnAnalyzeResponse',
  'btnCopyPrompt','btnAddToLog','btnExportReport','btnSaveProject','btnNewProject','btnResetWorkspace','btnClearHistory',
  'btnCompare','btnCopyCompare','btnRunNovelAudit','btnSaveMemory','btnExportProject','btnPasteSample',
  'aiProvider','aiEndpoint','aiModel','aiApiKey','aiBridgeStatus','btnTestAI','btnRunAI'
];
function el(id){
  return {
    id, value:'', textContent:'', innerHTML:'', dataset:{}, style:{}, className:'', files:[],
    classList:{ add(){}, remove(){}, contains(){ return false; } },
    appendChild(){}, remove(){}, focus(){}, select(){}, click(){},
    addEventListener(){}, setAttribute(){}, getAttribute(){ return null; },
  };
}
const elements = Object.fromEntries(ids.map(id => [id, el(id)]));
elements.projectGoal.value = 'publicacion';
elements.hardness.value = 'alta';
elements.aiProvider.value = 'off';
elements.aiEndpoint.value = 'http://localhost:11434';
elements.aiModel.value = 'llama3.1';

const document = {
  getElementById(id){ if(!elements[id]) elements[id] = el(id); return elements[id]; },
  querySelectorAll(sel){ return sel === '[data-prompt]' ? [] : []; },
  createElement(tag){ return el(tag); },
  body: { appendChild(){}, addEventListener(){} },
  execCommand(){ return true; },
};
const localStorage = {
  data:{}, getItem(k){ return this.data[k] || null; }, setItem(k,v){ this.data[k]=String(v); }, removeItem(k){ delete this.data[k]; }
};
const context = {
  console, document, localStorage,
  window: { crypto: { randomUUID: () => 'uuid_test_' + Math.random().toString(36).slice(2) }, isSecureContext: true },
  crypto: { randomUUID: () => 'uuid_global_should_not_be_used' },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  FileReader: function(){}, Blob: function(){}, URL: { createObjectURL(){ return 'blob:test'; }, revokeObjectURL(){} },
  setTimeout(fn){ return 1; }, clearTimeout(){}, confirm(){ return true; }, structuredClone: undefined
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('app.js','utf8'), context);

context.generatePrompt('maestro');
if (!elements.promptOutput.textContent.includes('NOVELA / PROYECTO')) throw new Error('Prompt no generado');

elements.aiResponse.value = 'Veredicto editorial. Capítulo 1: en la escena del pasillo, el fragmento «la verdad era demasiado grande» falla. Problema crítico: baja la tensión y rompe el misterio. Solución: reescribir, recortar explicación, añadir consecuencia, mover la revelación, prioridad alta. Arquitectura, personajes, continuidad, ritmo, voz, KDP, IA. 1. Acción concreta. 2. Evidencia. 3. Plan.';
context.evaluateAIResponse();
if (elements.responseScore.textContent === '--') throw new Error('Análisis no actualiza score');

elements.versionA.value = 'La verdad era silencio. El mundo era oscuridad. Pero nadie se movió.';
elements.versionB.value = 'El personaje cerró la puerta. Olía a humedad. Algo golpeó detrás. Pero el protagonista apagó la linterna.';
context.compareVersions();
if (!elements.compareOutput.textContent.includes('VEREDICTO A/B')) throw new Error('Comparador no funciona');

elements.novelInput.value = 'Capítulo 1\n' + 'El personaje corre pero falla. Hay sangre, ruido y peligro. '.repeat(80) + '\n\nCapítulo 2\n' + 'La verdad era silencio y oscuridad. '.repeat(100);
context.runNovelAudit();
if (!elements.novelAuditOutput.innerHTML.includes('Resultado global')) throw new Error('Auditoría novela no renderiza');

elements.memoryNote.value = 'Evitar cierres sentenciosos.';
context.saveMemory();
if (!elements.memoryList.innerHTML.includes('Evitar cierres')) throw new Error('Memoria no guarda');

elements.projectTitle.value = 'Proyecto prueba';
context.saveProject();
if (!elements.projectList.innerHTML.includes('Proyecto prueba')) throw new Error('Proyecto no guarda/renderiza');

console.log('node-smoke-ok');
