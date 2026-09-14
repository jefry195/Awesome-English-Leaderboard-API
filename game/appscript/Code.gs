/**
 * ============================================================================
 * AWESOME ENGLISH - MASTER DATABASE, AUTHENTICATION & LEARNING MEMORY API
 * ============================================================================
 * Repository: https://github.com/jefry195/Awesome-English-Leaderboard-API
 * Database: Google Sheets (Dapat diekspor ke Microsoft Excel .xlsx kapan saja)
 * Spreadsheet ID: 1ODxz0btKzRvwKoboSChBoppayE64X6FYzhbI36c39ZQ
 * 
 * Fitur:
 * 1. Sheet "Users":
 *    - Akses terbatas: hanya Email & Password yang didaftarkan Admin (Jefri) yang bisa login.
 *    - Akumulasi skor permanen: Total Skor dan Level tersimpan di akun user.
 *    - Skor TIDAK AKAN HILANG saat kembali besok atau ganti perangkat.
 * 2. Sheet "Leaderboard":
 *    - Papan peringkat global (Top Player, Skor, Mode Game, Akurasi).
 * 3. Sheet "Memory":
 *    - Memori pembelajaran jangka panjang untuk Gemini AI Canvas & review materi.
 * 4. Setup Otomatis:
 *    - Menu "⚡ Awesome English" -> "🛠️ Reset & Buat Ulang Template Dari Nol".
 *    - Endpoint GET "?action=reset_template" untuk reset template otomatis dari web.
 * 5. Full CORS Support: Bisa dipanggil dari browser, Gemini Canvas, atau cURL.
 */

const USERS_SHEET_NAME = "Users";
const LEADERBOARD_SHEET_NAME = "Leaderboard";
const MEMORY_SHEET_NAME = "Memory";

const USERS_HEADERS = ["Email", "Password", "Nama Pengguna", "Total Skor", "Level", "Status", "Tanggal Dibuat", "Terakhir Aktif"];
const LEADERBOARD_HEADERS = ["Timestamp", "Nama Pengguna", "Email", "Mode Game", "Skor", "Akurasi (%)", "Level", "Catatan"];
const MEMORY_HEADERS = ["Timestamp", "Nama Pengguna", "Email", "Arah Bahasa", "Target Kalimat", "Ucapan Pengguna", "Akurasi (%)", "Evaluasi AI"];

const MAX_ENTRIES = 50;

/**
 * Menu otomatis di Toolbar Google Sheets
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("⚡ Awesome English")
      .addItem("🛠️ Reset & Buat Ulang Template Dari Nol", "setupTemplateDariNol")
      .addItem("👤 Inisialisasi Akun User & Leaderboard", "manualSetup")
      .addToUi();
  } catch (e) {}
}

/**
 * FUNGSI RESET & BUAT ULANG TEMPLATE DARI 0
 * Membuat 3 Sheet (Users, Leaderboard, Memory) dengan styling rapi, warna profesional, dan data awal.
 */
function setupTemplateDariNol() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Siapkan Sheet USERS
  let usersSheet = ss.getSheetByName(USERS_SHEET_NAME);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(USERS_SHEET_NAME);
  } else {
    usersSheet.clear();
  }
  setupSheetHeaders(usersSheet, USERS_HEADERS, "#065f46", "#ffffff");
  
  // Tambahkan akun default (Jefri Admin & Akun Siswa Demo)
  const now = new Date();
  const sampleUsers = [
    ["jefri@admin.com", "admin123", "Jefri (Owner)", 1500, 4, "ACTIVE", now, now],
    ["siswa1@english.com", "siswa123", "Budi Santoso", 450, 1, "ACTIVE", now, now],
    ["sarah@english.com", "sarah123", "Sarah Lestari", 820, 2, "ACTIVE", now, now]
  ];
  usersSheet.getRange(2, 1, sampleUsers.length, USERS_HEADERS.length).setValues(sampleUsers);
  
  // 2. Siapkan Sheet LEADERBOARD
  let lbSheet = ss.getSheetByName(LEADERBOARD_SHEET_NAME);
  if (!lbSheet) {
    lbSheet = ss.insertSheet(LEADERBOARD_SHEET_NAME);
  } else {
    lbSheet.clear();
  }
  setupSheetHeaders(lbSheet, LEADERBOARD_HEADERS, "#1e293b", "#ffffff");
  
  const sampleLeaderboard = [
    [now, "Jefri (Owner)", "jefri@admin.com", "Speaking & Shadowing (ID -> EN)", 520, 98, 4, "Akurasi vokal prima"],
    [new Date(Date.now() - 3600000), "Sarah Lestari", "sarah@english.com", "Listening Dictation (EN -> ID)", 480, 94, 2, "Dictation lulus"],
    [new Date(Date.now() - 7200000), "Budi Santoso", "siswa1@english.com", "Murphy Grammar Quest", 450, 89, 1, "Penguasaan tenses baik"]
  ];
  lbSheet.getRange(2, 1, sampleLeaderboard.length, LEADERBOARD_HEADERS.length).setValues(sampleLeaderboard);

  // 3. Siapkan Sheet MEMORY
  let memSheet = ss.getSheetByName(MEMORY_SHEET_NAME);
  if (!memSheet) {
    memSheet = ss.insertSheet(MEMORY_SHEET_NAME);
  } else {
    memSheet.clear();
  }
  setupSheetHeaders(memSheet, MEMORY_HEADERS, "#312e81", "#e0e7ff");

  const sampleMemory = [
    [now, "Jefri (Owner)", "jefri@admin.com", "ID -> EN", "Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?", "Could you please elaborate on that perspective?", 98, "Pelafalan linking sound 'elaborate on' sangat tepat."],
    [new Date(Date.now() - 3600000), "Budi Santoso", "siswa1@english.com", "EN -> ID", "The flight arrives at gate twenty-four at seven fifteen PM.", "Penerbangan tiba di gerbang dua puluh empat pukul tujuh lima belas malam.", 95, "Pendengaran angka dan waktu sangat akurat."]
  ];
  memSheet.getRange(2, 1, sampleMemory.length, MEMORY_HEADERS.length).setValues(sampleMemory);

  // Hapus sheet bawaan (misal 'Sheet1' atau 'Sheet 1') jika ada dan kosong
  const allSheets = ss.getSheets();
  allSheets.forEach(s => {
    const sName = s.getName();
    if (sName !== USERS_SHEET_NAME && sName !== LEADERBOARD_SHEET_NAME && sName !== MEMORY_SHEET_NAME) {
      if (allSheets.length > 3) {
        try { ss.deleteSheet(s); } catch (e) {}
      }
    }
  });

  // Urutkan posisi tab sheet: 1. Users, 2. Leaderboard, 3. Memory
  try {
    usersSheet.activate();
    ss.setActiveSheet(usersSheet);
    ss.moveActiveSheet(1);
    ss.setActiveSheet(lbSheet);
    ss.moveActiveSheet(2);
    ss.setActiveSheet(memSheet);
    ss.moveActiveSheet(3);
  } catch (e) {}

  return {
    status: "success",
    message: "Template Google Sheets berhasil dibuat ulang dari 0 dengan 3 sheet: Users, Leaderboard, dan Memory!",
    sheets: [USERS_SHEET_NAME, LEADERBOARD_SHEET_NAME, MEMORY_SHEET_NAME]
  };
}

/**
 * Format Header dan Tampilan Sheet secara Profesional
 */
function setupSheetHeaders(sheet, headers, bgColor, fontColor) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground(bgColor);
  headerRange.setFontColor(fontColor);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
    // Beri lebar minimum agar nyaman dibaca
    const curWidth = sheet.getColumnWidth(i);
    if (curWidth < 120) {
      sheet.setColumnWidth(i, 140);
    }
  }
}

function manualSetup() {
  const res = setupTemplateDariNol();
  try {
    SpreadsheetApp.getUi().alert("✅ " + res.message);
  } catch (e) {}
}

/**
 * Helper Akses Sheet dengan Auto-Create jika belum ada
 */
function getUsersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(USERS_SHEET_NAME);
  if (!sheet) {
    setupTemplateDariNol();
    sheet = ss.getSheetByName(USERS_SHEET_NAME);
  }
  return sheet;
}

function getLeaderboardSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(LEADERBOARD_SHEET_NAME);
  if (!sheet) {
    setupTemplateDariNol();
    sheet = ss.getSheetByName(LEADERBOARD_SHEET_NAME);
  }
  return sheet;
}

function getMemorySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(MEMORY_SHEET_NAME);
  if (!sheet) {
    setupTemplateDariNol();
    sheet = ss.getSheetByName(MEMORY_SHEET_NAME);
  }
  return sheet;
}

/**
 * ============================================================================
 * HANDLE GET REQUEST (Login, Get User, Leaderboard, Memory, Setup)
 * ============================================================================
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action).toLowerCase() : "leaderboard";

    // 1. Action: Setup Ulang Template Dari Nol via GET Request
    if (action === "reset_template" || action === "setup_template") {
      const res = setupTemplateDariNol();
      return createJsonResponse(res);
    }

    // 2. Action: Login User (Akses Terbatas: Hanya email & password yang didaftarkan Jefri)
    if (action === "login") {
      const email = String(e.parameter.email || "").trim().toLowerCase();
      const password = String(e.parameter.password || "").trim();

      if (!email || !password) {
        return createJsonResponse({
          status: "error",
          message: "Email dan Password harus diisi!"
        });
      }

      const usersSheet = getUsersSheet();
      const lastRow = usersSheet.getLastRow();
      if (lastRow <= 1) {
        return createJsonResponse({
          status: "error",
          message: "Belum ada user yang terdaftar. Hubungi Admin (Jefri)."
        });
      }

      const rows = usersSheet.getRange(2, 1, lastRow - 1, USERS_HEADERS.length).getValues();
      let foundUser = null;
      let userRowIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        const rowEmail = String(rows[i][0] || "").trim().toLowerCase();
        const rowPass = String(rows[i][1] || "").trim();
        const rowStatus = String(rows[i][5] || "ACTIVE").trim().toUpperCase();

        if (rowEmail === email) {
          if (rowPass === password) {
            if (rowStatus === "ACTIVE") {
              foundUser = {
                email: rowEmail,
                name: String(rows[i][2] || "Player"),
                totalScore: Number(rows[i][3]) || 0,
                level: Number(rows[i][4]) || 1,
                status: rowStatus
              };
              userRowIndex = i + 2; // baris di spreadsheet (1-indexed)
              break;
            } else {
              return createJsonResponse({
                status: "error",
                message: "Akun ini berstatus NONAKTIF. Silakan hubungi Admin (Jefri) untuk mengaktifkan kembali."
              });
            }
          } else {
            return createJsonResponse({
              status: "error",
              message: "Password yang Anda masukkan salah. Periksa kembali atau hubungi Admin (Jefri)."
            });
          }
        }
      }

      if (!foundUser) {
        return createJsonResponse({
          status: "error",
          message: "Email tidak ditemukan! Hanya akun yang diberikan izin oleh Admin (Jefri) yang dapat masuk."
        });
      }

      // Update Terakhir Aktif
      try {
        usersSheet.getRange(userRowIndex, 8).setValue(new Date());
      } catch (err) {}

      return createJsonResponse({
        status: "success",
        message: "Login berhasil! Selamat datang kembali, " + foundUser.name + "!",
        user: foundUser
      });
    }

    // 3. Action: Get User Data (Agar saat kembali besok, skor tidak hilang dan langsung refresh)
    if (action === "get_user") {
      const email = String(e.parameter.email || "").trim().toLowerCase();
      if (!email) {
        return createJsonResponse({ status: "error", message: "Email parameter diperlukan." });
      }

      const usersSheet = getUsersSheet();
      const lastRow = usersSheet.getLastRow();
      if (lastRow <= 1) {
        return createJsonResponse({ status: "error", message: "User tidak ditemukan." });
      }

      const rows = usersSheet.getRange(2, 1, lastRow - 1, USERS_HEADERS.length).getValues();
      for (let i = 0; i < rows.length; i++) {
        if (String(rows[i][0] || "").trim().toLowerCase() === email) {
          return createJsonResponse({
            status: "success",
            user: {
              email: email,
              name: String(rows[i][2] || "Player"),
              totalScore: Number(rows[i][3]) || 0,
              level: Number(rows[i][4]) || 1,
              status: String(rows[i][5] || "ACTIVE").trim().toUpperCase()
            }
          });
        }
      }

      return createJsonResponse({ status: "error", message: "User tidak ditemukan." });
    }

    // 4. Action: Memory Belajar (untuk Gemini Canvas & index.html)
    if (action === "memory") {
      const sheet = getMemorySheet();
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) {
        return createJsonResponse({ status: "success", type: "memory", total: 0, data: [] });
      }

      const rows = sheet.getRange(2, 1, lastRow - 1, MEMORY_HEADERS.length).getValues();
      const memories = rows
        .filter(r => r[4] && String(r[4]).trim() !== "")
        .reverse()
        .slice(0, MAX_ENTRIES)
        .map((r, i) => ({
          id: i + 1,
          timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0] || ""),
          playerName: String(r[1] || "Jefri"),
          email: String(r[2] || ""),
          direction: String(r[3] || "ID -> EN"),
          target: String(r[4] || ""),
          userResponse: String(r[5] || ""),
          accuracy: Number(r[6]) || 0,
          notes: String(r[7] || "")
        }));

      return createJsonResponse({
        status: "success",
        type: "memory",
        total: memories.length,
        data: memories
      });
    }

    // 5. Action: Leaderboard (Default)
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
        email: String(r[2] || ""),
        gameMode: String(r[3] || "Speaking & Shadowing"),
        score: Number(r[4]) || 0,
        accuracy: Number(r[5]) || 0,
        level: Number(r[6]) || 1,
        notes: String(r[7] || "")
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
 * ============================================================================
 * HANDLE POST REQUEST (Simpan Skor, Akumulasi Total Skor User, dan Memory)
 * ============================================================================
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
    const userEmail = String(payload.userEmail || payload.email || "").trim().toLowerCase();
    const playerName = String(payload.playerName || payload.name || "Jefri").trim();
    const gameMode = String(payload.gameMode || payload.mode || "Speaking Arena").trim();
    const sessionScore = Number(payload.score) || 0;
    const accuracy = Number(payload.accuracy) || 0;
    let level = Number(payload.level) || 1;
    const notes = String(payload.notes || "").trim();
    const direction = String(payload.direction || "ID -> EN").trim();

    // 1. UPDATE TOTAL SKOR USER DI SHEET "Users" (Agar Besok Tidak Hilang!)
    let updatedTotalScore = sessionScore;
    if (userEmail) {
      const usersSheet = getUsersSheet();
      const lastRow = usersSheet.getLastRow();
      let userFound = false;

      if (lastRow > 1) {
        const uRows = usersSheet.getRange(2, 1, lastRow - 1, USERS_HEADERS.length).getValues();
        for (let i = 0; i < uRows.length; i++) {
          if (String(uRows[i][0] || "").trim().toLowerCase() === userEmail) {
            const currentTotal = Number(uRows[i][3]) || 0;
            updatedTotalScore = currentTotal + sessionScore;
            // Level naik tiap kelipatan 500 poin
            level = Math.max(Number(uRows[i][4]) || 1, Math.floor(updatedTotalScore / 500) + 1);

            usersSheet.getRange(i + 2, 4).setValue(updatedTotalScore); // Kolom Total Skor
            usersSheet.getRange(i + 2, 5).setValue(level);             // Kolom Level
            usersSheet.getRange(i + 2, 8).setValue(timestamp);         // Kolom Terakhir Aktif
            userFound = true;
            break;
          }
        }
      }

      // Jika email belum ada di sheet Users, buatkan baris akun baru
      if (!userFound) {
        usersSheet.appendRow([userEmail, "123456", playerName, sessionScore, level, "ACTIVE", timestamp, timestamp]);
      }
    }

    // 2. SIMPAN KE SHEET "Leaderboard"
    const lbSheet = getLeaderboardSheet();
    lbSheet.appendRow([timestamp, playerName, userEmail, gameMode, sessionScore, accuracy, level, notes]);

    // 3. SIMPAN KE SHEET "Memory" (Long-Term Learning History)
    const memSheet = getMemorySheet();
    if (payload.history && Array.isArray(payload.history)) {
      payload.history.forEach(item => {
        memSheet.appendRow([
          timestamp,
          playerName,
          userEmail,
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
        userEmail,
        direction,
        payload.target,
        payload.heard || payload.userResponse || "",
        accuracy,
        notes
      ]);
    }

    return createJsonResponse({
      status: "success",
      message: "✓ Skor sesi +" + sessionScore + " berhasil diakumulasikan ke Google Sheets! Total skor Anda: " + updatedTotalScore + " PTS.",
      user: {
        email: userEmail,
        playerName: playerName,
        sessionScore: sessionScore,
        totalScore: updatedTotalScore,
        level: level,
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
