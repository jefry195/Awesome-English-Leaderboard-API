# 🚀 Panduan Deploy Awesome English Arena ke Vercel (100% Gratis)

Aplikasi **Awesome English Arena** kini sudah **100% siap dideploy ke Vercel** dengan paket soal lengkap (80 soal kurasi dari repositori Awesome English)!

---

## 🌟 Mengapa Vercel Jauh Lebih Baik Dibanding Gemini Canvas?

| Fitur | Vercel | Gemini Canvas |
| :--- | :--- | :--- |
| **Izin Mikrofon (Speech-to-Text)** | ✅ **Native & Lancar** (Browser langsung minta izin Mic) | ⚠️ Kadang diblokir kebijakan iframe sandbox |
| **Penyimpanan Skor (localStorage)** | ✅ **Permanen** di browser Anda & siswa | ⚠️ Berisiko terhapus/diblokir cookie pihak ketiga |
| **Bank Soal Lengkap (80+ Soal)** | ✅ **Super Cepat** lewat Edge CDN (`./data/questions.json`) | ✅ Tersedia via embedded single-file |
| **Akses Publik & Siswa** | ✅ Punya domain sendiri (misal: `english-arena.vercel.app`) | ❌ Hanya bisa diakses privat per akun Gemini |
| **Live Google Sheets Sync** | ✅ Sinkronisasi Leaderboard & Memory tetap 100% aktif | ✅ Tetap aktif |

---

## ⚡ Cara 1: Deploy Langsung via CLI (Paling Cepat - 1 Menit)

Buka terminal di folder proyek ini (`d:\Build With Jefri\english course\awesome-english`), lalu jalankan:

```bash
npx vercel
```

1. Jika belum login, ikuti petunjuk login browser (gratis dengan akun GitHub).
2. Tekan `Enter` untuk menyetujui opsi default:
   - `Set up and deploy?` ➔ Ketik `y` lalu Enter.
   - `Which scope do you want to deploy to?` ➔ Pilih akun Anda.
   - `Link to existing project?` ➔ `n`
   - `What's your project's name?` ➔ `awesome-english-arena`
   - `In which directory is your code located?` ➔ `./` (atau `./game`)
3. Tunggu 15 detik! Vercel akan langsung memberikan URL publik live Anda (misal: `https://awesome-english-arena.vercel.app`).

---

## 🌐 Cara 2: Deploy via Dashboard Vercel (Auto-Update saat Git Push)

1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** ➔ **"Project"**.
3. Pilih repositori GitHub Anda: `awesome-english`.
4. Pada bagian **Root Directory**:
   - Klik **Edit** dan pilih folder `game` (atau biarkan default `./` karena sudah ada `vercel.json` rewrite).
5. Klik **Deploy**!
6. Setiap kali Anda menambahkan soal baru di GitHub, Vercel akan otomatis meng-update aplikasinya secara instan.

---

## 📚 Rincian 80 Soal Kurasi dari Awesome English:

Aplikasi sudah dibekali paket 80 soal kurasi berdasarkan sumber terbaik di `readme.md`:

1. **🎙️ Shadowing & Speaking Arena (20 Soal):**
   - *Refold Method & Pronunciation*: Linking sound, syllable stress, intonasi.
   - *Podcasts*: Hard Fork NYT, Lex Fridman, Luke's English Podcast, Tim Ferriss Show, Rachel's English, Bloomberg Tech.
   - *Tingkat*: Beginner (6 soal), Intermediate (7 soal), Advanced (7 soal).

2. **🎧 Listening Dictation Arena (20 Soal):**
   - *Numblr Style*: Dikte angka jam, tanggal, nomor peron/gerbang, mata uang, persentase inflasi, suhu cuaca, dan nomor telepon.
   - *Broadcasters*: BBC 6-Minute English, NPR News Brief, CNN 10, Sky News.

3. **🧠 Vocabulary & Collocations (20 Soal):**
   - *Verbal Advantage (Charles Harrington Elster)*: Kata presisi tinggi (profound, ubiquitous, pragmatic, meticulous, resilience, lucrative, volatile, ephemeral, compelling, eloquent, insatiable).
   - *Anki Sentence Mining & Idioms*: Call it a day, bite the bullet, cut corners, see eye to eye, streamline, shed light on.

4. **✍️ Raymond Murphy Grammar Quest (20 Soal):**
   - *English Grammar in Use*: Third Conditional (Unit 38), Present Perfect vs Past (Unit 7), First & Second Conditionals, Modal Perfects (should have + V3), Passive Voice, Inversion, Subjunctive Mood, Causative Have, Reported Speech, dan Mixed Conditionals.
