# Awesome English Leaderboard API & AppSheet Database

> Serverless Leaderboard Backend & Learning Memory powered by **Google Apps Script**, **Google Sheets**, and **Google AppSheet**.

Repository ini berisi kode backend API serverless yang siap deploy untuk merekam skor pengguna, menangani autentikasi akun, memformat spreadsheet secara otomatis, serta menghubungkan game secara real-time dengan **Google AppSheet** dan **Microsoft Excel (.xlsx)**.

---

## ⚡ Fitur Utama

- **100% Gratis & Serverless**: Dijalankan langsung melalui Google Apps Script tanpa biaya server bulanan.
- **Kompatibel Penuh dengan AppSheet**:
  - Kolom **`ID`** unik di awal tabel `Leaderboard` dan `Memory` sebagai Primary Key AppSheet.
  - Kolom **`Email`** sebagai Primary Key di tabel `Users`.
  - Relasi antar-tabel di AppSheet dapat dihubungkan secara otomatis (`Ref` Email).
- **Smart Dynamic Column Mapping**:
  - Kode membaca nama header baris ke-1 secara fleksibel, kebal terhadap perubahan urutan atau penambahan kolom baru di AppSheet.
- **Dual-Channel API (POST & GET Fallback)**:
  - Mendukung pengiriman data via POST JSON / `text/plain` dan parameter URL GET `?action=submit_score`, menjamin skor selalu tersimpan tanpa kendala CORS atau redirect 302 di HP.
- **Menu Toolbar Spreadsheet Otomatis**:
  - Menyediakan menu `⚡ Awesome English` di toolbar Google Sheets untuk perbaikan mandiri (*Self-Repair*) dan pembuatan ulang template dalam 1 klik.
- **Penyimpanan Nilai Permanen**:
  - Total skor dan level pengguna diakumulasikan di sheet `Users` dan tidak akan hilang saat berganti hari atau berganti perangkat.

---

## 📂 Struktur Database Google Sheets / AppSheet

### 1. Tabel `Users` (Key: `Email`)
| Email | Password | Nama Pengguna | Total Skor | Level | Status | Tanggal Dibuat | Terakhir Aktif |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `jefry.m95@gmail.com` | `admin123` | Jefri (Owner) | 1720 | 4 | ACTIVE | 2026-09-15 | 2026-09-15 |

### 2. Tabel `Leaderboard` (Key: `ID`)
| ID | Timestamp | Nama Pengguna | Email | Mode Game | Skor | Akurasi (%) | Level | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `LB-XXXXX-XXX` | 2026-09-15 14:00 | Jefri (Owner) | `jefry.m95@gmail.com` | Speaking Arena (ID -> EN) | 520 | 98 | 4 | Akurasi vokal prima |

### 3. Tabel `Memory` (Key: `ID`)
| ID | Timestamp | Nama Pengguna | Email | Arah Bahasa | Target Kalimat | Ucapan Pengguna | Akurasi (%) | Evaluasi AI |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MEM-XXXXX-XXX` | 2026-09-15 14:00 | Jefri (Owner) | `jefry.m95@gmail.com` | ID -> EN | Bisakah Anda menjelaskan... | Could you please elaborate... | 98 | Linking sound tepat |

---

## 🚀 Panduan Setup & Perbaikan Cepat (2 Menit)

### Langkah 1: Salin `Code.gs` ke Spreadsheet
1. Buka Google Spreadsheet database Anda di [Google Sheets](https://sheets.new).
2. Klik menu **Extensions (Ekstensi) > Apps Script**.
3. Ganti seluruh isi file `Code.gs` dengan kode dari file [Code.gs](./Code.gs).
4. Klik tombol **Save (Ctrl + S)**.

### Langkah 2: Deploy / Update Web App
1. Di kanan atas editor Apps Script, klik tombol biru **Deploy > Manage deployments**.
2. Klik ikon pensil (**Edit**) pada deployment aktif Anda.
3. Pada dropdown **Version**, pilih **New version**.
4. Pastikan **Who has access** dipilih **`Anyone`** *(Sangat penting agar game dapat membaca dan menulis skor)*.
5. Klik **Deploy** dan salin URL Web app (`https://script.google.com/macros/s/.../exec`).

### Langkah 3: Jalankan Perbaikan Otomatis
1. Kembali ke tab Google Sheets dan refresh halamannya.
2. Klik menu **`⚡ Awesome English > 🛠️ Perbaiki & Sinkronkan Database (AppSheet Ready)`**.
3. Jika spreadsheet baru kosong, Anda juga dapat memilih **`🔄 Reset & Buat Ulang Template Dari Nol`**.

### Langkah 4: Sinkronkan di AppSheet
1. Buka aplikasi Anda di [AppSheet](https://www.appsheet.com/).
2. Masuk ke tab **Data > Tables**.
3. Klik **Regenerate Structure** pada tabel `Leaderboard`, `Memory`, dan `Users`.
4. Pastikan kolom **`ID`** tercentang sebagai **Key** pada `Leaderboard` dan `Memory`, serta kolom **`Email`** tercentang sebagai **Key** pada `Users`.
5. Klik **Save**. Sekarang AppSheet dan Game Web terhubung 100%!

---

## 📡 Dokumentasi Endpoint API

### 1. Ambil Peringkat Global (GET)
```http
GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=leaderboard
```

### 2. Login Pengguna (GET)
```http
GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=login&email=jefry.m95@gmail.com&password=admin123
```

### 3. Simpan Skor & Riwayat Memori (POST atau GET)
**Opsi A (POST JSON / text-plain):**
```http
POST https://script.google.com/macros/s/DEPLOYMENT_ID/exec
Content-Type: text/plain;charset=utf-8

{
  "userEmail": "jefry.m95@gmail.com",
  "playerName": "Jefri (Owner)",
  "gameMode": "Speaking Arena",
  "score": 520,
  "accuracy": 98,
  "level": 4,
  "direction": "ID -> EN"
}
```

**Opsi B (GET Fallback - Ultra Reliable):**
```http
GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=submit_score&email=jefry.m95@gmail.com&playerName=Jefri+(Owner)&gameMode=Speaking+Arena&score=520&accuracy=98&level=4&direction=ID+->+EN
```

### 4. Perbaiki Struktur Database Otomatis (GET)
```http
GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=repair_database
```

---

## 📄 Lisensi
MIT License. Dibuat khusus untuk Awesome English Arena & ekosistem pembelajaran bahasa Inggris interaktif.
