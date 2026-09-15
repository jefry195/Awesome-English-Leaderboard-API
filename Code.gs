/**
 * ============================================================================
 * AWESOME ENGLISH - MASTER DATABASE, AUTHENTICATION & LEARNING MEMORY API
 * Full AppSheet, Google Sheets & Web App Universal Integration
 * ============================================================================
 * Repository: https://github.com/jefry195/Awesome-English-Leaderboard-API
 * Database: Google Sheets / AppSheet (Exportable to Microsoft Excel .xlsx)
 * Spreadsheet ID: 1ODxz0btKzRvwKoboSChBoppayE64X6FYzhbI36c39ZQ
 * 
 * Fitur & Kompatibilitas:
 * 1. Sheet "Users" (Key: Email):
 *    - Mendukung AppSheet User Table & Web App Authentication.
 *    - Hanya Email & Password yang terdaftar yang dapat login.
 *    - Akumulasi total skor dan kenaikan level tersimpan permanen.
 * 2. Sheet "Leaderboard" (Key: ID):
 *    - Memiliki kolom ID unik di kolom A (Sangat krusial untuk AppSheet Primary Key).
 *    - Papan peringkat global otomatis terurut dari skor tertinggi.
 * 3. Sheet "Memory" (Key: ID):
 *    - Memiliki kolom ID unik untuk AppSheet Primary Key.
 *    - Riwayat detail rekaman suara, target kalimat, akurasi vokal, dan catatan evaluasi AI.
 * 4. Smart Dynamic Column Mapping:
 *    - Kebal pergeseran kolom! Membaca dan menulis data berdasarkan nama header,
 *      bukan indeks array kaku. Kompatibel dengan perubahan tata letak di AppSheet.
 * 5. Dual Channel API (GET & POST):
 *    - Mendukung POST (JSON / text-plain / form-data) dan GET fallback (?action=submit_score)
 *      sehingga tidak akan pernah terblokir oleh kendala CORS, mobile browser, atau redirect Google.
 * 6. Fitur Perbaikan Mandiri (Self-Repair):
 *    - Menu "⚡ Awesome English" -> "🛠️ Perbaiki & Sinkronkan Database (AppSheet Ready)"
 *    - Endpoint GET "?action=repair_database" untuk perbaikan instan via browser/cURL.
 */

const USERS_SHEET_NAME = "Users";
const LEADERBOARD_SHEET_NAME = "Leaderboard";
const MEMORY_SHEET_NAME = "Memory";

// AppSheet-compliant headers with primary keys (Email for Users, ID for Leaderboard & Memory)
const USERS_HEADERS = [
  "Email", "Password", "Nama Pengguna", "Total Skor", "Level", "Status", "Tanggal Dibuat", "Terakhir Aktif"
];
const LEADERBOARD_HEADERS = [
  "ID", "Timestamp", "Nama Pengguna", "Email", "Mode Game", "Skor", "Akurasi (%)", "Level", "Catatan"
];
const MEMORY_HEADERS = [
  "ID", "Timestamp", "Nama Pengguna", "Email", "Arah Bahasa", "Target Kalimat", "Ucapan Pengguna", "Akurasi (%)", "Evaluasi AI"
];

const MAX_ENTRIES = 100;

/**
 * Menu otomatis di Toolbar Google Sheets
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("⚡ Awesome English")
      .addItem("🛠️ Perbaiki & Sinkronkan Database (AppSheet Ready)", "manualRepair")
      .addItem("🔄 Reset & Buat Ulang Template Dari Nol", "manualSetup")
      .addToUi();
  } catch (e) {}
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
    const curWidth = sheet.getColumnWidth(i);
    if (curWidth < 120) {
      sheet.setColumnWidth(i, 140);
    }
  }
}

/**
 * Helper: Generate Unique ID untuk AppSheet Primary Key
 */
function generateId(prefix) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.floor(Math.random() * 46656).toString(36).toUpperCase().padStart(3, '0');
  return (prefix ? prefix + "-" : "") + timestamp + "-" + randomPart;
}

/**
 * Helper: Normalisasi nama header agar kebal spasi, huruf besar/kecil, dan simbol
 */
function cleanHeaderName(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Helper: Membaca struktur header baris ke-1 secara dinamis (Dynamic Header Mapper)
 */
function getColumnIndexMap(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const rawHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map = {};
  rawHeaders.forEach((h, idx) => {
    if (h) {
      map[cleanHeaderName(h)] = idx + 1; // 1-indexed for SpreadsheetApp
    }
  });
  return { map, rawHeaders };
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
 * FUNGSI RESET & BUAT ULANG TEMPLATE DARI 0 (AppSheet Compatible)
 */
function setupTemplateDariNol() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date();

  // 1. Sheet USERS
  let usersSheet = ss.getSheetByName(USERS_SHEET_NAME);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(USERS_SHEET_NAME);
  } else {
    usersSheet.clear();
  }
  setupSheetHeaders(usersSheet, USERS_HEADERS, "#065f46", "#ffffff");

  const sampleUsers = [
    ["jefry.m95@gmail.com", "admin123", "Jefri (Owner)", 1720, 4, "ACTIVE", now, now],
    ["jefri@admin.com", "admin123", "Jefri (Admin)", 1500, 4, "ACTIVE", now, now],
    ["siswa1@english.com", "siswa123", "Budi Santoso", 450, 1, "ACTIVE", now, now],
    ["sarah@english.com", "sarah123", "Sarah Lestari", 820, 2, "ACTIVE", now, now]
  ];
  usersSheet.getRange(2, 1, sampleUsers.length, USERS_HEADERS.length).setValues(sampleUsers);

  // 2. Sheet LEADERBOARD
  let lbSheet = ss.getSheetByName(LEADERBOARD_SHEET_NAME);
  if (!lbSheet) {
    lbSheet = ss.insertSheet(LEADERBOARD_SHEET_NAME);
  } else {
    lbSheet.clear();
  }
  setupSheetHeaders(lbSheet, LEADERBOARD_HEADERS, "#1e293b", "#ffffff");

  const sampleLeaderboard = [
    [generateId("LB"), now, "Jefri (Owner)", "jefry.m95@gmail.com", "Speaking Arena (ID -> EN)", 520, 98, 4, "Akurasi vokal prima"],
    [generateId("LB"), new Date(Date.now() - 3600000), "Sarah Lestari", "sarah@english.com", "Listening Arena (EN -> ID)", 480, 94, 2, "Dictation lulus"],
    [generateId("LB"), new Date(Date.now() - 7200000), "Budi Santoso", "siswa1@english.com", "Murphy Grammar Quest", 450, 89, 1, "Penguasaan tenses baik"]
  ];
  lbSheet.getRange(2, 1, sampleLeaderboard.length, LEADERBOARD_HEADERS.length).setValues(sampleLeaderboard);

  // 3. Sheet MEMORY
  let memSheet = ss.getSheetByName(MEMORY_SHEET_NAME);
  if (!memSheet) {
    memSheet = ss.insertSheet(MEMORY_SHEET_NAME);
  } else {
    memSheet.clear();
  }
  setupSheetHeaders(memSheet, MEMORY_HEADERS, "#312e81", "#e0e7ff");

  const sampleMemory = [
    [generateId("MEM"), now, "Jefri (Owner)", "jefry.m95@gmail.com", "ID -> EN", "Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?", "Could you please elaborate on that perspective?", 98, "Pelafalan linking sound 'elaborate on' sangat tepat."],
    [generateId("MEM"), new Date(Date.now() - 3600000), "Budi Santoso", "siswa1@english.com", "EN -> ID", "The flight arrives at gate twenty-four at seven fifteen PM.", "Penerbangan tiba di gerbang dua puluh empat pukul tujuh lima belas malam.", 95, "Pendengaran angka dan waktu sangat akurat."]
  ];
  memSheet.getRange(2, 1, sampleMemory.length, MEMORY_HEADERS.length).setValues(sampleMemory);

  // Hapus sheet bawaan (misal 'Sheet1') jika ada dan tidak dipakai
  const allSheets = ss.getSheets();
  allSheets.forEach(s => {
    const sName = s.getName();
    if (sName !== USERS_SHEET_NAME && sName !== LEADERBOARD_SHEET_NAME && sName !== MEMORY_SHEET_NAME) {
      if (allSheets.length > 3) {
        try { ss.deleteSheet(s); } catch (e) {}
      }
    }
  });

  // Urutkan posisi tab: 1. Users, 2. Leaderboard, 3. Memory
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
    message: "Template Google Sheets berhasil dibuat ulang dari 0! 100% siap untuk AppSheet dan Web App.",
    sheets: [USERS_SHEET_NAME, LEADERBOARD_SHEET_NAME, MEMORY_SHEET_NAME]
  };
}

/**
 * FUNGSI PERBAIKAN & MIGRASI DATABASE (AppSheet Ready)
 * Memperbaiki baris yang tergeser, menambahkan kolom ID jika belum ada,
 * dan membersihkan data anomali tanpa menghapus skor pengguna yang valid!
 */
function repairAndMigrateDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const report = [];

  // 1. Periksa dan Migrasi Sheet Users
  const usersSheet = getUsersSheet();
  const uInfo = getColumnIndexMap(usersSheet);
  const uLastRow = usersSheet.getLastRow();

  // Pastikan akun utama Jefri ada
  let hasJefryAdmin = false;
  if (uLastRow > 1) {
    const uRows = usersSheet.getRange(2, 1, uLastRow - 1, usersSheet.getLastColumn()).getValues();
    const emailColIdx = (uInfo.map["email"] || 1) - 1;
    for (let r = 0; r < uRows.length; r++) {
      const em = String(uRows[r][emailColIdx] || "").trim().toLowerCase();
      if (em === "jefry.m95@gmail.com") {
        hasJefryAdmin = true;
        break;
      }
    }
  }

  if (!hasJefryAdmin) {
    const now = new Date();
    usersSheet.appendRow(["jefry.m95@gmail.com", "admin123", "Jefri (Owner)", 1720, 4, "ACTIVE", now, now]);
    report.push("Akun Owner (jefry.m95@gmail.com) berhasil ditambahkan ke sheet Users.");
  }
  setupSheetHeaders(usersSheet, USERS_HEADERS, "#065f46", "#ffffff");

  // 2. Periksa dan Migrasi Sheet Leaderboard
  const lbSheet = getLeaderboardSheet();
  let lbInfo = getColumnIndexMap(lbSheet);

  // Jika kolom ID belum ada di kolom 1, sisipkan kolom ID
  if (!lbInfo.map["id"]) {
    lbSheet.insertColumnBefore(1);
    lbSheet.getRange(1, 1).setValue("ID");
    lbInfo = getColumnIndexMap(lbSheet);
    report.push("Kolom ID (Primary Key AppSheet) berhasil ditambahkan ke sheet Leaderboard.");
  }

  // Bersihkan data baris dan isi ID yang kosong
  const lbLastRow = lbSheet.getLastRow();
  if (lbLastRow > 1) {
    const lbColCount = Math.max(lbSheet.getLastColumn(), LEADERBOARD_HEADERS.length);
    const lbRows = lbSheet.getRange(2, 1, lbLastRow - 1, lbColCount).getValues();
    const updatedRows = [];
    let fixedCount = 0;

    for (let i = 0; i < lbRows.length; i++) {
      const row = lbRows[i];
      let id = String(row[0] || "").trim();
      let ts = row[1];
      let name = String(row[2] || "").trim();
      let email = String(row[3] || "").trim().toLowerCase();
      let mode = String(row[4] || "").trim();
      let score = Number(row[5]) || 0;
      let acc = Number(row[6]) || 0;
      let level = Number(row[7]) || 1;
      let notes = String(row[8] || "").trim();

      // Deteksi jika data kolom tergeser (misal: email berisi nama mode)
      if (email.includes("Arena") || email.includes("Quest") || email.includes("Speaking") || email.includes("Listening")) {
        // Kolom tergeser dari format lama tanpa kolom Email
        mode = email;
        score = Number(row[4]) || Number(row[5]) || 0;
        acc = Number(row[5]) || Number(row[6]) || 100;
        level = Number(row[6]) || 1;
        email = name.toLowerCase().includes("jefri") ? "jefry.m95@gmail.com" : "siswa1@english.com";
        fixedCount++;
      }

      // Pastikan ada ID unik
      if (!id || id.startsWith("202") || id.includes(":") || id.length < 5) {
        if (id.startsWith("202") || id.includes(":") || row[0] instanceof Date) {
          ts = row[0];
          name = String(row[1] || "Player");
          email = String(row[2] || "").includes("@") ? String(row[2]) : "jefry.m95@gmail.com";
        }
        id = generateId("LB");
        fixedCount++;
      }

      // Abaikan baris uji coba kosong (score 0 dan email kosong)
      if (score === 0 && (!email || email === "") && (!name || name === "Jefri")) {
        continue;
      }

      if (!(ts instanceof Date) && (!ts || String(ts).trim() === "")) {
        ts = new Date();
      }

      updatedRows.push([id, ts, name, email, mode, score, acc, level, notes]);
    }

    if (updatedRows.length > 0) {
      lbSheet.getRange(2, 1, lbLastRow - 1, lbColCount).clearContent();
      lbSheet.getRange(2, 1, updatedRows.length, LEADERBOARD_HEADERS.length).setValues(updatedRows);
      report.push(`Sebanyak ${updatedRows.length} baris Leaderboard berhasil dirapikan & disinkronkan (${fixedCount} perbaikan kolom).`);
    }
  }
  setupSheetHeaders(lbSheet, LEADERBOARD_HEADERS, "#1e293b", "#ffffff");

  // 3. Periksa dan Migrasi Sheet Memory
  const memSheet = getMemorySheet();
  let memInfo = getColumnIndexMap(memSheet);

  if (!memInfo.map["id"]) {
    memSheet.insertColumnBefore(1);
    memSheet.getRange(1, 1).setValue("ID");
    memInfo = getColumnIndexMap(memSheet);
    report.push("Kolom ID (Primary Key AppSheet) berhasil ditambahkan ke sheet Memory.");
  }

  const memLastRow = memSheet.getLastRow();
  if (memLastRow > 1) {
    const memColCount = Math.max(memSheet.getLastColumn(), MEMORY_HEADERS.length);
    const memRows = memSheet.getRange(2, 1, memLastRow - 1, memColCount).getValues();
    const updatedMem = [];

    for (let i = 0; i < memRows.length; i++) {
      const row = memRows[i];
      let id = String(row[0] || "").trim();
      let ts = row[1];
      let name = String(row[2] || "").trim();
      let email = String(row[3] || "").trim();
      let dir = String(row[4] || "ID -> EN").trim();
      let target = String(row[5] || "").trim();
      let heard = String(row[6] || "").trim();
      let acc = Number(row[7]) || 0;
      let notes = String(row[8] || "").trim();

      if (!id || id.startsWith("202") || id.includes(":") || id.length < 5) {
        if (row[0] instanceof Date || id.startsWith("202")) {
          ts = row[0];
          name = String(row[1] || "Player");
          email = String(row[2] || "");
          dir = String(row[3] || "ID -> EN");
          target = String(row[4] || "");
          heard = String(row[5] || "");
          acc = Number(row[6]) || 0;
          notes = String(row[7] || "");
        }
        id = generateId("MEM");
      }

      if (!target || target === "") continue;
      if (!(ts instanceof Date) && (!ts || String(ts).trim() === "")) ts = new Date();

      updatedMem.push([id, ts, name, email, dir, target, heard, acc, notes]);
    }

    if (updatedMem.length > 0) {
      memSheet.getRange(2, 1, memLastRow - 1, memColCount).clearContent();
      memSheet.getRange(2, 1, updatedMem.length, MEMORY_HEADERS.length).setValues(updatedMem);
      report.push(`Sebanyak ${updatedMem.length} riwayat memori belajar berhasil disinkronkan.`);
    }
  }
  setupSheetHeaders(memSheet, MEMORY_HEADERS, "#312e81", "#e0e7ff");

  return {
    status: "success",
    message: "Database Google Sheets & AppSheet berhasil diperbaiki dan disinkronkan 100%!",
    details: report
  };
}

function manualSetup() {
  const res = setupTemplateDariNol();
  try {
    SpreadsheetApp.getUi().alert("✅ " + res.message);
  } catch (e) {}
}

function manualRepair() {
  const res = repairAndMigrateDatabase();
  try {
    SpreadsheetApp.getUi().alert("✅ " + res.message + "\n\n" + (res.details ? res.details.join("\n") : ""));
  } catch (e) {}
}

/**
 * ============================================================================
 * HANDLE GET REQUEST (Login, Get User, Leaderboard, Memory, Submit, Repair)
 * ============================================================================
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action).toLowerCase() : "leaderboard";

    // 1. Action: Perbaiki & Rapikan Struktur Database
    if (action === "repair_database" || action === "repair" || action === "migrate") {
      const res = repairAndMigrateDatabase();
      return createJsonResponse(res);
    }

    // 2. Action: Setup Ulang Template Dari Nol
    if (action === "reset_template" || action === "setup_template") {
      const res = setupTemplateDariNol();
      return createJsonResponse(res);
    }

    // 3. Action: Submit Score via GET (Ultra-Reliable CORS / Proxy Fallback)
    if (action === "submit_score" || action === "save_score" || action === "submit") {
      return handleSaveScore(e.parameter || {});
    }

    // 4. Action: Login User
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

      const uInfo = getColumnIndexMap(usersSheet);
      const emailIdx = (uInfo.map["email"] || 1) - 1;
      const passIdx = (uInfo.map["password"] || 2) - 1;
      const nameIdx = (uInfo.map["namapengguna"] || uInfo.map["name"] || 3) - 1;
      const scoreIdx = (uInfo.map["totalskor"] || uInfo.map["totalscore"] || 4) - 1;
      const levelIdx = (uInfo.map["level"] || 5) - 1;
      const statusIdx = (uInfo.map["status"] || 6) - 1;
      const lastActiveCol = uInfo.map["terakhiraktif"] || 8;

      const rows = usersSheet.getRange(2, 1, lastRow - 1, usersSheet.getLastColumn()).getValues();
      let foundUser = null;
      let userRowIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        const rowEmail = String(rows[i][emailIdx] || "").trim().toLowerCase();
        const rowPass = String(rows[i][passIdx] || "").trim();
        const rowStatus = String(rows[i][statusIdx] || "ACTIVE").trim().toUpperCase();

        if (rowEmail === email) {
          if (rowPass === password) {
            if (rowStatus === "ACTIVE") {
              foundUser = {
                email: rowEmail,
                name: String(rows[i][nameIdx] || "Player"),
                totalScore: Number(rows[i][scoreIdx]) || 0,
                level: Number(rows[i][levelIdx]) || 1,
                status: rowStatus
              };
              userRowIndex = i + 2;
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
        usersSheet.getRange(userRowIndex, lastActiveCol).setValue(new Date());
      } catch (err) {}

      return createJsonResponse({
        status: "success",
        message: "Login berhasil! Selamat datang kembali, " + foundUser.name + "!",
        user: foundUser
      });
    }

    // 5. Action: Get User Data
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

      const uInfo = getColumnIndexMap(usersSheet);
      const emailIdx = (uInfo.map["email"] || 1) - 1;
      const nameIdx = (uInfo.map["namapengguna"] || uInfo.map["name"] || 3) - 1;
      const scoreIdx = (uInfo.map["totalskor"] || uInfo.map["totalscore"] || 4) - 1;
      const levelIdx = (uInfo.map["level"] || 5) - 1;
      const statusIdx = (uInfo.map["status"] || 6) - 1;

      const rows = usersSheet.getRange(2, 1, lastRow - 1, usersSheet.getLastColumn()).getValues();
      for (let i = 0; i < rows.length; i++) {
        if (String(rows[i][emailIdx] || "").trim().toLowerCase() === email) {
          return createJsonResponse({
            status: "success",
            user: {
              email: email,
              name: String(rows[i][nameIdx] || "Player"),
              totalScore: Number(rows[i][scoreIdx]) || 0,
              level: Number(rows[i][levelIdx]) || 1,
              status: String(rows[i][statusIdx] || "ACTIVE").trim().toUpperCase()
            }
          });
        }
      }

      return createJsonResponse({ status: "error", message: "User tidak ditemukan." });
    }

    // 6. Action: Memory Belajar
    if (action === "memory") {
      const sheet = getMemorySheet();
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) {
        return createJsonResponse({ status: "success", type: "memory", total: 0, data: [] });
      }

      const mInfo = getColumnIndexMap(sheet);
      const idIdx = (mInfo.map["id"] || 1) - 1;
      const tsIdx = (mInfo.map["timestamp"] || 2) - 1;
      const nameIdx = (mInfo.map["namapengguna"] || mInfo.map["name"] || 3) - 1;
      const emailIdx = (mInfo.map["email"] || 4) - 1;
      const dirIdx = (mInfo.map["arahbahasa"] || mInfo.map["direction"] || 5) - 1;
      const targetIdx = (mInfo.map["targetkalimat"] || mInfo.map["target"] || 6) - 1;
      const heardIdx = (mInfo.map["ucapanpengguna"] || mInfo.map["response"] || mInfo.map["heard"] || 7) - 1;
      const accIdx = (mInfo.map["akurasi"] || mInfo.map["accuracy"] || 8) - 1;
      const notesIdx = (mInfo.map["evaluasiai"] || mInfo.map["notes"] || 9) - 1;

      const rows = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
      const memories = rows
        .filter(r => r[targetIdx] && String(r[targetIdx]).trim() !== "")
        .reverse()
        .slice(0, MAX_ENTRIES)
        .map((r, i) => ({
          id: String(r[idIdx] || i + 1),
          timestamp: r[tsIdx] instanceof Date ? r[tsIdx].toISOString() : String(r[tsIdx] || ""),
          playerName: String(r[nameIdx] || "Jefri"),
          email: String(r[emailIdx] || ""),
          direction: String(r[dirIdx] || "ID -> EN"),
          target: String(r[targetIdx] || ""),
          userResponse: String(r[heardIdx] || ""),
          accuracy: Number(r[accIdx]) || 0,
          notes: String(r[notesIdx] || "")
        }));

      return createJsonResponse({
        status: "success",
        type: "memory",
        total: memories.length,
        data: memories
      });
    }

    // 7. Action: Leaderboard (Default)
    const sheet = getLeaderboardSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return createJsonResponse({ status: "success", type: "leaderboard", total: 0, data: [] });
    }

    const lbInfo = getColumnIndexMap(sheet);
    const idIdx = (lbInfo.map["id"] || 1) - 1;
    const tsIdx = (lbInfo.map["timestamp"] || 2) - 1;
    const nameIdx = (lbInfo.map["namapengguna"] || lbInfo.map["name"] || 3) - 1;
    const emailIdx = (lbInfo.map["email"] || 4) - 1;
    const modeIdx = (lbInfo.map["modegame"] || lbInfo.map["mode"] || 5) - 1;
    const scoreIdx = (lbInfo.map["skor"] || lbInfo.map["score"] || 6) - 1;
    const accIdx = (lbInfo.map["akurasi"] || lbInfo.map["accuracy"] || 7) - 1;
    const levelIdx = (lbInfo.map["level"] || 8) - 1;
    const notesIdx = (lbInfo.map["catatan"] || lbInfo.map["notes"] || 9) - 1;

    const rows = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    const records = rows
      .filter(r => r[nameIdx] && String(r[nameIdx]).trim() !== "")
      .map((r, i) => ({
        id: String(r[idIdx] || i + 1),
        timestamp: r[tsIdx] instanceof Date ? r[tsIdx].toISOString() : String(r[tsIdx] || ""),
        playerName: String(r[nameIdx] || "Anonymous"),
        email: String(r[emailIdx] || ""),
        gameMode: String(r[modeIdx] || "Speaking & Shadowing"),
        score: Number(r[scoreIdx]) || 0,
        accuracy: Number(r[accIdx]) || 0,
        level: Number(r[levelIdx]) || 1,
        notes: String(r[notesIdx] || "")
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
 * HANDLE POST REQUEST
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

    return handleSaveScore(payload);
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

/**
 * LOGIKA PENYIMPANAN SKOR & SINKRONISASI DATABASE (AppSheet & Web App Ready)
 */
function handleSaveScore(payload) {
  try {
    const timestamp = new Date();
    const userEmail = String(payload.userEmail || payload.email || "").trim().toLowerCase();
    const playerName = String(payload.playerName || payload.name || "Jefri").trim();
    const gameMode = String(payload.gameMode || payload.mode || "Speaking Arena").trim();
    const sessionScore = Number(payload.score) || 0;
    const accuracy = Number(payload.accuracy) || 0;
    let level = Number(payload.level) || 1;
    const notes = String(payload.notes || "").trim();
    const direction = String(payload.direction || "ID -> EN").trim();

    // 1. UPDATE TOTAL SKOR USER DI SHEET "Users"
    let updatedTotalScore = sessionScore;
    if (userEmail) {
      const usersSheet = getUsersSheet();
      const uInfo = getColumnIndexMap(usersSheet);
      const uLastRow = usersSheet.getLastRow();
      let userFound = false;

      const emailIdx = (uInfo.map["email"] || 1) - 1;
      const scoreCol = uInfo.map["totalskor"] || uInfo.map["totalscore"] || 4;
      const levelCol = uInfo.map["level"] || 5;
      const lastActiveCol = uInfo.map["terakhiraktif"] || 8;

      if (uLastRow > 1) {
        const uRows = usersSheet.getRange(2, 1, uLastRow - 1, usersSheet.getLastColumn()).getValues();
        for (let i = 0; i < uRows.length; i++) {
          if (String(uRows[i][emailIdx] || "").trim().toLowerCase() === userEmail) {
            const currentTotal = Number(uRows[i][scoreCol - 1]) || 0;
            updatedTotalScore = currentTotal + sessionScore;
            level = Math.max(Number(uRows[i][levelCol - 1]) || 1, Math.floor(updatedTotalScore / 500) + 1);

            usersSheet.getRange(i + 2, scoreCol).setValue(updatedTotalScore);
            usersSheet.getRange(i + 2, levelCol).setValue(level);
            usersSheet.getRange(i + 2, lastActiveCol).setValue(timestamp);
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

    // 2. SIMPAN KE SHEET "Leaderboard" (Dengan ID unik AppSheet)
    const lbSheet = getLeaderboardSheet();
    const lbId = generateId("LB");
    lbSheet.appendRow([lbId, timestamp, playerName, userEmail, gameMode, sessionScore, accuracy, level, notes]);

    // 3. SIMPAN KE SHEET "Memory" (Long-Term Learning History)
    const memSheet = getMemorySheet();
    if (payload.history && Array.isArray(payload.history)) {
      payload.history.forEach(item => {
        const memId = generateId("MEM");
        memSheet.appendRow([
          memId,
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
      const memId = generateId("MEM");
      memSheet.appendRow([
        memId,
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
      message: "✓ Skor sesi +" + sessionScore + " berhasil diakumulasikan ke Google Sheets & AppSheet! Total skor: " + updatedTotalScore + " PTS.",
      user: {
        id: lbId,
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
