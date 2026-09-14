/**
 * ============================================================================
 * AWESOME ENGLISH LEADERBOARD API (Google Apps Script Backend)
 * ============================================================================
 * Repository: https://github.com/jefry195/Awesome-English-Leaderboard-API
 * Database: Google Sheets (Dapat diekspor ke Microsoft Excel .xlsx kapan saja)
 * 
 * Fitur:
 * 1. Auto-setup & Anti-Duplikasi Sheet:
 *    - Otomatis membuat/mengubah nama sheet menjadi "Leaderboard".
 *    - Tidak membuat sheet ganda jika sudah ada.
 * 2. Anti-Duplikasi Header:
 *    - Memeriksa baris 1 terlebih dahulu. Header hanya dibuat sekali.
 * 3. Menu Kustom di Toolbar Google Sheets:
 *    - "⚡ Awesome English > Inisialisasi / Periksa Database".
 * 4. API Endpoints:
 *    - GET: Mengambil daftar Top Leaderboard terurut (JSON).
 *    - POST: Menyimpan data skor & akurasi baru ke database (JSON).
 * 5. Full CORS Support:
 *    - Dapat dipanggil dari website, game, atau mobile app manapun.
 */

const SHEET_NAME = "Leaderboard";
const HEADERS = ["Timestamp", "Player Name", "Game Mode", "Score", "Accuracy (%)", "Level", "Notes"];
const MAX_LEADERBOARD_ENTRIES = 50;

/**
 * Mendapatkan sheet Leaderboard atau membuatnya secara otomatis tanpa duplikasi sheet/header
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // 1. Logika Anti-Duplikasi Sheet:
  if (!sheet) {
    const allSheets = ss.getSheets();
    // Jika hanya ada 1 sheet default (misal "Sheet1") dan masih kosong, ubah namanya langsung
    if (allSheets.length === 1 && allSheets[0].getLastRow() === 0) {
      sheet = allSheets[0];
      sheet.setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  // 2. Logika Anti-Duplikasi Header:
  const lastRow = sheet.getLastRow();
  let hasHeader = false;

  if (lastRow > 0) {
    try {
      const firstCellValue = sheet.getRange(1, 1).getValue();
      if (firstCellValue && String(firstCellValue).trim().toLowerCase() === "timestamp") {
        hasHeader = true;
      }
    } catch (err) {
      hasHeader = false;
    }
  }

  // Hanya buat header jika belum ada
  if (!hasHeader) {
    if (lastRow === 0) {
      sheet.appendRow(HEADERS);
    } else {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }

    // Styling & Format Header
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1e293b"); // Slate dark
    headerRange.setFontColor("#f8fafc"); // White slate
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    // Auto-fit lebar kolom
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

/**
 * Tambahkan menu interaktif otomatis di toolbar Google Sheets saat file dibuka
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("⚡ Awesome English")
      .addItem("Inisialisasi / Periksa Database", "manualSetup")
      .addToUi();
  } catch (e) {
    // Abaikan jika dijalankan di context non-UI
  }
}

/**
 * Fungsi manual untuk tombol menu Google Sheets
 */
function manualSetup() {
  const sheet = getOrCreateSheet();
  SpreadsheetApp.getUi().alert(
    "✅ Berhasil!\n\nSheet '" + sheet.getName() + "' dan baris Header telah terverifikasi aman tanpa duplikasi."
  );
}

/**
 * Handle GET Request (Mengambil Top Leaderboard dalam format JSON)
 */
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const lastRow = sheet.getLastRow();
    
    // Jika hanya ada header atau belum ada data
    if (lastRow <= 1) {
      return createJsonResponse({
        status: "success",
        total: 0,
        data: []
      });
    }

    // Ambil data mulai dari baris 2 hingga baris terakhir
    const dataRange = sheet.getRange(2, 1, lastRow - 1, HEADERS.length);
    const rows = dataRange.getValues();

    // Petakan ke array of object
    const records = rows
      .filter(row => row[1] && String(row[1]).trim() !== "") // filter baris kosong
      .map((row, index) => {
        return {
          id: index + 1,
          timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ""),
          playerName: String(row[1] || "Anonymous"),
          gameMode: String(row[2] || "Speaking & Shadowing"),
          score: Number(row[3]) || 0,
          accuracy: Number(row[4]) || 0,
          level: Number(row[5]) || 1,
          notes: String(row[6] || "")
        };
      });

    // Urutkan berdasarkan score tertinggi (descending)
    records.sort((a, b) => b.score - a.score);

    // Ambil Top N entries
    const topRecords = records.slice(0, MAX_LEADERBOARD_ENTRIES);

    return createJsonResponse({
      status: "success",
      total: records.length,
      data: topRecords
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Handle POST Request (Menerima Skor Baru dari Game Landing Page)
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
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
    const playerName = String(payload.playerName || payload.name || "Anonymous Learner").trim();
    const gameMode = String(payload.gameMode || payload.mode || "Speaking & Shadowing").trim();
    const score = Number(payload.score) || 0;
    const accuracy = Number(payload.accuracy) || 0;
    const level = Number(payload.level) || 1;
    const notes = String(payload.notes || "").trim();

    // Tambahkan baris data baru di bawah baris terakhir
    sheet.appendRow([timestamp, playerName, gameMode, score, accuracy, level, notes]);

    return createJsonResponse({
      status: "success",
      message: "Score successfully recorded to Google Sheets / Excel database!",
      entry: {
        timestamp: timestamp.toISOString(),
        playerName: playerName,
        score: score,
        accuracy: accuracy
      }
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Helper untuk response JSON dengan dukungan MIME JSON
 */
function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
