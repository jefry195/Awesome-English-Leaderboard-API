# Panduan Setup Database Leaderboard (Google Sheets / Excel) + Google Apps Script

Database game ini menggunakan **Google Sheets** sebagai backend live, yang terintegrasi langsung dengan Microsoft Excel (dapat diunduh kapan saja melalui menu **File > Download > Microsoft Excel (.xlsx)**).

> [!TIP]
> **Fitur Cerdas Anti-Duplikasi:**
> - **Auto-Rename Sheet**: Jika spreadsheet baru Anda masih bernama `Sheet1`, script akan otomatis mengubahnya menjadi `Leaderboard` tanpa membuat sheet ganda.
> - **Anti-Duplikasi Header**: Script memeriksa baris pertama terlebih dahulu. Jika header sudah ada, script **tidak akan pernah menduplikasi header** saat dijalankan berulang kali.
> - **Menu Otomatis di Google Sheets**: Saat spreadsheet dibuka, akan muncul menu `⚡ Awesome English > Inisialisasi / Periksa Database` untuk verifikasi instan.

---

## Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet Anda bebas, contoh: `Awesome English Game Leaderboard`.

---

## Langkah 2: Pasang Apps Script
1. Di Google Sheets tersebut, klik menu **Extensions (Ekstensi) > Apps Script**.
2. Hapus semua kode bawaan yang ada di editor file `Code.gs`.
3. Salin seluruh isi kode dari file [Code.gs](file:///d:/Build%20With%20Jefri/english%20course/awesome-english/game/appscript/Code.gs) dan tempel (paste) ke editor Apps Script.
4. Klik tombol ikon **Save (Simpan / Ctrl + S)**.

---

## Langkah 3: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy > New deployment**.
2. Klik ikon gerigi (Select type) di samping kiri, lalu pilih **Web app**.
3. Isi konfigurasi berikut:
   - **Description**: `Awesome English Leaderboard API`
   - **Execute as**: `Me (email akun Anda)`
   - **Who has access**: **`Anyone`** *(Penting: pilih Anyone agar game dapat mengirim dan mengambil data leaderboard tanpa perlu login Google)*.
4. Klik tombol **Deploy**.
5. Jika muncul permintaan izin (*Authorization Required*):
   - Klik **Authorize access**.
   - Pilih akun Google Anda.
   - Klik **Advanced** (Lanjutan) di kiri bawah, lalu klik **Go to Untitled project (unsafe)**.
   - Klik **Allow**.
6. Salin **Web app URL** yang muncul (formatnya: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Langkah 4: Hubungkan ke Game
1. Buka Game di browser Anda (`http://localhost:8765`).
2. Klik tombol **Settings ⚙️** di pojok kanan atas navbar.
3. Tempel URL Apps Script yang sudah Anda salin ke kolom **Apps Script Web App URL**.
4. Klik **Simpan Pengaturan**.

Selesai! Sekarang setiap kali pemain menyelesaikan permainan, skor, akurasi, dan mode akan otomatis tersimpan di spreadsheet secara real-time dan tampil di papan Leaderboard global.
