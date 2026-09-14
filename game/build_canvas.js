const fs = require('fs');
const path = require('path');

const gameDir = __dirname;
let appJs = fs.readFileSync(path.join(gameDir, 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(gameDir, 'styles.css'), 'utf8');
let indexHtml = fs.readFileSync(path.join(gameDir, 'index.html'), 'utf8');

// 1. Add safeStorage to app.js if not already present
if (!appJs.includes('const safeStorage =')) {
  const safeStorageSnippet = `  // Safe Storage wrapper for restricted iframe sandboxes (e.g. Gemini Canvas)
  const memoryStore = {};
  const safeStorage = {
    getItem: (key) => {
      try {
        return window.localStorage ? window.localStorage.getItem(key) : (memoryStore[key] || null);
      } catch (e) {
        return memoryStore[key] || null;
      }
    },
    setItem: (key, val) => {
      try {
        if (window.localStorage) window.localStorage.setItem(key, val);
      } catch (e) {}
      memoryStore[key] = String(val);
    },
    removeItem: (key) => {
      try {
        if (window.localStorage) window.localStorage.removeItem(key);
      } catch (e) {}
      delete memoryStore[key];
    }
  };

`;
  appJs = appJs.replace(
    "const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/jefry195/Awesome-English-Leaderboard-API/main/data/questions.json';",
    "const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/jefry195/Awesome-English-Leaderboard-API/main/data/questions.json';\n\n" + safeStorageSnippet
  );
  appJs = appJs.split('localStorage.').join('safeStorage.');
  fs.writeFileSync(path.join(gameDir, 'app.js'), appJs, 'utf8');
  console.log('Updated app.js with safeStorage wrapper.');
}

// 2. Build standalone single-file canvas.html
let standaloneHtml = indexHtml;
standaloneHtml = standaloneHtml.replace(
  '<link rel="stylesheet" href="styles.css">',
  `<style>\n${stylesCss}\n</style>`
);
standaloneHtml = standaloneHtml.replace(
  '<script src="app.js"></script>',
  `<script>\n${appJs}\n</script>`
);

fs.writeFileSync(path.join(gameDir, 'canvas.html'), standaloneHtml, 'utf8');
console.log('Created game/canvas.html (single-file standalone). Size:', standaloneHtml.length, 'bytes');

// 3. Update GEMINI_CANVAS_PROMPT.md
const promptDoc = `# 🎓 DOKUMEN PROMPT: Awesome English Arena di Gemini Canvas (Single-File index.html)

> **Catatan Khusus Jefri (Internal Developer):**
> Dokumen ini berisi kode **\`index.html\` lengkap (HTML + CSS + JavaScript)** yang siap pakai di **[Gemini Canvas](https://gemini.google.com/canvas)**.
> Dengan format single-file ini, Gemini Canvas akan **secara otomatis mengenali seluruh kode aplikasi, membuka jendela Canvas Editor di samping, dan merender tampilan game secara live & interaktif** tanpa kendala path atau file eksternal yang hilang!

---

## 🔗 KONEKSI DATABASE & ENDPOINT AKTIF:
1. **Database & Memory Google Sheets (Apps Script Web App)**:
   - Endpoint Ambil Memory: \`https://script.google.com/macros/s/AKfycbxy8pG0P3G95SATXLLqC0V3ZzH7MmU7oEF40PPLJRgBUE6i8NnBmKZlupiYfObPKtZ5/exec?action=memory\`
   - Endpoint Ambil Leaderboard: \`https://script.google.com/macros/s/AKfycbxy8pG0P3G95SATXLLqC0V3ZzH7MmU7oEF40PPLJRgBUE6i8NnBmKZlupiYfObPKtZ5/exec?action=leaderboard\`
2. **Bank Soal GitHub**:
   - Dataset Soal: \`https://raw.githubusercontent.com/jefry195/Awesome-English-Leaderboard-API/main/data/questions.json\`

---

## 📋 CARA BERMAIN DI GEMINI CANVAS:
1. Buka **[https://gemini.google.com/canvas](https://gemini.google.com/canvas)** di browser Anda.
2. Salin seluruh isi di dalam blok **PROMPT UNTUK GEMINI CANVAS** di bawah (atau salin langsung blok \`\`\`html ... \`\`\`).
3. Kirimkan ke Gemini Canvas.
4. Gemini Canvas akan langsung membuat canvas dokumen web dan menampilkan pratinjau interaktif (Canvas Preview) yang bisa langsung Anda mainkan (Mic Voice Shadowing, Audio Native TTS, Murphy Grammar, Vocab, dan Google Sheets Sync).

---

## ⚡ PROMPT UNTUK GEMINI CANVAS (SALIN DARI SINI KE BAWAH):

Tolong buka dan tampilkan aplikasi web interaktif **Awesome English Arena** berikut sebagai dokumen \`index.html\` mandiri lengkap di panel Canvas preview. Aplikasi ini berisi antarmuka Dark Glassmorphism, Web Speech Recognition (Mic), Web Speech Synthesis (TTS), Sound Effects sintetis, Bank Soal 4 Mode (Shadowing, Listening Dictation, Vocabulary, Murphy Grammar), latihan dua arah (Indonesia ➔ English & English ➔ Indonesia), serta sinkronisasi langsung ke Google Sheets / Excel:

\`\`\`html
${standaloneHtml}
\`\`\`
`;

fs.writeFileSync(path.join(gameDir, 'GEMINI_CANVAS_PROMPT.md'), promptDoc, 'utf8');
console.log('Updated GEMINI_CANVAS_PROMPT.md successfully! Size:', promptDoc.length, 'bytes');
