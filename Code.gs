/**
 * daylog ✦ — Google Apps Script backend
 *
 * Publicar como Web App:
 *   Executar como: Eu
 *   Quem tem acesso: Qualquer pessoa
 *
 * Recebe eventos JSON via POST, grava na aba "eventos".
 * Colunas: user_pin | user_email | timestamp_iso | event_date | type | label | detail | score | duration_min | notes
 */

const SHEET_NAME   = 'eventos';
const VALID_TOKEN  = 'dl-7x9k2m4p-tz3q8n1v';
const SPREADSHEET_ID = '1rEu8VXy9etCOqgPi1Rc60xXX8hr1nLZp1T1v9jc1GCI';

const HEADERS = [
  'user_pin',
  'user_email',
  'timestamp_iso',
  'event_date',
  'type',
  'label',
  'detail',
  'score',
  'duration_min',
  'notes'
];

// ── doPost ──────────────────────────────────────────────────
function doPost(e) {
  try {
    const raw  = e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const sheet  = getOrCreateSheet();
    const events = Array.isArray(data) ? data : [data];

    for (const event of events) {
      // token
      if (event._token !== VALID_TOKEN) continue;
      // type obrigatório
      if (!event.type) continue;
      // email mínimo válido
      if (!event.user_email || !String(event.user_email).includes('@')) continue;
      // PIN: 4 dígitos numéricos
      if (!/^\d{4}$/.test(String(event.user_pin || ''))) continue;

      const row = HEADERS.map(col => {
        const val = event[col];
        if (val === null || val === undefined) return '';
        return String(val).trim();
      });
      sheet.appendRow(row);
    }

    return jsonResponse({ ok: true, inserted: events.length });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── doGet ─────────────────────────────────────────────────────
function doGet() {
  return jsonResponse({ ok: true, message: 'daylog backend ativo ✓' });
}

// ── Helpers ───────────────────────────────────────────────────

function getOrCreateSheet() {
  const ss  = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);

    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a1b26');
    headerRange.setFontColor('#c0caf5');
    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1,  90);  // user_pin
    sheet.setColumnWidth(2, 180);  // user_email
    sheet.setColumnWidth(3, 220);  // timestamp_iso
    sheet.setColumnWidth(4, 110);  // event_date
    sheet.setColumnWidth(5, 100);  // type
    sheet.setColumnWidth(6, 100);  // label
    sheet.setColumnWidth(7, 200);  // detail
    sheet.setColumnWidth(8,  60);  // score
    sheet.setColumnWidth(9, 100);  // duration_min
    sheet.setColumnWidth(10,200);  // notes
  }

  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
