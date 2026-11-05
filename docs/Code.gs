// Configure antes de implantar. A planilha permanece privada.
const SPREADSHEET_ID = '13nmwPAEqSTO1gEnvwwznxPA8OsmHOR7w9p7dwTgyNso';
const TAB_NAME = 'Leads';
const HEADERS = ['request_id','Recebido em','Nome','E-mail','Telefone','Investimento mensal','Situações','Página','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const INVESTMENTS = ['Ainda não invisto em anúncios','Até R$ 3.000 por mês','De R$ 3.001 a R$ 10.000 por mês','De R$ 10.001 a R$ 30.000 por mês','Mais de R$ 30.000 por mês'];
const SITUATIONS = ['Tenho Pixel/API instalados, mas não sei se os dados estão chegando corretamente','Meta Ads, Google Ads e Google Analytics mostram resultados diferentes e não sei exatamente em quais números confiar','Quero entender melhor o que acontece com o cliente dentro da loja, do acesso até a compra','Já acompanho tudo, mas quero validar se minha configuração pode ser melhorada'];
function validId(id) { return /^[a-f0-9-]{36}$/.test(id || ''); }
function sheet() {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  const tab = book.getSheetByName(TAB_NAME) || book.insertSheet(TAB_NAME);
  if(tab.getLastRow()===0) {tab.appendRow(HEADERS);tab.setFrozenRows(1);}
  if(tab.getRange(1,1,1,HEADERS.length).getValues()[0].join('|')!==HEADERS.join('|')) throw new Error('Cabeçalho incompatível: use uma aba Leads nova.');
  return tab;
}
function exists(tab,id) {
  return tab.getLastRow()>1 && !!tab.getRange(2,1,tab.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext();
}
function safeCell(value) {
  const text=String(value || '').slice(0,2000);
  return /^[=+\-@\t\r\n]/.test(text)?"'"+text:text;
}
function ecommercePost(e) {
  try {
    const p=e.parameter || {};
    const situations=JSON.parse(p.situacoes || '[]');
    if(!validId(p.request_id) || p.website_check || !p.nome || p.nome.length>160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || '') || (p.email||'').length>254 || !p.telefone || p.telefone.length>40 || !INVESTMENTS.includes(p.investimento) || !Array.isArray(situations) || !situations.length || situations.length>4 || situations.some(s=>!SITUATIONS.includes(s))) throw new Error('Dados inválidos');
    const lock=LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const tab=sheet();
      if(!exists(tab,p.request_id)) tab.appendRow([p.request_id,new Date(),...['nome','email','telefone','investimento'].map(k=>safeCell(p[k])),safeCell(situations.join(' | ')),...['page','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>safeCell(p[k]))]);
      SpreadsheetApp.flush();
    } finally {lock.releaseLock();}
    return ContentService.createTextOutput('received');
  } catch(error) {
    console.error('Falha ao receber solicitação: '+error.message);
    return ContentService.createTextOutput('error');
  }
}
function ecommerceGet(e) {
  const id=(e.parameter || {}).id;
  let saved=false;
  if(validId(id)) {
    try {saved=exists(sheet(),id);} catch(error) {console.error(error.message);}
  }
  // Sem dados pessoais. Callback fixo; parâmetros não são executados como código.
  return ContentService.createTextOutput('window.diagnosticoAck('+JSON.stringify({id:validId(id)?id:'',saved:!!saved})+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}

const INFO_TAB = 'Leads Infoprodutores';
const INFO_MODELS = ["Lançamento","Perpétuo","Mentoria ou aplicação","Outro"];
const INFO_SITUATIONS = ["Não sei quais campanhas geram leads que viram vendas","Tenho divergências entre checkout, Meta Ads, Google Ads e GA4","Preciso implementar ou revisar eventos, Pixel e API de Conversões","Quero medir aplicações, leads qualificados e vendas do comercial"];
const INFO_HEADERS = ['request_id','Recebido em','Nome','E-mail','Telefone','Modelo de venda','Investimento mensal','Situações','Página','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
function infoSheet() {const book=SpreadsheetApp.openById(SPREADSHEET_ID);const tab=book.getSheetByName(INFO_TAB)||book.insertSheet(INFO_TAB);if(tab.getLastRow()===0){tab.appendRow(INFO_HEADERS);tab.setFrozenRows(1);}if(tab.getRange(1,1,1,INFO_HEADERS.length).getValues()[0].join('|')!==INFO_HEADERS.join('|'))throw new Error('Cabeçalho incompatível');return tab;}
function prepararAbaInfoprodutores(){infoSheet();}
function doPost(e){const p=e.parameter||{};if(p.form_id!=='diagnostico_infoprodutores')return ecommercePost(e);try{const situations=JSON.parse(p.situacoes||'[]');if(!validId(p.request_id)||p.website_check||!p.nome||p.nome.length>160||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email||'')||(p.email||'').length>254||!p.telefone||p.telefone.length>40||!INVESTMENTS.includes(p.investimento)||!INFO_MODELS.includes(p.modelo)||!Array.isArray(situations)||!situations.length||situations.length>4||situations.some(s=>!INFO_SITUATIONS.includes(s)))throw new Error('Dados inválidos');const lock=LockService.getScriptLock();lock.waitLock(20000);try{const tab=infoSheet();if(!exists(tab,p.request_id))tab.appendRow([p.request_id,new Date(),...['nome','email','telefone','modelo','investimento'].map(k=>safeCell(p[k])),safeCell(situations.join(' | ')),...['page','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>safeCell(p[k]))]);SpreadsheetApp.flush();}finally{lock.releaseLock();}return ContentService.createTextOutput('received');}catch(error){console.error(error.message);return ContentService.createTextOutput('error');}}
function doGet(e){const p=e.parameter||{};if(p.form_id!=='diagnostico_infoprodutores')return ecommerceGet(e);let saved=false;if(validId(p.id)){try{saved=exists(infoSheet(),p.id);}catch(error){console.error(error.message);}}return ContentService.createTextOutput('window.diagnosticoAck('+JSON.stringify({id:validId(p.id)?p.id:'',saved:!!saved})+');').setMimeType(ContentService.MimeType.JAVASCRIPT);}
