/**
 * ============================================================================
 * AWESOME ENGLISH LEADERBOARD & LEARNING MEMORY API (Google Apps Script)
 * ============================================================================
 * Repository: https://github.com/jefry195/Awesome-English-Leaderboard-API
 * Database: Google Sheets (Dapat diekspor ke Microsoft Excel .xlsx kapan saja)
 * 
 * Fitur:
 * 1. Sheet "Leaderboard": Menyimpan skor global, ranking, level, dan akurasi.
 * 2. Sheet "Memory": Menyimpan memori riwayat belajar personal (kalimat yang dilatih,
 *    arah bahasa ID->EN / EN->ID, transkrip suara pengguna, dan catatan guru AI).
 * 3. Anti-Duplikasi Cerdas: Sheet & header tidak akan pernah terduplikasi.
 * 4. doGet Support:
 *    - ?action=leaderboard  -> Mengambil Top Leaderboard (JSON).
 *    - ?action=memory       -> Mengambil riwayat memori belajar untuk index.html & Gemini Canvas.
 * 5. doPost Support:
 *    - Menyimpan skor leaderboard dan riwayat latihan ke sheet Memory.
 * 6. Full CORS Support: Bisa dipanggil langsung dari Web, Canvas, atau cURL.
 */

const LEADERBOARD_SHEET_NAME = "Leaderboard";
const MEMORY_SHEET_NAME = "Memory";

const LEADERBOARD_HEADERS = ["Timestamp", "Player Name", "Game Mode", "Score", "Accuracy (%)", "Level", "Notes"];
const MEMORY_HEADERS = ["Timestamp", "Player Name", "Direction", "Prompt / Target", "User Response", "Accuracy (%)", "AI Teacher Notes"];

const MAX_ENTRIES = 50;

/**
 * Mendapatkan sheet Leaderboard dengan anti-duplikasi
 */
function getLeaderboardSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(LEADERBOARD_SHEET_NAME);

  if (!sheet) {
    const allSheets = ss.getSheets();
    if (allSheets.length === 1 && allSheets[0].getLastRow() === 0) {
      sheet = allSheets[0];
      sheet.setName(LEADERBOARD_SHEET_NAME);
    } else {
      sheet = ss.insertSheet(LEADERBOARD_SHEET_NAME);
    }
  }

  ensureHeader(sheet, LEADERBOARD_HEADERS, "#1e293b", "#f8fafc");
  return sheet;
}

/**
 * Mendapatkan sheet Memory dengan anti-duplikasi
 */
function getMemorySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(MEMORY_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(MEMORY_SHEET_NAME);
  }

  ensureHeader(sheet, MEMORY_HEADERS, "#312e81", "#e0e7ff");
  return sheet;
}

/**
 * Helper verifikasi header anti-duplikasi
 */
function ensureHeader(sheet, headers, bgColor, fontColor) {
  const lastRow = sheet.getLastRow();
  let hasHeader = false;

  if (lastRow > 0) {
    try {
      const firstCell = sheet.getRange(1, 1).getValue();
      if (firstCell && String(firstCell).trim().toLowerCase() === "timestamp") {
        hasHeader = true;
      }
    } catch (e) {
      hasHeader = false;
    }
  }

  if (!hasHeader) {
    if (lastRow === 0) {
      sheet.appendRow(headers);
    } else {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold");
    range.setBackground(bgColor);
    range.setFontColor(fontColor);
    range.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
}

/**
 * Menu otomatis di Toolbar Google Sheets
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("⚡ Awesome English")
      .addItem("Inisialisasi Database & Memory", "manualSetup")
      .addToUi();
  } catch (e) {}
}

function manualSetup() {
  getLeaderboardSheet();
  getMemorySheet();
  SpreadsheetApp.getUi().alert(
    "✅ Database & Memory Berhasil Diinisialisasi!\n\nSheet 'Leaderboard' dan 'Memory' telah diverifikasi aman tanpa duplikasi."
  );
}

/**
 * Handle GET Request (Leaderboard atau Learning Memory)
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toLowerCase() : "leaderboard";

    // 1. Ambil Memory Belajar (untuk Gemini Canvas & index.html)
    if (action === "memory") {
      const sheet = getMemorySheet();
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) {
        return createJsonResponse({ status: "success", type: "memory", total: 0, data: [] });
      }

      const rows = sheet.getRange(2, 1, lastRow - 1, MEMORY_HEADERS.length).getValues();
      const memories = rows
        .filter(r => r[3] && String(r[3]).trim() !== "")
        .reverse() // Tampilkan yang paling baru lebih dulu
        .slice(0, MAX_ENTRIES)
        .map((r, i) => ({
          id: i + 1,
          timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0] || ""),
          playerName: String(r[1] || "Jefri"),
          direction: String(r[2] || "ID -> EN"),
          target: String(r[3] || ""),
          userResponse: String(r[4] || ""),
          accuracy: Number(r[5]) || 0,
          notes: String(r[6] || "")
        }));

      return createJsonResponse({
        status: "success",
        type: "memory",
        total: memories.length,
        data: memories
      });
    }

    // 2. Ambil Leaderboard Ranking (Default)
    const sheet = getLeaderboardSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return createJsonResponse({ status: "success", type: "leaderboard", total: 0, data: [] });
    }

    const rows = sheet.getRange(2, 1, lastRow - 1, LEADERBOARD_HEADERS.length).getValues();
    const records = rows
      .filter(r => r[1] && String(r[1]).trim() !== "")
      .map((r, i) => ({
        id: i + 1,
        timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0] || ""),
        playerName: String(r[1] || "Anonymous"),
        gameMode: String(r[2] || "Speaking & Shadowing"),
        score: Number(r[3]) || 0,
        accuracy: Number(r[4]) || 0,
        level: Number(r[5]) || 1,
        notes: String(r[6] || "")
      }));

    records.sort((a, b) => b.score - a.score);
    const topRecords = records.slice(0, MAX_ENTRIES);

    return createJsonResponse({
      status: "success",
      type: "leaderboard",
      total: records.length,
      data: topRecords
    });

  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

/**
 * Handle POST Request (Menyimpan Skor ke Leaderboard & Riwayat ke Memory)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const timestamp = new Date();
    const playerName = String(payload.playerName || payload.name || "Jefri").trim();
    const gameMode = String(payload.gameMode || payload.mode || "Speaking Arena").trim();
    const score = Number(payload.score) || 0;
    const accuracy = Number(payload.accuracy) || 0;
    const level = Number(payload.level) || 1;
    const notes = String(payload.notes || "").trim();
    const direction = String(payload.direction || "ID -> EN").trim();

    // 1. Simpan ke Sheet Leaderboard
    const lbSheet = getLeaderboardSheet();
    lbSheet.appendRow([timestamp, playerName, gameMode, score, accuracy, level, notes]);

    // 2. Simpan ke Sheet Memory (Long-Term Learning History)
    const memSheet = getMemorySheet();
    if (payload.history && Array.isArray(payload.history)) {
      payload.history.forEach(item => {
        memSheet.appendRow([
          timestamp,
          playerName,
          direction,
          item.target || "",
          item.heard || item.response || "",
          Number(item.accuracy) || 0,
          item.feedback || item.notes || ""
        ]);
      });
    } else if (payload.target) {
      memSheet.appendRow([
        timestamp,
        playerName,
        direction,
        payload.target,
        payload.heard || payload.userResponse || "",
        accuracy,
        notes
      ]);
    }

    return createJsonResponse({
      status: "success",
      message: "Score & Learning Memory successfully recorded to Google Sheets / Excel database!",
      entry: {
        timestamp: timestamp.toISOString(),
        playerName: playerName,
        score: score,
        accuracy: accuracy
      }
    });

  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
