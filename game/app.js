/**
 * ============================================================================
 * AWESOME ENGLISH ARENA - GAME ENGINE & AI TUTOR
 * ============================================================================
 * Features:
 * - 4 Curated Arenas from Awesome English resources
 * - Two-Way Bilingual Challenge:
 *     1. 🇮🇩 Indonesia ➔ 🇬🇧 English (Speaking / Production)
 *     2. 🇬🇧 English ➔ 🇮🇩 Indonesia (Listening & Comprehension)
 * - Dynamic Dataset loaded from GitHub repo:
 *     https://raw.githubusercontent.com/jefry195/Awesome-English-Leaderboard-API/main/data/questions.json
 * - Live Google Sheets Database & Long-Term Learning Memory via Apps Script Web App
 * - Web Speech API (Microphone voice input with en-US/id-ID support)
 * - Web Speech Synthesis (Native US/UK Text-to-Speech)
 * - Intelligent Heuristic Pronunciation Matcher (Offline)
 * - Gemini AI Teacher & Examiner API Integration (Free Tier: gemini-3-flash-preview)
 * - Web Audio API Synthetic Sound Effects
 */

(() => {
  'use strict';

  const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/jefry195/Awesome-English-Leaderboard-API/main/data/questions.json';

  // Safe Storage wrapper for persistent browser storage and restricted iframe sandboxes
  const memoryStore = {};
  const safeStorage = {
    getItem: (key) => {
      try {
        const ls = window['localStorage'];
        if (ls) {
          const val = ls.getItem(key);
          if (val !== null) return val;
        }
      } catch (e) {}
      return memoryStore[key] || null;
    },
    setItem: (key, val) => {
      try {
        const ls = window['localStorage'];
        if (ls) ls.setItem(key, String(val));
      } catch (e) {}
      memoryStore[key] = String(val);
    },
    removeItem: (key) => {
      try {
        const ls = window['localStorage'];
        if (ls) ls.removeItem(key);
      } catch (e) {}
      delete memoryStore[key];
    }
  };

  // Helper to sanitize questions and ensure NO artificial numbers (#303, #12, etc.) ever appear
  function cleanText(text) {
    if (!text) return '';
    return String(text)
      .replace(/\s*#\d+/g, '')
      .replace(/\s*#([a-zA-Z0-9_-]+)/g, '')
      .replace(/\s*\((?:Record|Part|Task|Passage)?\s*#?\d+\)/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Helper to normalize speed rate values to exact select option keys ('0.5', '0.6', '0.7', '0.8', '0.9', '1.0')
  function normalizeRate(rate) {
    const r = parseFloat(rate);
    if (isNaN(r) || r <= 0) return '0.8';
    if (r <= 0.55) return '0.5';
    if (r <= 0.65) return '0.6';
    if (r <= 0.75) return '0.7';
    if (r <= 0.85) return '0.8';
    if (r <= 0.95) return '0.9';
    return '1.0';
  }

  /* ==========================================================================
     1. CURATED CONTENT REPOSITORY (Bilingual English & Indonesian)
     ========================================================================== */
  const QUESTION_BANK = {
  "shadowing": [
    {
      "id": "sh_01",
      "mode": "shadowing",
      "category": "Shadowing • Refold Method",
      "level": "Intermediate",
      "en": "Could you please elaborate on that perspective?",
      "target": "Could you please elaborate on that perspective?",
      "phonetic": "/kʊd juː pliːz ɪˈlæb.ə.reɪt ɒn ðæt pəˈspek.tɪv/",
      "id_translation": "Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Could you please elaborate on that perspective?\"",
      "options_en": [
        "Could you please elaborate on that perspective?",
        "Would you please summarize the final outcome?",
        "Can we schedule another discussion tomorrow?",
        "Do you agree with our general conclusion?"
      ],
      "options_id": [
        "Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?",
        "Apakah Anda setuju dengan jadwal pertemuan besok?",
        "Tolong kirimkan dokumen laporan segera.",
        "Bisakah kita mengubah waktu rapat?"
      ],
      "notes": "Fokus pada linking sound antara \"elaborate\" dan \"on\" (/ɪˈlæbəreɪt‿ɒn/)."
    },
    {
      "id": "sh_02",
      "mode": "shadowing",
      "category": "Interview • Lex Fridman Podcast",
      "level": "Advanced",
      "en": "Curiosity and perseverance are far more important than raw talent.",
      "target": "Curiosity and perseverance are far more important than raw talent.",
      "phonetic": "/ˌkjʊə.riˈɒs.ə.ti ænd ˌpɜː.sɪˈvɪə.rəns ɑː fɑː mɔːr ɪmˈpɔː.tənt/",
      "id_translation": "Rasa ingin tahu dan kegigihan jauh lebih penting daripada bakat semata.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Rasa ingin tahu dan kegigihan jauh lebih penting daripada bakat semata.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Curiosity and perseverance are far more important than raw talent.\"",
      "options_en": [
        "Curiosity and perseverance are far more important than raw talent.",
        "Discipline and hard work lead directly to happiness.",
        "Creativity is the most critical asset in engineering.",
        "Talent will always triumph without dedicated effort."
      ],
      "options_id": [
        "Rasa ingin tahu dan kegigihan jauh lebih penting daripada bakat semata.",
        "Bakat alami selalu mengalahkan kerja keras dalam jangka panjang.",
        "Pendidikan formal adalah kunci utama kesuksesan karir.",
        "Kita harus selalu bersemangat setiap pagi."
      ],
      "notes": "Penekanan pada suku kata kedua kata \"perseverance\" (/ˌpɜː.sɪˈvɪə.rəns/)."
    },
    {
      "id": "sh_03",
      "mode": "shadowing",
      "category": "Conversational • Luke’s English Podcast",
      "level": "Beginner",
      "en": "Let us touch base tomorrow afternoon to finalize the schedule.",
      "target": "Let us touch base tomorrow afternoon to finalize the schedule.",
      "phonetic": "/let ʌs tʌtʃ beɪs təˈmɒr.əʊ ˌɑːf.təˈnuːn tuː ˈfaɪ.nəl.aɪz/",
      "id_translation": "Mari kita saling berkabar besok siang untuk menyelesaikan jadwalnya.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Mari kita saling berkabar besok siang untuk menyelesaikan jadwalnya.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Let us touch base tomorrow afternoon to finalize the schedule.\"",
      "options_en": [
        "Let us touch base tomorrow afternoon to finalize the schedule.",
        "We must cancel tomorrow afternoon to review the contracts.",
        "Please send the schedule directly to our manager.",
        "Can you call me tomorrow morning before noon?"
      ],
      "options_id": [
        "Mari kita saling berkabar besok siang untuk menyelesaikan jadwalnya.",
        "Jangan lupa membawa dokumen penting besok pagi.",
        "Pertemuan dibatalkan karena ada kendala teknis.",
        "Kita harus segera memesan tiket penerbangan."
      ],
      "notes": "Idiom bisnis \"touch base\" berarti saling kontak singkat untuk update informasi."
    },
    {
      "id": "sh_04",
      "mode": "shadowing",
      "category": "Motivation • BBC 6-Minute English",
      "level": "Intermediate",
      "en": "It is vital to step out of your comfort zone to achieve real progress.",
      "target": "It is vital to step out of your comfort zone to achieve real progress.",
      "phonetic": "/ɪt ɪz ˈvaɪ.təl tuː step aʊt ɒv jɔː ˈkʌm.fət zəʊn/",
      "id_translation": "Sangat penting untuk keluar dari zona nyaman Anda demi mencapai kemajuan nyata.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Sangat penting untuk keluar dari zona nyaman Anda demi mencapai kemajuan nyata.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"It is vital to step out of your comfort zone to achieve real progress.\"",
      "options_en": [
        "It is vital to step out of your comfort zone to achieve real progress.",
        "It is impossible to leave your safe environment without assistance.",
        "Progress requires patience and steady routine work.",
        "Staying inside your comfort zone ensures maximum efficiency."
      ],
      "options_id": [
        "Sangat penting untuk keluar dari zona nyaman Anda demi mencapai kemajuan nyata.",
        "Kemajuan hanya bisa diraih jika kita tetap berada di tempat aman.",
        "Kesabaran adalah hal terpenting dalam menyelesaikan pekerjaan.",
        "Jangan mengambil risiko jika belum memiliki pengalaman."
      ],
      "notes": "Kata \"vital\" dilafalkan /ˈvaɪ.təl/, bukan /vi-tal/."
    },
    {
      "id": "sh_05",
      "mode": "shadowing",
      "category": "Tech Podcast • Hard Fork NYT",
      "level": "Advanced",
      "en": "Artificial intelligence is fundamentally transforming how developers write code.",
      "target": "Artificial intelligence is fundamentally transforming how developers write code.",
      "phonetic": "/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns ɪz ˌfʌn.dəˈmen.təl.i trænsˈfɔː.mɪŋ/",
      "id_translation": "Kecerdasan buatan secara fundamental mengubah cara para pengembang menulis kode.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Kecerdasan buatan secara fundamental mengubah cara para pengembang menulis kode.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Artificial intelligence is fundamentally transforming how developers write code.\"",
      "options_en": [
        "Artificial intelligence is fundamentally transforming how developers write code.",
        "Modern computers require massive hardware to compile software.",
        "Software engineers should learn manual memory management.",
        "Cloud infrastructure speeds up continuous deployment cycles."
      ],
      "options_id": [
        "Kecerdasan buatan secara fundamental mengubah cara para pengembang menulis kode.",
        "Komputer modern membutuhkan memori yang sangat besar untuk bekerja.",
        "Programmer harus belajar bahasa pemrograman baru setiap tahun.",
        "Teknologi internet mempercepat komunikasi antar kantor."
      ],
      "notes": "Penekanan pada suku kata utama: fun-da-MEN-tal-ly dan trans-FORM-ing."
    },
    {
      "id": "sh_06",
      "mode": "shadowing",
      "category": "Mindset • The Tim Ferriss Show",
      "level": "Intermediate",
      "en": "Consistency in daily practice is what separates amateurs from professionals.",
      "target": "Consistency in daily practice is what separates amateurs from professionals.",
      "phonetic": "/kənˈsɪs.tən.si ɪn ˈdeɪ.li ˈpræk.tɪs ɪz wɒt ˈsep.ər.eɪts ˈæm.ə.tərz/",
      "id_translation": "Konsistensi dalam latihan harian adalah hal yang membedakan amatir dari profesional.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Konsistensi dalam latihan harian adalah hal yang membedakan amatir dari profesional.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Consistency in daily practice is what separates amateurs from professionals.\"",
      "options_en": [
        "Consistency in daily practice is what separates amateurs from professionals.",
        "Natural aptitude determines the eventual height of one’s career.",
        "Working long hours without breaks leads to rapid mastery.",
        "Experience in the industry is the sole measurement of expertise."
      ],
      "options_id": [
        "Konsistensi dalam latihan harian adalah hal yang membedakan amatir dari profesional.",
        "Bakat bawaan lahir menentukan seberapa tinggi karir seseorang.",
        "Bekerja tanpa istirahat menghasilkan penguasaan yang cepat.",
        "Pengalaman puluhan tahun adalah satu-satunya ukuran keahlian."
      ],
      "notes": "Perhatikan pengucapan \"amateurs\" (/ˈæm.ə.tərz/)."
    },
    {
      "id": "sh_07",
      "mode": "shadowing",
      "category": "Developer • Google Cloud Platform Podcast",
      "level": "Advanced",
      "en": "We need to address the underlying vulnerabilities before deploying to production.",
      "target": "We need to address the underlying vulnerabilities before deploying to production.",
      "phonetic": "/wiː niːd tuː əˈdres ðiː ˌʌn.dəˈlaɪ.ɪŋ ˌvʌl.nər.əˈbɪl.ə.tiz/",
      "id_translation": "Kita perlu mengatasi kerentanan mendasar sebelum merilis ke lingkungan produksi.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Kita perlu mengatasi kerentanan mendasar sebelum merilis ke lingkungan produksi.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"We need to address the underlying vulnerabilities before deploying to production.\"",
      "options_en": [
        "We need to address the underlying vulnerabilities before deploying to production.",
        "We must install additional servers to handle peak user traffic.",
        "Security patches should be reviewed by the marketing department.",
        "The database query must be optimized for microsecond latency."
      ],
      "options_id": [
        "Kita perlu mengatasi kerentanan mendasar sebelum merilis ke lingkungan produksi.",
        "Kita harus menambah server baru untuk menampung lonjakan pengguna.",
        "Pembaruan keamanan harus diperiksa oleh tim pemasaran.",
        "Basis data perlu dioptimalkan agar respon lebih cepat."
      ],
      "notes": "Latih artikulasi kata panjang \"vulnerabilities\" (/ˌvʌl.nər.əˈbɪl.ə.tiz/)."
    },
    {
      "id": "sh_08",
      "mode": "shadowing",
      "category": "Workplace • BBC English HowTo",
      "level": "Beginner",
      "en": "Would you mind giving me a hand with this presentation?",
      "target": "Would you mind giving me a hand with this presentation?",
      "phonetic": "/wʊd juː maɪnd ˈɡɪv.ɪŋ miː ə hænd wɪð ðɪs ˌprez.ənˈteɪ.ʃən/",
      "id_translation": "Apakah Anda keberatan membantu saya menyiapkan presentasi ini?",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Apakah Anda keberatan membantu saya menyiapkan presentasi ini?\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Would you mind giving me a hand with this presentation?\"",
      "options_en": [
        "Would you mind giving me a hand with this presentation?",
        "Can you review the presentation slides by yourself?",
        "Do you want me to cancel tomorrow’s presentation?",
        "Are you ready to deliver the speech in front of the board?"
      ],
      "options_id": [
        "Apakah Anda keberatan membantu saya menyiapkan presentasi ini?",
        "Bisakah Anda memeriksa dokumen presentasi ini sendirian?",
        "Apakah Anda ingin membatalkan presentasi besok pagi?",
        "Apakah Anda sudah siap berpidato di hadapan dewan direksi?"
      ],
      "notes": "Idiom \"give me a hand\" berarti memberi pertolongan/bantuan."
    },
    {
      "id": "sh_09",
      "mode": "shadowing",
      "category": "Soft Skills • All Ears English",
      "level": "Intermediate",
      "en": "I truly appreciate your feedback; it sheds light on a blind spot I had.",
      "target": "I truly appreciate your feedback; it sheds light on a blind spot I had.",
      "phonetic": "/aɪ ˈtruː.li əˈpriː.ʃi.eɪt jɔː ˈfiːd.bæk ɪt ʃedz laɪt ɒn ə blaɪnd spɒt/",
      "id_translation": "Saya sangat menghargai masukan Anda; ini memperjelas titik buta yang sebelumnya tidak saya sadari.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Saya sangat menghargai masukan Anda; ini memperjelas titik buta yang sebelumnya tidak saya sadari.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"I truly appreciate your feedback; it sheds light on a blind spot I had.\"",
      "options_en": [
        "I truly appreciate your feedback; it sheds light on a blind spot I had.",
        "I disagree with your remarks because they overlook key factors.",
        "Your suggestions were submitted too late for consideration.",
        "We should discuss this privately after the seminar concludes."
      ],
      "options_id": [
        "Saya sangat menghargai masukan Anda; ini memperjelas titik buta yang sebelumnya tidak saya sadari.",
        "Saya kurang setuju dengan catatan Anda karena mengabaikan faktor penting.",
        "Saran Anda terlambat dikirimkan sehingga tidak sempat dipertimbangkan.",
        "Mari kita bicarakan hal ini secara tertutup setelah seminar selesai."
      ],
      "notes": "\"Sheds light on\" adalah idiom untuk memperjelas atau menerangkan sesuatu."
    },
    {
      "id": "sh_10",
      "mode": "shadowing",
      "category": "Business • Bloomberg Technology",
      "level": "Advanced",
      "en": "The intricate balance between innovation and regulation remains fiercely debated.",
      "target": "The intricate balance between innovation and regulation remains fiercely debated.",
      "phonetic": "/ðiː ˈɪn.trɪ.kət ˈbæl.əns bɪˈtwiːn ˌɪn.əˈveɪ.ʃən ænd ˌreɡ.jəˈleɪ.ʃən/",
      "id_translation": "Keseimbangan rumit antara inovasi dan regulasi masih terus diperdebatkan secara sengit.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Keseimbangan rumit antara inovasi dan regulasi masih terus diperdebatkan secara sengit.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The intricate balance between innovation and regulation remains fiercely debated.\"",
      "options_en": [
        "The intricate balance between innovation and regulation remains fiercely debated.",
        "Governments around the world have universally banned automated systems.",
        "New technological breakthroughs have made regulations completely obsolete.",
        "Regulatory compliance is the sole driver of enterprise profitability."
      ],
      "options_id": [
        "Keseimbangan rumit antara inovasi dan regulasi masih terus diperdebatkan secara sengit.",
        "Pemerintah dunia telah sepakat melarang seluruh sistem otomatis.",
        "Penemuan teknologi mutakhir telah membuat aturan hukum tak berguna.",
        "Kepatuhan aturan adalah satu-satunya penentu keuntungan perusahaan."
      ],
      "notes": "Lafalkan \"intricate\" sebagai /ˈɪn.trɪ.kət/ dengan penekanan di suku kata pertama."
    },
    {
      "id": "sh_11",
      "mode": "shadowing",
      "category": "Pronunciation • Rachel’s English",
      "level": "Beginner",
      "en": "Take your time and let me know when you are ready to proceed.",
      "target": "Take your time and let me know when you are ready to proceed.",
      "phonetic": "/teɪk jɔː taɪm ænd let miː nəʊ wen juː ɑː ˈred.i tuː prəˈsiːd/",
      "id_translation": "Santai saja dan beri tahu saya ketika Anda sudah siap untuk melanjutkan.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Santai saja dan beri tahu saya ketika Anda sudah siap untuk melanjutkan.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Take your time and let me know when you are ready to proceed.\"",
      "options_en": [
        "Take your time and let me know when you are ready to proceed.",
        "Hurry up because our flight is boarding in ten minutes.",
        "Please sit down and wait until your queue number is called.",
        "Do you need additional time to review the contract terms?"
      ],
      "options_id": [
        "Santai saja dan beri tahu saya ketika Anda sudah siap untuk melanjutkan.",
        "Cepatlah karena pesawat kita akan lepas landas sepuluh menit lagi.",
        "Silakan duduk dan tunggu nomor antrean Anda dipanggil.",
        "Apakah Anda butuh waktu tambahan untuk memeriksa berkas kontrak?"
      ],
      "notes": "Perhatikan linking sound \"let me know\" (/let‿miː nəʊ/)."
    },
    {
      "id": "sh_12",
      "mode": "shadowing",
      "category": "Entrepreneurship • How I Built This with Guy Raz",
      "level": "Intermediate",
      "en": "To be honest, the initial results exceeded all our preliminary expectations.",
      "target": "To be honest, the initial results exceeded all our preliminary expectations.",
      "phonetic": "/tuː biː ˈɒn.ɪst ðiː ɪˈnɪʃ.əl rɪˈzʌlts ɪkˈsiː.dɪd ɔːl ˈaʊər prɪˈlɪm.ɪ.nər.i/",
      "id_translation": "Sejujurnya, hasil awal melampaui semua ekspektasi awal kami.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Sejujurnya, hasil awal melampaui semua ekspektasi awal kami.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"To be honest, the initial results exceeded all our preliminary expectations.\"",
      "options_en": [
        "To be honest, the initial results exceeded all our preliminary expectations.",
        "Unfortunately, the launch failed to meet our minimum sales quota.",
        "We anticipate substantial growth over the upcoming fiscal quarter.",
        "Customer retention declined sharply after the pricing restructure."
      ],
      "options_id": [
        "Sejujurnya, hasil awal melampaui semua ekspektasi awal kami.",
        "Sayangnya, peluncuran produk gagal memenuhi target penjualan minimal.",
        "Kami memperkirakan pertumbuhan pesat pada kuartal keuangan berikutnya.",
        "Tingkat retensi pelanggan merosot tajam setelah harga diubah."
      ],
      "notes": "Huruf \"h\" pada kata \"honest\" tidak dibunyikan (silent h: /ˈɒn.ɪst/)."
    },
    {
      "id": "sh_13",
      "mode": "shadowing",
      "category": "Psychology • The Knowledge Project",
      "level": "Advanced",
      "en": "Cognitive biases frequently distort our perception of risk and probability.",
      "target": "Cognitive biases frequently distort our perception of risk and probability.",
      "phonetic": "/ˈkɒɡ.nə.tɪv ˈbaɪ.əs.ɪz ˈfriː.kwənt.li dɪˈstɔːt ˈaʊər pəˈsep.ʃən/",
      "id_translation": "Bias kognitif sering kali mendistorsi persepsi kita tentang risiko dan probabilitas.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Bias kognitif sering kali mendistorsi persepsi kita tentang risiko dan probabilitas.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Cognitive biases frequently distort our perception of risk and probability.\"",
      "options_en": [
        "Cognitive biases frequently distort our perception of risk and probability.",
        "Rational decision making guarantees successful outcomes in all markets.",
        "Emotional intelligence is primarily dictated by genetic predispositions.",
        "Statistical calculations eliminate psychological stress in trading."
      ],
      "options_id": [
        "Bias kognitif sering kali mendistorsi persepsi kita tentang risiko dan probabilitas.",
        "Keputusan rasional menjamin hasil yang menguntungkan di semua pasar.",
        "Kecerdasan emosional terutama dibentuk oleh faktor genetik.",
        "Perhitungan statistik menghilangkan tekanan batin dalam berinvestasi."
      ],
      "notes": "Artikulasi kata \"biases\" (/ˈbaɪ.əs.ɪz/) dengan akhiran jamak yang jelas."
    },
    {
      "id": "sh_14",
      "mode": "shadowing",
      "category": "ESL Essentials • RealLife English",
      "level": "Beginner",
      "en": "Could you repeat that sentence a little slower, please?",
      "target": "Could you repeat that sentence a little slower, please?",
      "phonetic": "/kʊd juː rɪˈpiːt ðæt ˈsen.təns ə ˈlɪt.əl ˈsləʊ.ər pliːz/",
      "id_translation": "Bisakah Anda mengulangi kalimat itu sedikit lebih lambat?",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Bisakah Anda mengulangi kalimat itu sedikit lebih lambat?\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Could you repeat that sentence a little slower, please?\"",
      "options_en": [
        "Could you repeat that sentence a little slower, please?",
        "Can you write down your email address on this paper?",
        "Where is the nearest subway station from here?",
        "What time does the conference registration begin?"
      ],
      "options_id": [
        "Bisakah Anda mengulangi kalimat itu sedikit lebih lambat?",
        "Bisakah Anda menuliskan alamat email Anda di kertas ini?",
        "Di manakah stasiun kereta bawah tanah terdekat dari sini?",
        "Pukul berapa pendaftaran seminar dimulai?"
      ],
      "notes": "Frasa wajib dan sangat berguna bagi pembelajar saat berbicara dengan penutur asli."
    },
    {
      "id": "sh_15",
      "mode": "shadowing",
      "category": "Finance • Bloomberg Radio",
      "level": "Intermediate",
      "en": "We should weigh the pros and cons thoroughly before committing any capital.",
      "target": "We should weigh the pros and cons thoroughly before committing any capital.",
      "phonetic": "/wiː ʃʊd weɪ ðə prəʊz ænd kɒnz ˈθʌr.ə.li bɪˈfɔː kəˈmɪt.ɪŋ/",
      "id_translation": "Kita harus menimbang kelebihan dan kekurangannya secara matang sebelum menanamkan modal.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Kita harus menimbang kelebihan dan kekurangannya secara matang sebelum menanamkan modal.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"We should weigh the pros and cons thoroughly before committing any capital.\"",
      "options_en": [
        "We should weigh the pros and cons thoroughly before committing any capital.",
        "We must invest immediately before stock prices rise further.",
        "All capital expenses must be approved by the accounting division.",
        "The board decided to liquidate remaining assets without delay."
      ],
      "options_id": [
        "Kita harus menimbang kelebihan dan kekurangannya secara matang sebelum menanamkan modal.",
        "Kita harus berinvestasi sekarang sebelum harga saham naik lebih tinggi.",
        "Semua pengeluaran modal harus disetujui oleh divisi akuntansi.",
        "Dewan direksi memutuskan untuk mencairkan aset yang tersisa segera."
      ],
      "notes": "Idiom \"pros and cons\" berarti untung rugi atau kelebihan dan kekurangan."
    },
    {
      "id": "sh_16",
      "mode": "shadowing",
      "category": "Open Source • Talk Python To Me",
      "level": "Advanced",
      "en": "The democratization of open-source models has accelerated global collaboration.",
      "target": "The democratization of open-source models has accelerated global collaboration.",
      "phonetic": "/ðə dɪˌmɒk.rə.taɪˈzeɪ.ʃən ɒv ˈəʊ.pən sɔːs ˈmɒd.əlz/",
      "id_translation": "Demokratisasi model sumber terbuka telah mempercepat kolaborasi di seluruh dunia.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Demokratisasi model sumber terbuka telah mempercepat kolaborasi di seluruh dunia.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The democratization of open-source models has accelerated global collaboration.\"",
      "options_en": [
        "The democratization of open-source models has accelerated global collaboration.",
        "Proprietary software continues to dominate enterprise data centers.",
        "Software engineers prefer closed architectures for high security.",
        "Cloud vendors offer managed hosting for distributed clusters."
      ],
      "options_id": [
        "Demokratisasi model sumber terbuka telah mempercepat kolaborasi di seluruh dunia.",
        "Perangkat lunak berbayar masih mendominasi pusat data perusahaan besar.",
        "Para pengembang lebih memilih sistem tertutup demi keamanan data.",
        "Penyedia cloud menawarkan hosting terkelola untuk server terdistribusi."
      ],
      "notes": "Perhatikan ritme pada kata \"democratization\" (/dɪˌmɒk.rə.taɪˈzeɪ.ʃən/)."
    },
    {
      "id": "sh_17",
      "mode": "shadowing",
      "category": "Casual English • Culips Podcast",
      "level": "Beginner",
      "en": "I am really looking forward to catching up with you this weekend.",
      "target": "I am really looking forward to catching up with you this weekend.",
      "phonetic": "/aɪ æm ˈrɪə.li ˈlʊk.ɪŋ ˈfɔː.wəd tuː ˈkætʃ.ɪŋ ʌp wɪð juː/",
      "id_translation": "Saya sangat menantikan untuk bertemu dan mengobrol dengan Anda akhir pekan ini.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Saya sangat menantikan untuk bertemu dan mengobrol dengan Anda akhir pekan ini.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"I am really looking forward to catching up with you this weekend.\"",
      "options_en": [
        "I am really looking forward to catching up with you this weekend.",
        "I will probably be too busy with office work to meet anyone.",
        "Let us postpone our dinner appointment until next Friday.",
        "Did you finish the assignment we discussed yesterday?"
      ],
      "options_id": [
        "Saya sangat menantikan untuk bertemu dan mengobrol dengan Anda akhir pekan ini.",
        "Kemungkinan saya terlalu sibuk dengan pekerjaan kantor untuk bertemu.",
        "Mari kita tunda janji makan malam sampai Jumat depan.",
        "Apakah Anda sudah menyelesaikan tugas yang kita bahas kemarin?"
      ],
      "notes": "\"Catch up\" adalah phrasal verb umum untuk saling bertukar kabar setelah lama tak jumpa."
    },
    {
      "id": "sh_18",
      "mode": "shadowing",
      "category": "Leadership • TED-Ed Talks",
      "level": "Intermediate",
      "en": "Effective communication is less about speaking and more about active listening.",
      "target": "Effective communication is less about speaking and more about active listening.",
      "phonetic": "/ɪˈfek.tɪv kəˌmjuː.nɪˈkeɪ.ʃən ɪz les əˈbaʊt ˈspiː.kɪŋ ænd mɔːr/",
      "id_translation": "Komunikasi yang efektif bukan tentang banyak bicara, melainkan tentang mendengarkan secara aktif.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Komunikasi yang efektif bukan tentang banyak bicara, melainkan tentang mendengarkan secara aktif.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Effective communication is less about speaking and more about active listening.\"",
      "options_en": [
        "Effective communication is less about speaking and more about active listening.",
        "Public speaking requires memorizing long speeches word for word.",
        "Charisma is an innate personality trait that cannot be cultivated.",
        "Great managers avoid direct conversations during conflicts."
      ],
      "options_id": [
        "Komunikasi yang efektif bukan tentang banyak bicara, melainkan tentang mendengarkan secara aktif.",
        "Berbicara di depan umum memerlukan hafalan pidato kata demi kata.",
        "Karisma adalah bakat bawaan lahir yang tidak dapat dipelajari.",
        "Manajer yang baik menghindari obrolan langsung saat terjadi konflik."
      ],
      "notes": "Perhatikan kontras intonasi: \"less about speaking\" vs \"more about active listening\"."
    },
    {
      "id": "sh_19",
      "mode": "shadowing",
      "category": "Mindset • This American Life",
      "level": "Advanced",
      "en": "Resilience is not the absence of adversity, but the capacity to adapt through it.",
      "target": "Resilience is not the absence of adversity, but the capacity to adapt through it.",
      "phonetic": "/rɪˈzɪl.jəns ɪz nɒt ðiː ˈæb.səns ɒv ədˈvɜː.sə.ti/",
      "id_translation": "Ketangguhan bukanlah ketiadaan kesulitan, melainkan kemampuan untuk beradaptasi melaluinya.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Ketangguhan bukanlah ketiadaan kesulitan, melainkan kemampuan untuk beradaptasi melaluinya.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Resilience is not the absence of adversity, but the capacity to adapt through it.\"",
      "options_en": [
        "Resilience is not the absence of adversity, but the capacity to adapt through it.",
        "Success is measured exclusively by financial wealth and status.",
        "Hardship inevitably damages human determination in the long run.",
        "Confidence develops when people avoid challenging situations."
      ],
      "options_id": [
        "Ketangguhan bukanlah ketiadaan kesulitan, melainkan kemampuan untuk beradaptasi melaluinya.",
        "Kesuksesan hanya diukur dari kekayaan materi dan jabatan sosial.",
        "Kesulitan hidup pada akhirnya selalu merusak tekad manusia.",
        "Rasa percaya diri tumbuh saat orang menghindari situasi yang menantang."
      ],
      "notes": "Lafalkan \"adversity\" (/ədˈvɜː.sə.ti/) dengan penekanan suku kata kedua."
    },
    {
      "id": "sh_20",
      "mode": "shadowing",
      "category": "Travel • ESL Podcasts",
      "level": "Beginner",
      "en": "Have a safe flight and keep in touch while you are away.",
      "target": "Have a safe flight and keep in touch while you are away.",
      "phonetic": "/hæv ə seɪf flaɪt ænd kiːp ɪn tʌtʃ waɪl juː ɑːr əˈweɪ/",
      "id_translation": "Semoga penerbangan Anda aman dan tetaplah berkabar selama Anda bepergian.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Semoga penerbangan Anda aman dan tetaplah berkabar selama Anda bepergian.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Have a safe flight and keep in touch while you are away.\"",
      "options_en": [
        "Have a safe flight and keep in touch while you are away.",
        "Remember to pack warm clothing for the cold destination.",
        "Do not forget to exchange your money at the airport bank.",
        "Call the hotel directly if your flight gets delayed tonight."
      ],
      "options_id": [
        "Semoga penerbangan Anda aman dan tetaplah berkabar selama Anda bepergian.",
        "Jangan lupa membawa pakaian hangat untuk tujuan yang dingin.",
        "Jangan lupa menukarkan uang Anda di bank bandara.",
        "Hubungi pihak hotel secara langsung jika penerbangan Anda tertunda malam ini."
      ],
      "notes": "Ungkapan ramah perpisahan \"keep in touch\" (/kiːp ɪn tʌtʃ/)."
    }
  ],
  "listening": [
    {
      "id": "ls_01",
      "mode": "listening",
      "category": "Dictation • Numblr Resource",
      "level": "Intermediate",
      "en": "The flight arrives at gate twenty-four at seven fifteen PM.",
      "target": "The flight arrives at gate twenty-four at seven fifteen PM.",
      "phonetic": "/ðə flaɪt əˈraɪvz æt ɡeɪt ˈtwen.ti fɔːr æt ˈsev.ən fɪfˈtiːn/",
      "id_translation": "Penerbangan tiba di gerbang dua puluh empat pada pukul tujuh lima belas malam.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Penerbangan tiba di gerbang dua puluh empat pada pukul tujuh lima belas malam.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The flight arrives at gate twenty-four at seven fifteen PM.\"",
      "options_en": [
        "The flight arrives at gate twenty-four at seven fifteen PM.",
        "The train departs from track fourteen at seven fifty PM.",
        "The bus will stop at terminal twenty-five at eight fifteen PM.",
        "Our flight lands at gate thirty-four at six fifteen PM."
      ],
      "options_id": [
        "Penerbangan tiba di gerbang dua puluh empat pada pukul tujuh lima belas malam.",
        "Kereta berangkat dari jalur empat belas pukul tujuh lima puluh malam.",
        "Bus akan berhenti di terminal dua puluh lima pukul delapan lima belas malam.",
        "Penerbangan kami mendarat di gerbang tiga puluh empat pukul enam lima belas."
      ],
      "notes": "Latihan pendengaran angka gate \"twenty-four\" dan waktu \"seven fifteen\"."
    },
    {
      "id": "ls_02",
      "mode": "listening",
      "category": "Listening • NPR News Brief",
      "level": "Intermediate",
      "en": "Global investment in clean renewable energy reached record levels this year.",
      "target": "Global investment in clean renewable energy reached record levels this year.",
      "phonetic": "/ˈɡləʊ.bəl ɪnˈvest.mənt ɪn kliːn rɪˈnjuː.ə.bəl ˈen.ə.dʒi/",
      "id_translation": "Investasi global dalam energi terbarukan yang bersih mencapai rekor tahun ini.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Investasi global dalam energi terbarukan yang bersih mencapai rekor tahun ini.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Global investment in clean renewable energy reached record levels this year.\"",
      "options_en": [
        "Global investment in clean renewable energy reached record levels this year.",
        "Traditional energy companies reduced their exploration budgets sharply.",
        "International leaders signed a historic treaty to combat pollution.",
        "Electric vehicle production expanded across major European markets."
      ],
      "options_id": [
        "Investasi global dalam energi terbarukan yang bersih mencapai rekor tahun ini.",
        "Perusahaan energi tradisional memotong anggaran eksplorasi secara tajam.",
        "Para pemimpin dunia menandatangani perjanjian bersejarah untuk melawan polusi.",
        "Produksi mobil listrik melonjak di pasar-pasar utama Eropa."
      ],
      "notes": "Dengarkan baik-baik kata \"renewable\" (/rɪˈnjuː.ə.bəl/)."
    },
    {
      "id": "ls_03",
      "mode": "listening",
      "category": "Listening • BBC Learning English",
      "level": "Beginner",
      "en": "Could you recommend a quiet coffee shop near the central station?",
      "target": "Could you recommend a quiet coffee shop near the central station?",
      "phonetic": "/kʊd juː ˌrek.əˈmend ə ˈkwaɪət ˈkɒf.i ʃɒp nɪə ðə ˈsen.trəl ˈsteɪ.ʃən/",
      "id_translation": "Bisakah Anda merekomendasikan kedai kopi yang tenang dekat stasiun pusat?",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Bisakah Anda merekomendasikan kedai kopi yang tenang dekat stasiun pusat?\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Could you recommend a quiet coffee shop near the central station?\"",
      "options_en": [
        "Could you recommend a quiet coffee shop near the central station?",
        "Is there an Italian restaurant close to the library?",
        "Can you tell me how to get to the nearest convenience store?",
        "Where can I purchase a ticket for the express train?"
      ],
      "options_id": [
        "Bisakah Anda merekomendasikan kedai kopi yang tenang dekat stasiun pusat?",
        "Apakah ada restoran Italia yang dekat dengan perpustakaan?",
        "Bisakah Anda memberi tahu saya jalan ke minimarket terdekat?",
        "Di mana saya bisa membeli tiket untuk kereta ekspres?"
      ],
      "notes": "Frasa sopan untuk meminta rekomendasi tempat di area publik."
    },
    {
      "id": "ls_04",
      "mode": "listening",
      "category": "Dates & Times • Numblr Listening",
      "level": "Beginner",
      "en": "The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM.",
      "target": "The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM.",
      "phonetic": "/ðə ˈmiː.tɪŋ ɪz ˈʃed.juːld fɔː ˈtjuːz.deɪ mɑːtʃ ˌfɔːˈtiːnθ æt ten ˈθɜː.ti/",
      "id_translation": "Pertemuan dijadwalkan pada hari Selasa, empat belas Maret pukul sepuluh tiga puluh pagi.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Pertemuan dijadwalkan pada hari Selasa, empat belas Maret pukul sepuluh tiga puluh pagi.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM.\"",
      "options_en": [
        "The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM.",
        "The interview will take place on Thursday, May fourth at two thirty PM.",
        "We postponed the presentation to Wednesday, April fourteenth at nine AM.",
        "The team gathers every Monday morning at ten sharp in the boardroom."
      ],
      "options_id": [
        "Pertemuan dijadwalkan pada hari Selasa, empat belas Maret pukul sepuluh tiga puluh pagi.",
        "Wawancara akan berlangsung hari Kamis, empat Mei pukul dua tiga puluh siang.",
        "Kami menunda presentasi ke hari Rabu, empat belas April pukul sembilan pagi.",
        "Tim berkumpul setiap Senin pagi tepat pukul sepuluh di ruang rapat."
      ],
      "notes": "Bedakan pelafalan ordinal \"fourteenth\" (/ˌfɔːˈtiːnθ/) dengan \"fortieth\"."
    },
    {
      "id": "ls_05",
      "mode": "listening",
      "category": "Currency • Numblr Listening",
      "level": "Intermediate",
      "en": "The total invoice amounts to four hundred eighty-five dollars and fifty cents.",
      "target": "The total invoice amounts to four hundred eighty-five dollars and fifty cents.",
      "phonetic": "/ðə ˈtəʊ.təl ˈɪn.vɔɪs əˈmaʊnts tuː fɔː ˈhʌn.drəd ˈeɪ.ti faɪv ˈdɒl.əz/",
      "id_translation": "Total tagihan berjumlah empat ratus delapan puluh lima dolar lima puluh sen.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Total tagihan berjumlah empat ratus delapan puluh lima dolar lima puluh sen.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The total invoice amounts to four hundred eighty-five dollars and fifty cents.\"",
      "options_en": [
        "The total invoice amounts to four hundred eighty-five dollars and fifty cents.",
        "The shipping cost is three hundred fifty-five dollars and fifteen cents.",
        "We received a discount of fifty-five dollars on the overall order.",
        "Your monthly subscription fee is four hundred ninety dollars."
      ],
      "options_id": [
        "Total tagihan berjumlah empat ratus delapan puluh lima dolar lima puluh sen.",
        "Biaya pengiriman adalah tiga ratus lima puluh lima dolar lima belas sen.",
        "Kami mendapatkan potongan lima puluh lima dolar untuk pesanan keseluruhan.",
        "Biaya langganan bulanan Anda adalah empat ratus sembilan puluh dolar."
      ],
      "notes": "Latihan angka ratusan dan desimal sen (\"four hundred eighty-five dollars and fifty cents\")."
    },
    {
      "id": "ls_06",
      "mode": "listening",
      "category": "Economy • Bloomberg Radio",
      "level": "Advanced",
      "en": "Inflation dropped to two point seven percent in the third quarter.",
      "target": "Inflation dropped to two point seven percent in the third quarter.",
      "phonetic": "/ɪnˈfleɪ.ʃən drɒpt tuː tuː pɔɪnt ˈsev.ən pəˈsent ɪn ðə θɜːd ˈkwɔː.tər/",
      "id_translation": "Inflasi turun menjadi dua koma tujuh persen pada kuartal ketiga.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Inflasi turun menjadi dua koma tujuh persen pada kuartal ketiga.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Inflation dropped to two point seven percent in the third quarter.\"",
      "options_en": [
        "Inflation dropped to two point seven percent in the third quarter.",
        "Unemployment rose to three point seven percent earlier this month.",
        "Interest rates remained unchanged at four point five percent.",
        "Consumer confidence declined slightly in the fourth quarter."
      ],
      "options_id": [
        "Inflasi turun menjadi dua koma tujuh persen pada kuartal ketiga.",
        "Tingkat pengangguran naik menjadi tiga koma tujuh persen awal bulan ini.",
        "Suku bunga tetap tidak berubah pada posisi empat koma lima persen.",
        "Kepercayaan konsumen sedikit menurun pada kuartal keempat."
      ],
      "notes": "Latihan mendengarkan angka desimal (\"two point seven percent\")."
    },
    {
      "id": "ls_07",
      "mode": "listening",
      "category": "Phone • Numblr Listening",
      "level": "Beginner",
      "en": "Please dial extension three zero eight to reach technical support.",
      "target": "Please dial extension three zero eight to reach technical support.",
      "phonetic": "/pliːz ˈdaɪ.əl ɪkˈsten.ʃən θriː ˈzɪə.rəʊ eɪt tuː riːtʃ/",
      "id_translation": "Silakan tekan ekstensi tiga nol delapan untuk menghubungi bantuan teknis.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Silakan tekan ekstensi tiga nol delapan untuk menghubungi bantuan teknis.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Please dial extension three zero eight to reach technical support.\"",
      "options_en": [
        "Please dial extension three zero eight to reach technical support.",
        "Call operator seven zero eight to reserve a conference room.",
        "Contact our customer service desk on line four zero eight.",
        "Press nine to leave a voicemail message for the representative."
      ],
      "options_id": [
        "Silakan tekan ekstensi tiga nol delapan untuk menghubungi bantuan teknis.",
        "Hubungi operator tujuh nol delapan untuk memesan ruang rapat.",
        "Hubungi meja layanan pelanggan kami di saluran empat nol delapan.",
        "Tekan sembilan untuk meninggalkan pesan suara bagi perwakilan kami."
      ],
      "notes": "Angka 0 sering dilafalkan \"zero\" atau \"oh\" (/əʊ/)."
    },
    {
      "id": "ls_08",
      "mode": "listening",
      "category": "World Events • CNN 10",
      "level": "Intermediate",
      "en": "The conference will host over twelve hundred participants from fifty countries.",
      "target": "The conference will host over twelve hundred participants from fifty countries.",
      "phonetic": "/ðə ˈkɒn.fər.əns wɪl həʊst ˈəʊ.vər twelv ˈhʌn.drəd pɑːˈtɪs.ɪ.pənts/",
      "id_translation": "Konferensi ini akan menampung lebih dari seribu dua ratus peserta dari lima puluh negara.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Konferensi ini akan menampung lebih dari seribu dua ratus peserta dari lima puluh negara.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The conference will host over twelve hundred participants from fifty countries.\"",
      "options_en": [
        "The conference will host over twelve hundred participants from fifty countries.",
        "The exhibition welcomed nearly two thousand delegates from fifteen nations.",
        "The festival attracted over twelve thousand visitors over five days.",
        "The committee selected twenty-five scholarship recipients this year."
      ],
      "options_id": [
        "Konferensi ini akan menampung lebih dari seribu dua ratus peserta dari lima puluh negara.",
        "Pameran ini menyambut hampir dua ribu delegasi dari lima belas negara.",
        "Festival ini menarik lebih dari dua belas ribu pengunjung selama lima hari.",
        "Komite telah memilih dua puluh lima penerima beasiswa tahun ini."
      ],
      "notes": "Penutur asli sering menyebut 1,200 sebagai \"twelve hundred\" alih-alih \"one thousand two hundred\"."
    },
    {
      "id": "ls_09",
      "mode": "listening",
      "category": "Science • Sky News Swipe",
      "level": "Advanced",
      "en": "The spacecraft completed its orbital insertion at approximately nineteen hundred hours.",
      "target": "The spacecraft completed its orbital insertion at approximately nineteen hundred hours.",
      "phonetic": "/ðə ˈspeɪs.krɑːft kəmˈpliː.tɪd ɪts ˈɔː.bɪ.təl ɪnˈsɜː.ʃən æt əˈprɒk.sɪ.mət.li/",
      "id_translation": "Wahana antariksa berhasil menyelesaikan penyisipan orbitnya pada sekitar pukul sembilan belas.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Wahana antariksa berhasil menyelesaikan penyisipan orbitnya pada sekitar pukul sembilan belas.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The spacecraft completed its orbital insertion at approximately nineteen hundred hours.\"",
      "options_en": [
        "The spacecraft completed its orbital insertion at approximately nineteen hundred hours.",
        "The satellite lost communication shortly after twenty-one hundred hours.",
        "Ground control confirmed the lunar landing at nine thirty PM UTC.",
        "The telescope transmitted high-resolution images back to earth."
      ],
      "options_id": [
        "Wahana antariksa berhasil menyelesaikan penyisipan orbitnya pada sekitar pukul sembilan belas.",
        "Satelit kehilangan komunikasi sesaat setelah pukul dua puluh satu.",
        "Stasiun kendali bumi mengonfirmasi pendaratan di bulan pada pukul sembilan tiga puluh.",
        "Teleskop memancarkan gambar resolusi tinggi kembali ke bumi."
      ],
      "notes": "Waktu militer \"nineteen hundred hours\" sama dengan 19:00 (7:00 PM)."
    },
    {
      "id": "ls_10",
      "mode": "listening",
      "category": "Hospitality • Daily Listening",
      "level": "Beginner",
      "en": "Room four hundred and twelve is on the fourth floor next to the elevator.",
      "target": "Room four hundred and twelve is on the fourth floor next to the elevator.",
      "phonetic": "/ruːm fɔː ˈhʌn.drəd ænd twelv ɪz ɒn ðə fɔːθ flɔː nekst tuː ðiː ˈel.ɪ.veɪ.tər/",
      "id_translation": "Kamar empat ratus dua belas berada di lantai empat di sebelah lift.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Kamar empat ratus dua belas berada di lantai empat di sebelah lift.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Room four hundred and twelve is on the fourth floor next to the elevator.\"",
      "options_en": [
        "Room four hundred and twelve is on the fourth floor next to the elevator.",
        "Room four hundred and twenty is on the second floor near the stairs.",
        "Suite five hundred and twelve is reserved under Mr. Johnson’s name.",
        "The luggage was delivered to room four hundred and fourteen."
      ],
      "options_id": [
        "Kamar empat ratus dua belas berada di lantai empat di sebelah lift.",
        "Kamar empat ratus dua puluh berada di lantai dua dekat tangga.",
        "Kamar suite lima ratus dua belas dipesan atas nama Tuan Johnson.",
        "Koper telah diantarkan ke kamar empat ratus empat belas."
      ],
      "notes": "Latihan membedakan \"twelve\" (12) dan \"twenty\" (20)."
    },
    {
      "id": "ls_11",
      "mode": "listening",
      "category": "Weather • BBC London",
      "level": "Intermediate",
      "en": "Temperatures are expected to drop below freezing by late Friday evening.",
      "target": "Temperatures are expected to drop below freezing by late Friday evening.",
      "phonetic": "/ˈtem.prə.tʃərz ɑːr ɪkˈspek.tɪd tuː drɒp bɪˈləʊ ˈfriː.zɪŋ baɪ leɪt ˈfraɪ.deɪ/",
      "id_translation": "Suhu diperkirakan akan turun di bawah titik beku pada larut Jumat malam.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Suhu diperkirakan akan turun di bawah titik beku pada larut Jumat malam.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Temperatures are expected to drop below freezing by late Friday evening.\"",
      "options_en": [
        "Temperatures are expected to drop below freezing by late Friday evening.",
        "Heavy thunderstorms will hit the southern coast throughout Saturday morning.",
        "A mild breeze will keep the afternoon climate pleasant and dry.",
        "Dense fog is causing major travel delays at London Heathrow."
      ],
      "options_id": [
        "Suhu diperkirakan akan turun di bawah titik beku pada larut Jumat malam.",
        "Badai petir lebat akan melanda pesisir selatan sepanjang Sabtu pagi.",
        "Angin sepoi-sepoi akan menjaga cuaca siang hari tetap hangat dan kering.",
        "Kabut tebal menyebabkan gangguan penerbangan besar di London Heathrow."
      ],
      "notes": "Kata \"temperature\" lazim dilafalkan tiga suku kata: /ˈtem.prə.tʃər/."
    },
    {
      "id": "ls_12",
      "mode": "listening",
      "category": "Economics • Bloomberg News",
      "level": "Advanced",
      "en": "Gross domestic product expanded by three point four percent annualized.",
      "target": "Gross domestic product expanded by three point four percent annualized.",
      "phonetic": "/ɡrəʊs dəˈmes.tɪk ˈprɒd.ʌkt ɪkˈspæn.dɪd baɪ θriː pɔɪnt fɔː pəˈsent/",
      "id_translation": "Produk domestik bruto tumbuh sebesar tiga koma empat persen secara tahunan.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Produk domestik bruto tumbuh sebesar tiga koma empat persen secara tahunan.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Gross domestic product expanded by three point four percent annualized.\"",
      "options_en": [
        "Gross domestic product expanded by three point four percent annualized.",
        "Retail spending contracted by two point four percent in November.",
        "Manufacturing output grew by four point three percent year over year.",
        "Export volumes reached seventy-five billion dollars last quarter."
      ],
      "options_id": [
        "Produk domestik bruto tumbuh sebesar tiga koma empat persen secara tahunan.",
        "Belanja ritel mengalami penurunan sebesar dua koma empat persen di bulan November.",
        "Produksi manufaktur meningkat sebesar empat koma tiga persen dibanding tahun lalu.",
        "Volume ekspor menembus angka tujuh puluh lima miliar dolar pada kuartal lalu."
      ],
      "notes": "Singkatan GDP adalah singkatan dari \"Gross Domestic Product\"."
    },
    {
      "id": "ls_13",
      "mode": "listening",
      "category": "Transit • Travel Dictation",
      "level": "Beginner",
      "en": "Her train departs from platform six at eleven forty-five.",
      "target": "Her train departs from platform six at eleven forty-five.",
      "phonetic": "/hɜː treɪn dɪˈpɑːts frɒm ˈplæt.fɔːm sɪks æt ɪˈlev.ən ˌfɔː.tiˈfaɪv/",
      "id_translation": "Keretanya berangkat dari peron enam pada pukul sebelas empat puluh lima.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Keretanya berangkat dari peron enam pada pukul sebelas empat puluh lima.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Her train departs from platform six at eleven forty-five.\"",
      "options_en": [
        "Her train departs from platform six at eleven forty-five.",
        "The train arrived on platform sixteen at ten forty-five.",
        "Our flight boards at gate six at twelve forty-five.",
        "The express bus leaves station seven at eleven fifteen."
      ],
      "options_id": [
        "Keretanya berangkat dari peron enam pada pukul sebelas empat puluh lima.",
        "Kereta tiba di peron enam belas pada pukul sepuluh empat puluh lima.",
        "Penerbangan kita masuk pesawat di gerbang enam pukul dua belas empat puluh lima.",
        "Bus ekspres meninggalkan halte tujuh pada pukul sebelas lima belas."
      ],
      "notes": "Perhatikan perbedaan angka peron \"six\" dan \"sixteen\"."
    },
    {
      "id": "ls_14",
      "mode": "listening",
      "category": "Research • NPR Social Science",
      "level": "Intermediate",
      "en": "Approximately seventy-three percent of survey respondents preferred remote work.",
      "target": "Approximately seventy-three percent of survey respondents preferred remote work.",
      "phonetic": "/əˈprɒk.sɪ.mət.li ˌsev.ən.ti θriː pəˈsent ɒv ˈsɜː.veɪ rɪˈspɒn.dənts/",
      "id_translation": "Sekitar tujuh puluh tiga persen responden survei lebih memilih bekerja dari jarak jauh.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Sekitar tujuh puluh tiga persen responden survei lebih memilih bekerja dari jarak jauh.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Approximately seventy-three percent of survey respondents preferred remote work.\"",
      "options_en": [
        "Approximately seventy-three percent of survey respondents preferred remote work.",
        "Over eighty-three percent of employees requested flexible working hours.",
        "Nearly seventy percent of companies transitioned to hybrid schedules.",
        "About sixty-three percent of managers reported higher productivity."
      ],
      "options_id": [
        "Sekitar tujuh puluh tiga persen responden survei lebih memilih bekerja dari jarak jauh.",
        "Lebih dari delapan puluh tiga persen karyawan meminta jam kerja fleksibel.",
        "Hampir tujuh puluh persen perusahaan beralih ke jadwal kerja campuran (hybrid).",
        "Sekitar enam puluh tiga persen manajer melaporkan produktivitas yang lebih tinggi."
      ],
      "notes": "Latihan menangkap angka persentase cepat: \"seventy-three percent\"."
    },
    {
      "id": "ls_15",
      "mode": "listening",
      "category": "Computing • TechLinked",
      "level": "Advanced",
      "en": "The algorithm processed seventeen million transactions in under two seconds.",
      "target": "The algorithm processed seventeen million transactions in under two seconds.",
      "phonetic": "/ðiː ˈæl.ɡə.rɪ.ðəm ˈprəʊ.sest ˌsev.ənˈtiːn ˈmɪl.jən trænˈzæk.ʃənz/",
      "id_translation": "Algoritma tersebut memproses tujuh belas juta transaksi dalam waktu kurang dari dua detik.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Algoritma tersebut memproses tujuh belas juta transaksi dalam waktu kurang dari dua detik.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The algorithm processed seventeen million transactions in under two seconds.\"",
      "options_en": [
        "The algorithm processed seventeen million transactions in under two seconds.",
        "The database handled seventy million records in less than ten seconds.",
        "The server received seventeen thousand requests within one minute.",
        "The neural network trained on seven million images in three hours."
      ],
      "options_id": [
        "Algoritma tersebut memproses tujuh belas juta transaksi dalam waktu kurang dari dua detik.",
        "Basis data menangani tujuh puluh juta catatan dalam waktu kurang dari sepuluh detik.",
        "Server menerima tujuh belas ribu permintaan dalam kurun waktu satu menit.",
        "Jaringan saraf tiruan dilatih menggunakan tujuh juta gambar dalam tiga jam."
      ],
      "notes": "Bedakan \"seventeen million\" (17.000.000) dengan \"seventy million\" (70.000.000)."
    },
    {
      "id": "ls_16",
      "mode": "listening",
      "category": "Commerce • Everyday English",
      "level": "Beginner",
      "en": "The store opens at eight in the morning and closes at nine at night.",
      "target": "The store opens at eight in the morning and closes at nine at night.",
      "phonetic": "/ðə stɔːr ˈəʊ.pənz æt eɪt ɪn ðə ˈmɔː.nɪŋ ænd ˈkləʊ.zɪz æt naɪn æt naɪt/",
      "id_translation": "Toko buka pukul delapan pagi dan tutup pukul sembilan malam.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Toko buka pukul delapan pagi dan tutup pukul sembilan malam.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The store opens at eight in the morning and closes at nine at night.\"",
      "options_en": [
        "The store opens at eight in the morning and closes at nine at night.",
        "The library opens at nine in the morning and closes at eight at night.",
        "The pharmacy is open twenty-four hours every single day.",
        "The bank operates from eight thirty AM until four PM weekdays."
      ],
      "options_id": [
        "Toko buka pukul delapan pagi dan tutup pukul sembilan malam.",
        "Perpustakaan buka pukul sembilan pagi dan tutup pukul delapan malam.",
        "Apotek ini buka dua puluh empat jam setiap hari.",
        "Bank beroperasi dari pukul delapan tiga puluh pagi hingga empat sore pada hari kerja."
      ],
      "notes": "Kombinasi waktu jam dasar yang sangat sering dijumpai sehari-hari."
    },
    {
      "id": "ls_17",
      "mode": "listening",
      "category": "Pricing • British Council LearnEnglish",
      "level": "Intermediate",
      "en": "Tickets cost thirty-nine pounds for adults and nineteen pounds for students.",
      "target": "Tickets cost thirty-nine pounds for adults and nineteen pounds for students.",
      "phonetic": "/ˈtɪk.ɪts kɒst ˌθɜː.ti naɪn paʊndz fɔːr ˈæd.ʌlts ænd ˌnaɪnˈtiːn paʊndz/",
      "id_translation": "Harga tiket adalah tiga puluh sembilan pound untuk dewasa dan sembilan belas pound untuk pelajar.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Harga tiket adalah tiga puluh sembilan pound untuk dewasa dan sembilan belas pound untuk pelajar.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Tickets cost thirty-nine pounds for adults and nineteen pounds for students.\"",
      "options_en": [
        "Tickets cost thirty-nine pounds for adults and nineteen pounds for students.",
        "Admission is forty-nine pounds for seniors and twenty-nine for children.",
        "Tickets are thirty pounds each if booked at least two weeks in advance.",
        "Group tickets for ten people are available for one hundred ninety pounds."
      ],
      "options_id": [
        "Harga tiket adalah tiga puluh sembilan pound untuk dewasa dan sembilan belas pound untuk pelajar.",
        "Biaya masuk adalah empat puluh sembilan pound untuk lansia dan dua puluh sembilan untuk anak-anak.",
        "Tiket seharga tiga puluh pound per orang jika dipesan minimal dua minggu sebelumnya.",
        "Tiket rombongan untuk sepuluh orang tersedia seharga seratus sembilan puluh pound."
      ],
      "notes": "Mata uang Inggris \"pounds\" dilafalkan /paʊndz/."
    },
    {
      "id": "ls_18",
      "mode": "listening",
      "category": "Environment • BBC News",
      "level": "Advanced",
      "en": "Carbon emissions have decreased by fourteen point six percent over five years.",
      "target": "Carbon emissions have decreased by fourteen point six percent over five years.",
      "phonetic": "/ˈkɑː.bən ɪˈmɪʃ.ənz hæv dɪˈkriːst baɪ ˌfɔːˈtiːn pɔɪnt sɪks pəˈsent/",
      "id_translation": "Emisi karbon telah berkurang sebesar empat belas koma enam persen selama lima tahun.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Emisi karbon telah berkurang sebesar empat belas koma enam persen selama lima tahun.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Carbon emissions have decreased by fourteen point six percent over five years.\"",
      "options_en": [
        "Carbon emissions have decreased by fourteen point six percent over five years.",
        "Renewable energy capacity expanded by forty point six percent since twenty twenty.",
        "Deforestation rates dropped by four point six percent across the Amazon basin.",
        "Air quality index improved by fourteen percent in metropolitan zones."
      ],
      "options_id": [
        "Emisi karbon telah berkurang sebesar empat belas koma enam persen selama lima tahun.",
        "Kapasitas energi terbarukan melesat empat puluh koma enam persen sejak tahun dua puluh dua puluh.",
        "Laju penggundulan hutan turun empat koma enam persen di seluruh cekungan Amazon.",
        "Indeks kualitas udara membaik sebesar empat belas persen di kawasan metropolitan."
      ],
      "notes": "Dengarkan angka \"fourteen point six\" (/ˌfɔːˈtiːn pɔɪnt sɪks/)."
    },
    {
      "id": "ls_19",
      "mode": "listening",
      "category": "Telephony • Numblr Practice",
      "level": "Beginner",
      "en": "Call me back at five five five, zero one nine four as soon as you can.",
      "target": "Call me back at five five five, zero one nine four as soon as you can.",
      "phonetic": "/kɔːl miː bæk æt faɪv faɪv faɪv ˈzɪə.rəʊ wʌn naɪn fɔːr/",
      "id_translation": "Hubungi saya kembali di nomor lima lima lima, nol satu sembilan empat sesegera mungkin.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Hubungi saya kembali di nomor lima lima lima, nol satu sembilan empat sesegera mungkin.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Call me back at five five five, zero one nine four as soon as you can.\"",
      "options_en": [
        "Call me back at five five five, zero one nine four as soon as you can.",
        "Send a text message to five five five, zero nine one four immediately.",
        "My temporary office phone is five five five, zero one four nine.",
        "Please leave your contact number at the reception desk upon arrival."
      ],
      "options_id": [
        "Hubungi saya kembali di nomor lima lima lima, nol satu sembilan empat sesegera mungkin.",
        "Kirimkan pesan teks ke nomor lima lima lima, nol sembilan satu empat segera.",
        "Nomor telepon kantor sementara saya adalah lima lima lima, nol satu empat sembilan.",
        "Tolong tinggalkan nomor kontak Anda di meja resepsionis saat tiba."
      ],
      "notes": "Latihan dikte urutan nomor telepon dalam Bahasa Inggris standar."
    },
    {
      "id": "ls_20",
      "mode": "listening",
      "category": "Logistics • Everyday Dictation",
      "level": "Intermediate",
      "en": "The package weighs approximately two point five kilograms.",
      "target": "The package weighs approximately two point five kilograms.",
      "phonetic": "/ðə ˈpæk.ɪdʒ weɪz əˈprɒk.sɪ.mət.li tuː pɔɪnt faɪv ˈkɪl.ə.ɡræmz/",
      "id_translation": "Paket tersebut memiliki berat sekitar dua koma lima kilogram.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Paket tersebut memiliki berat sekitar dua koma lima kilogram.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The package weighs approximately two point five kilograms.\"",
      "options_en": [
        "The package weighs approximately two point five kilograms.",
        "The shipment contains twelve items and weighs five point two kilograms.",
        "Excess baggage costs twenty-five dollars per additional kilogram.",
        "The dimensions of the parcel exceed maximum postal limits."
      ],
      "options_id": [
        "Paket tersebut memiliki berat sekitar dua koma lima kilogram.",
        "Pengiriman berisi dua belas barang dan memiliki berat lima koma dua kilogram.",
        "Kelebihan bagasi dikenakan biaya dua puluh lima dolar per kilogram tambahan.",
        "Ukuran paket melebihi batas ketentuan pos yang berlaku."
      ],
      "notes": "Pelafalan kata \"weighs\" berima dengan \"days\" (/weɪz/)."
    }
  ],
  "vocabulary": [
    {
        "id": "vocab_01",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Emosi & Karakter",
        "level": "Beginner",
        "word": "Grateful",
        "emoji": "🙏",
        "en": "Grateful",
        "target": "Grateful",
        "phonetic": "/ˈɡreɪt.fəl/",
        "id_translation": "Bersyukur / Berterima kasih",
        "options_id": [
            "Bersyukur / Berterima kasih",
            "Sombong / Membanggakan diri",
            "Cemas / Khawatir",
            "Marah / Kesal"
        ],
        "correctIndex": 0,
        "example": "I am truly grateful for all your guidance and support.",
        "example_id": "Saya sangat bersyukur atas segala bimbingan dan bantuan Anda.",
        "notes": "Adjective. Sinonim: thankful, appreciative. Digunakan untuk mengekspresikan rasa terima kasih yang mendalam."
    },
    {
        "id": "vocab_02",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Sifat Pribadi",
        "level": "Beginner",
        "word": "Brave",
        "emoji": "🦁",
        "en": "Brave",
        "target": "Brave",
        "phonetic": "/breɪv/",
        "id_translation": "Pemberani / Tidak takut",
        "options_id": [
            "Pemberani / Tidak takut",
            "Penakut / Pengecut",
            "Pemalu / Pendiam",
            "Licik / Curang"
        ],
        "correctIndex": 0,
        "example": "The brave firefighter saved the little puppy from the burning building.",
        "example_id": "Petugas pemadam kebakaran yang pemberani itu menyelamatkan anak anjing dari gedung yang terbakar.",
        "notes": "Adjective. Sinonim: courageous, fearless. Lawan kata (antonim): cowardly, timid."
    },
    {
        "id": "vocab_03",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Makanan & Rasa",
        "level": "Beginner",
        "word": "Delicious",
        "emoji": "🍕",
        "en": "Delicious",
        "target": "Delicious",
        "phonetic": "/dɪˈlɪʃ.əs/",
        "id_translation": "Sangat lezat / Enak",
        "options_id": [
            "Sangat lezat / Enak",
            "Pahit / Getir",
            "Hambar / Tidak berasa",
            "Basi / Berbau asam"
        ],
        "correctIndex": 0,
        "example": "My grandmother cooked a delicious chicken soup for dinner.",
        "example_id": "Nenek saya memasak sup ayam yang sangat lezat untuk makan malam.",
        "notes": "Adjective. Sinonim: tasty, yummy, savory. Digunakan untuk mendeskripsikan aroma atau rasa makanan yang nikmat."
    },
    {
        "id": "vocab_04",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Perilaku Sosial",
        "level": "Beginner",
        "word": "Generous",
        "emoji": "🎁",
        "en": "Generous",
        "target": "Generous",
        "phonetic": "/ˈdʒen.ər.əs/",
        "id_translation": "Dermawan / Suka berbagi",
        "options_id": [
            "Dermawan / Suka berbagi",
            "Pelit / Kikir",
            "Cemburu / Iri hati",
            "Keras kepala / Kaku"
        ],
        "correctIndex": 0,
        "example": "He was generous enough to donate half of his earnings to charity.",
        "example_id": "Dia cukup dermawan untuk menyumbangkan separuh dari penghasilannya ke badan amal.",
        "notes": "Adjective. Sinonim: charitable, magnanimous, benevolent. Lawan kata: stingy, selfish."
    },
    {
        "id": "vocab_05",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Karakter & Sikap",
        "level": "Beginner",
        "word": "Honest",
        "emoji": "😇",
        "en": "Honest",
        "target": "Honest",
        "phonetic": "/ˈɒn.ɪst/",
        "id_translation": "Jujur / Berkata benar",
        "options_id": [
            "Jujur / Berkata benar",
            "Suka berbohong / Munafik",
            "Cerdas / Banyak akal",
            "Pemarah / Cepat emosi"
        ],
        "correctIndex": 0,
        "example": "An honest person will always tell the truth even when it is difficult.",
        "example_id": "Orang yang jujur akan selalu berkata benar meskipun hal tersebut sulit.",
        "notes": "Adjective (huruf 'h' tidak dibaca / silent h). Sinonim: truthful, sincere, trustworthy."
    },
    {
        "id": "vocab_06",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Etika Pergaulan",
        "level": "Beginner",
        "word": "Polite",
        "emoji": "🤝",
        "en": "Polite",
        "target": "Polite",
        "phonetic": "/pəˈlaɪt/",
        "id_translation": "Sopan / Santun",
        "options_id": [
            "Sopan / Santun",
            "Kasar / Kurang ajar",
            "Ceroboh / Lalai",
            "Sombong / Pongah"
        ],
        "correctIndex": 0,
        "example": "It is important to be polite to everyone you meet in life.",
        "example_id": "Sangat penting untuk bersikap sopan kepada siapa pun yang Anda temui dalam hidup.",
        "notes": "Adjective. Sinonim: courteous, respectful, civil. Lawan kata: rude, impolite."
    },
    {
        "id": "vocab_07",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Sifat Mental",
        "level": "Beginner",
        "word": "Patient",
        "emoji": "⏳",
        "en": "Patient",
        "target": "Patient",
        "phonetic": "/ˈpeɪ.ʃənt/",
        "id_translation": "Sabar / Tabah",
        "options_id": [
            "Sabar / Tabah",
            "Tergesa-gesa / Tidak sabaran",
            "Cemas / Gelisah",
            "Bingung / Ragu-ragu"
        ],
        "correctIndex": 0,
        "example": "Learning a new language takes time, so you need to be patient with yourself.",
        "example_id": "Mempelajari bahasa baru membutuhkan waktu, jadi Anda harus sabar terhadap diri sendiri.",
        "notes": "Adjective. Sinonim: tolerant, persistent. Catatan: kata ini juga bisa berfungsi sebagai kata benda (Noun) bermakna 'pasien medis'."
    },
    {
        "id": "vocab_08",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Sikap & Keamanan",
        "level": "Beginner",
        "word": "Careful",
        "emoji": "⚠️",
        "en": "Careful",
        "target": "Careful",
        "phonetic": "/ˈkeə.fəl/",
        "id_translation": "Hati-hati / Cermat",
        "options_id": [
            "Hati-hati / Cermat",
            "Sembrono / Ugal-ugalan",
            "Takut / Gugup",
            "Lambat / Lemah"
        ],
        "correctIndex": 0,
        "example": "Be careful when crossing the busy road during rush hour.",
        "example_id": "Berhati-hatilah saat menyeberangi jalan raya yang ramai pada jam sibuk.",
        "notes": "Adjective. Sinonim: cautious, attentive, watchful. Lawan kata: careless, reckless."
    },
    {
        "id": "vocab_09",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Rasa Ingin Tahu",
        "level": "Beginner",
        "word": "Curious",
        "emoji": "🧐",
        "en": "Curious",
        "target": "Curious",
        "phonetic": "/ˈkjʊə.ri.əs/",
        "id_translation": "Penasaran / Ingin tahu",
        "options_id": [
            "Penasaran / Ingin tahu",
            "Cuek / Acuh tak acuh",
            "Mengantuk / Lelah",
            "Puas / Senang"
        ],
        "correctIndex": 0,
        "example": "Children are naturally curious about the world around them.",
        "example_id": "Anak-anak secara alami memiliki rasa ingin tahu yang besar tentang dunia di sekitar mereka.",
        "notes": "Adjective. Sinonim: inquisitive, interested, questioning. Sering diikuti preposisi 'about' (curious about)."
    },
    {
        "id": "vocab_10",
        "mode": "vocabulary",
        "category": "Kosakata Dasar • Aktivitas Sehari-hari",
        "level": "Beginner",
        "word": "Tired",
        "emoji": "🥱",
        "en": "Tired",
        "target": "Tired",
        "phonetic": "/taɪəd/",
        "id_translation": "Lelah / Letih",
        "options_id": [
            "Lelah / Letih",
            "Segar / Berenergi",
            "Kenyang / Puas",
            "Gembira / Bahagia"
        ],
        "correctIndex": 0,
        "example": "I felt very tired after working in the garden all morning.",
        "example_id": "Saya merasa sangat lelah setelah bekerja di kebun sepanjang pagi.",
        "notes": "Adjective. Sinonim: weary, fatigued, sleepy."
    },
    {
        "id": "vocab_11",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Kondisi Fisik",
        "level": "Elementary",
        "word": "Exhausted",
        "emoji": "😫",
        "en": "Exhausted",
        "target": "Exhausted",
        "phonetic": "/ɪɡˈzɔː.stɪd/",
        "id_translation": "Sangat lelah / Kehabisan tenaga",
        "options_id": [
            "Sangat lelah / Kehabisan tenaga",
            "Sangat lapar / Kelaparan",
            "Sangat marah / Murka",
            "Sangat bersemangat / Antusias"
        ],
        "correctIndex": 0,
        "example": "After running the full 42 km marathon, she felt completely exhausted.",
        "example_id": "Setelah berlari maraton penuh sejauh 42 km, dia merasa benar-benar kehabisan tenaga.",
        "notes": "Adjective. Tingkat lelah yang jauh lebih berat daripada sekadar 'tired'. Sinonim: drained, worn out, fatigued."
    },
    {
        "id": "vocab_12",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Keengganan",
        "level": "Elementary",
        "word": "Reluctant",
        "emoji": "🙈",
        "en": "Reluctant",
        "target": "Reluctant",
        "phonetic": "/rɪˈlʌk.tənt/",
        "id_translation": "Enggan / Ragu-ragu",
        "options_id": [
            "Enggan / Ragu-ragu",
            "Antusias / Bersemangat",
            "Yakin / Percaya diri",
            "Ikhlas / Sukarela"
        ],
        "correctIndex": 0,
        "example": "He was reluctant to admit his mistake in front of his colleagues.",
        "example_id": "Dia merasa enggan untuk mengakui kesalahannya di hadapan rekan-rekan kerjanya.",
        "notes": "Adjective. Menunjukkan rasa segan atau ketidaksediaan melakukan sesuatu. Sinonim: hesitant, unwilling."
    },
    {
        "id": "vocab_13",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Sejarah & Zaman",
        "level": "Elementary",
        "word": "Ancient",
        "emoji": "🏛️",
        "en": "Ancient",
        "target": "Ancient",
        "phonetic": "/ˈeɪn.ʃənt/",
        "id_translation": "Kuno / Sangat purba",
        "options_id": [
            "Kuno / Sangat purba",
            "Modern / Mutakhir",
            "Sementara / Sementara waktu",
            "Cepat / Instan"
        ],
        "correctIndex": 0,
        "example": "They discovered an ancient temple hidden deep inside the rainforest.",
        "example_id": "Mereka menemukan sebuah kuil kuno yang tersembunyi jauh di dalam hutan hujan.",
        "notes": "Adjective. Merujuk pada periode ribuan tahun lampau. Lawan kata: modern, contemporary."
    },
    {
        "id": "vocab_14",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Keindahan Visual",
        "level": "Elementary",
        "word": "Gorgeous",
        "emoji": "✨",
        "en": "Gorgeous",
        "target": "Gorgeous",
        "phonetic": "/ˈɡɔː.dʒəs/",
        "id_translation": "Sangat indah / Menawan",
        "options_id": [
            "Sangat indah / Menawan",
            "Jelek / Menjijikkan",
            "Membosankan / Monoton",
            "Sederhana / Bersahaja"
        ],
        "correctIndex": 0,
        "example": "The sunset over the beach was absolutely gorgeous yesterday evening.",
        "example_id": "Pemandangan matahari terbenam di atas pantai kemarin sore benar-benar sangat indah.",
        "notes": "Adjective. Sinonim: stunning, magnificent, dazzling. Lebih kuat dari sekadar 'beautiful'."
    },
    {
        "id": "vocab_15",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Interaksi Sosial",
        "level": "Elementary",
        "word": "Awkward",
        "emoji": "😳",
        "en": "Awkward",
        "target": "Awkward",
        "phonetic": "/ˈɔː.kwəd/",
        "id_translation": "Canggung / Kikuk",
        "options_id": [
            "Canggung / Kikuk",
            "Luwes / Percaya diri",
            "Anggun / Menawan",
            "Bahagia / Sukacita"
        ],
        "correctIndex": 0,
        "example": "There was an awkward silence when neither of them knew what to say next.",
        "example_id": "Terjadi keheningan yang canggung saat tak satu pun dari mereka tahu apa yang harus dikatakan selanjutnya.",
        "notes": "Adjective. Situasi yang membuat orang merasa tidak nyaman atau serba salah. Sinonim: clumsy, uncomfortable."
    },
    {
        "id": "vocab_16",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Sifat Keras Kepala",
        "level": "Elementary",
        "word": "Stubborn",
        "emoji": "🦏",
        "en": "Stubborn",
        "target": "Stubborn",
        "phonetic": "/ˈstʌb.ən/",
        "id_translation": "Keras kepala / Susah dinasihati",
        "options_id": [
            "Keras kepala / Susah dinasihati",
            "Penurut / Mudah diatur",
            "Lemah lembut / Ramah",
            "Pemaaf / Murah hati"
        ],
        "correctIndex": 0,
        "example": "He is too stubborn to listen to any advice from his doctor.",
        "example_id": "Dia terlalu keras kepala untuk mendengarkan nasihat apa pun dari dokternya.",
        "notes": "Adjective. Sinonim: obstinate, unyielding, headstrong."
    },
    {
        "id": "vocab_17",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Emosi Kemarahan",
        "level": "Elementary",
        "word": "Furious",
        "emoji": "😡",
        "en": "Furious",
        "target": "Furious",
        "phonetic": "/ˈfjʊə.ri.əs/",
        "id_translation": "Sangat marah / Murka",
        "options_id": [
            "Sangat marah / Murka",
            "Sedikit kecewa / Sedih",
            "Tenang / Kalem",
            "Gembira / Senang"
        ],
        "correctIndex": 0,
        "example": "The manager was furious when the crucial client presentation was ruined.",
        "example_id": "Manajer itu sangat murka ketika presentasi penting untuk klien hancur.",
        "notes": "Adjective. Tingkatan marah yang ekstrem melebihi kata 'angry'. Sinonim: enraged, irate, livid."
    },
    {
        "id": "vocab_18",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Sifat Benda",
        "level": "Elementary",
        "word": "Fragile",
        "emoji": "📦",
        "en": "Fragile",
        "target": "Fragile",
        "phonetic": "/ˈfrædʒ.aɪl/",
        "id_translation": "Rapuh / Mudah pecah",
        "options_id": [
            "Rapuh / Mudah pecah",
            "Kuat / Kokoh tahan banting",
            "Fleksibel / Lentur",
            "Tajam / Runcing"
        ],
        "correctIndex": 0,
        "example": "Handle this package carefully because it contains fragile glass ornaments.",
        "example_id": "Pegang paket ini dengan hati-hati karena berisi hiasan kaca yang mudah pecah.",
        "notes": "Adjective. Sering dicetak pada paket barang ekspedisi. Sinonim: delicate, brittle."
    },
    {
        "id": "vocab_19",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Sikap Diri",
        "level": "Elementary",
        "word": "Confident",
        "emoji": "😎",
        "en": "Confident",
        "target": "Confident",
        "phonetic": "/ˈkɒn.fɪ.dənt/",
        "id_translation": "Percaya diri / Yakin",
        "options_id": [
            "Percaya diri / Yakin",
            "Ragu-ragu / Bimbang",
            "Minder / Rendah diri",
            "Pesimis / Berputus asa"
        ],
        "correctIndex": 0,
        "example": "She walked onto the stage looking calm and confident.",
        "example_id": "Dia melangkah ke atas panggung dengan tampak tenang dan percaya diri.",
        "notes": "Adjective. Keyakinan penuh pada kemampuan sendiri. Sinonim: self-assured, certain."
    },
    {
        "id": "vocab_20",
        "mode": "vocabulary",
        "category": "Kosakata Menengah • Kegelisahan",
        "level": "Elementary",
        "word": "Anxious",
        "emoji": "😰",
        "en": "Anxious",
        "target": "Anxious",
        "phonetic": "/ˈæŋk.ʃəs/",
        "id_translation": "Cemas / Gelisah",
        "options_id": [
            "Cemas / Gelisah",
            "Tenang / Santai",
            "Berani / Tangguh",
            "Percaya diri / Yakin"
        ],
        "correctIndex": 0,
        "example": "Parents often feel anxious when their children start driving on their own.",
        "example_id": "Orang tua sering merasa cemas ketika anak-anak mereka mulai menyetir sendiri.",
        "notes": "Adjective. Rasa khawatir terhadap masa depan atau ketidakpastian. Sinonim: worried, apprehensive, uneasy."
    },
    {
        "id": "vocab_21",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Kehadiran",
        "level": "Intermediate",
        "word": "Ubiquitous",
        "emoji": "🌐",
        "en": "Ubiquitous",
        "target": "Ubiquitous",
        "phonetic": "/juːˈbɪk.wɪ.təs/",
        "id_translation": "Ada di mana-mana / Hadir serentak",
        "options_id": [
            "Ada di mana-mana / Hadir serentak",
            "Sangat langka / Jarang ditemui",
            "Terpencil / Terasing",
            "Ketinggalan zaman / Usang"
        ],
        "correctIndex": 0,
        "example": "Smartphones and wireless internet have become ubiquitous in metropolitan cities.",
        "example_id": "Ponsel pintar dan internet nirkabel telah ada di mana-mana di kota-kota metropolitan.",
        "notes": "Adjective. Formal. Sinonim: omnipresent, pervasive, widespread."
    },
    {
        "id": "vocab_22",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Pola Pikir",
        "level": "Intermediate",
        "word": "Pragmatic",
        "emoji": "💡",
        "en": "Pragmatic",
        "target": "Pragmatic",
        "phonetic": "/præɡˈmæt.ɪk/",
        "id_translation": "Praktis / Berorientasi hasil nyata",
        "options_id": [
            "Praktis / Berorientasi hasil nyata",
            "Hanya teori / Berkhayal",
            "Emosional / Baperan",
            "Keras kepala / Fanatik"
        ],
        "correctIndex": 0,
        "example": "We need a pragmatic solution rather than endless theoretical debates.",
        "example_id": "Kita membutuhkan solusi praktis daripada perdebatan teori yang tak ada habisnya.",
        "notes": "Adjective. Menekankan apa yang benar-benar berhasil di lapangan. Sinonim: practical, realistic, sensible."
    },
    {
        "id": "vocab_23",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Ketangguhan",
        "level": "Intermediate",
        "word": "Resilient",
        "emoji": "🛡️",
        "en": "Resilient",
        "target": "Resilient",
        "phonetic": "/rɪˈzɪl.jənt/",
        "id_translation": "Tangguh / Cepat bangkit dari kesulitan",
        "options_id": [
            "Tangguh / Cepat bangkit dari kesulitan",
            "Cengeng / Mudah putus asa",
            "Rapuh / Gampang hancur",
            "Pasif / Berpangku tangan"
        ],
        "correctIndex": 0,
        "example": "The local community remained resilient and rebuilt their village after the flood.",
        "example_id": "Masyarakat setempat tetap tangguh dan membangun kembali desa mereka pasca banjir.",
        "notes": "Adjective. Kemampuan pulih cepat dari keterpurukan atau krisis. Sinonim: tough, durable, adaptable."
    },
    {
        "id": "vocab_24",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Ketelitian",
        "level": "Intermediate",
        "word": "Meticulous",
        "emoji": "🔍",
        "en": "Meticulous",
        "target": "Meticulous",
        "phonetic": "/məˈtɪk.jə.ləs/",
        "id_translation": "Sangat teliti / Cermat hingga detail kecil",
        "options_id": [
            "Sangat teliti / Cermat hingga detail kecil",
            "Ceroboh / Asal-asalan",
            "Terburu-buru / Grusa-grusu",
            "Acuh tak acuh / Malas"
        ],
        "correctIndex": 0,
        "example": "The software architect was meticulous about writing clean, self-documenting code.",
        "example_id": "Arsitek perangkat lunak itu sangat teliti dalam menulis kode yang rapi dan terdokumentasi mandiri.",
        "notes": "Adjective. Memperhatikan setiap detail dengan saksama. Sinonim: painstaking, thorough, scrupulous."
    },
    {
        "id": "vocab_25",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Kepastian",
        "level": "Intermediate",
        "word": "Inevitable",
        "emoji": "⏳",
        "en": "Inevitable",
        "target": "Inevitable",
        "phonetic": "/ɪnˈev.ɪ.tə.bəl/",
        "id_translation": "Tak terelakkan / Pasti terjadi",
        "options_id": [
            "Tak terelakkan / Pasti terjadi",
            "Mustahil terjadi / Khayalan",
            "Bisa dihindari / Opsional",
            "Meragukan / Belum tentu"
        ],
        "correctIndex": 0,
        "example": "Change is an inevitable part of career development and life growth.",
        "example_id": "Perubahan adalah bagian yang tak terelakkan dari perkembangan karier dan pertumbuhan hidup.",
        "notes": "Adjective. Sesuatu yang mustahil untuk dicegah atau dihindari. Sinonim: unavoidable, inescapable, bound to happen."
    },
    {
        "id": "vocab_26",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Kepedulian",
        "level": "Intermediate",
        "word": "Compassionate",
        "emoji": "💖",
        "en": "Compassionate",
        "target": "Compassionate",
        "phonetic": "/kəmˈpæʃ.ən.ət/",
        "id_translation": "Penuh kasih sayang / Berempati tinggi",
        "options_id": [
            "Penuh kasih sayang / Berempati tinggi",
            "Kejam / Tidak berperikemanusiaan",
            "Dingin / Tidak peduli",
            "Sinits / Meremehkan"
        ],
        "correctIndex": 0,
        "example": "Nurses are admired for their compassionate care toward suffering patients.",
        "example_id": "Para perawat dikagumi karena perawatan mereka yang penuh kasih sayang terhadap pasien yang menderita.",
        "notes": "Adjective. Merasakan penderitaan orang lain dan tergerak menolong. Sinonim: empathetic, caring, humane."
    },
    {
        "id": "vocab_27",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Kemampuan Serba Bisa",
        "level": "Intermediate",
        "word": "Versatile",
        "emoji": "🧰",
        "en": "Versatile",
        "target": "Versatile",
        "phonetic": "/ˈvɜː.sə.taɪl/",
        "id_translation": "Serbaguna / Memiliki banyak kemampuan",
        "options_id": [
            "Serbaguna / Memiliki banyak kemampuan",
            "Terbatas / Hanya untuk satu tujuan",
            "Kaku / Sulit beradaptasi",
            "Lemah / Tidak berfungsi"
        ],
        "correctIndex": 0,
        "example": "Eggs are one of the most versatile ingredients in international cooking.",
        "example_id": "Telur adalah salah satu bahan masakan paling serbaguna dalam dunia kuliner internasional.",
        "notes": "Adjective. Mampu beradaptasi atau digunakan untuk berbagai keperluan. Sinonim: adaptable, multifunctional, all-around."
    },
    {
        "id": "vocab_28",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Logika & Alasan",
        "level": "Intermediate",
        "word": "Plausible",
        "emoji": "🤔",
        "en": "Plausible",
        "target": "Plausible",
        "phonetic": "/ˈplɔː.zə.bəl/",
        "id_translation": "Masuk akal / Masih memungkinkan",
        "options_id": [
            "Masuk akal / Masih memungkinkan",
            "Mustahil / Mengada-ada",
            "Palsu / Rekayasa",
            "Berbahaya / Mengancam"
        ],
        "correctIndex": 0,
        "example": "His explanation for being late sounded plausible given the storm outside.",
        "example_id": "Penjelasannya mengapa terlambat terdengar masuk akal mengingat badai di luar sana.",
        "notes": "Adjective. Pernyataan yang tampaknya benar dan dapat diterima akal sehat. Sinonim: reasonable, believable, credible."
    },
    {
        "id": "vocab_29",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Kerentanan",
        "level": "Intermediate",
        "word": "Vulnerable",
        "emoji": "🩹",
        "en": "Vulnerable",
        "target": "Vulnerable",
        "phonetic": "/ˈvʌl.nər.ə.bəl/",
        "id_translation": "Rentan / Mudah diserang atau terluka",
        "options_id": [
            "Rentan / Mudah diserang atau terluka",
            "Kebal / Aman terlindungi",
            "Kuat / Tak tertandingi",
            "Berani / Pantang menyerah"
        ],
        "correctIndex": 0,
        "example": "Without antivirus protection, your laptop is vulnerable to malware attacks.",
        "example_id": "Tanpa perlindungan antivirus, laptop Anda rentan terhadap serangan malware.",
        "notes": "Adjective. Dalam posisi yang mudah terkena bahaya fisik atau emosional. Sinonim: defenseless, exposed, susceptible."
    },
    {
        "id": "vocab_30",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Lanjut • Kejernihan Makna",
        "level": "Intermediate",
        "word": "Ambiguous",
        "emoji": "🌫️",
        "en": "Ambiguous",
        "target": "Ambiguous",
        "phonetic": "/æmˈbɪɡ.ju.əs/",
        "id_translation": "Bermakna ganda / Tidak jelas",
        "options_id": [
            "Bermakna ganda / Tidak jelas",
            "Tegas / Sangat gamblang",
            "Pasti / Tidak diragukan",
            "Sederhana / Mudah dipahami"
        ],
        "correctIndex": 0,
        "example": "The contract clause was ambiguous, causing disagreement between both partners.",
        "example_id": "Klausul kontrak tersebut bermakna ganda sehingga memicu perselisihan di antara kedua mitra.",
        "notes": "Adjective. Memiliki lebih dari satu kemungkinan tafsir. Sinonim: unclear, vague, equivocal."
    },
    {
        "id": "vocab_31",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Waktu & Eksistensi",
        "level": "Advanced",
        "word": "Ephemeral",
        "emoji": "🌸",
        "en": "Ephemeral",
        "target": "Ephemeral",
        "phonetic": "/ɪˈfem.ər.əl/",
        "id_translation": "Bersifat sementara / Cepat berlalu",
        "options_id": [
            "Bersifat sementara / Cepat berlalu",
            "Abadi / Kekal selamanya",
            "Berulang-ulang / Terus-menerus",
            "Pasti / Tak tergoyahkan"
        ],
        "correctIndex": 0,
        "example": "The cherry blossoms in spring offer a breathtaking but ephemeral beauty.",
        "example_id": "Bunga sakura di musim semi menghadirkan keindahan yang memukau namun hanya bersifat sementara.",
        "notes": "Adjective. Berlangsung hanya dalam waktu yang sangat singkat. Sinonim: transient, fleeting, short-lived."
    },
    {
        "id": "vocab_32",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Keberuntungan",
        "level": "Advanced",
        "word": "Serendipity",
        "emoji": "🍀",
        "en": "Serendipity",
        "target": "Serendipity",
        "phonetic": "/ˌser.ənˈdɪp.ə.ti/",
        "id_translation": "Keberuntungan atau berkah tak terduga",
        "options_id": [
            "Keberuntungan atau berkah tak terduga",
            "Nasib buruk / Kesialan bertubi-tubi",
            "Kerja keras yang direncanakan",
            "Kecelakaan yang disengaja"
        ],
        "correctIndex": 0,
        "example": "Finding my dream mentor at a random coffee shop was pure serendipity.",
        "example_id": "Menemukan mentor impian saya di kedai kopi yang acak adalah murni keberuntungan tak terduga.",
        "notes": "Noun. Menemukan hal-hal baik atau berharga secara kebetulan saat tidak mencarinya. Sinonim: happy chance, fluke, blessing."
    },
    {
        "id": "vocab_33",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Retorika & Komunikasi",
        "level": "Advanced",
        "word": "Eloquent",
        "emoji": "🗣️",
        "en": "Eloquent",
        "target": "Eloquent",
        "phonetic": "/ˈel.ə.kwənt/",
        "id_translation": "Fasih berbicara / Pandai merangkai kata",
        "options_id": [
            "Fasih berbicara / Pandai merangkai kata",
            "Gagap / Terbata-bata",
            "Bisu / Tidak bisa berkata-kata",
            "Kasar / Asal bicara"
        ],
        "correctIndex": 0,
        "example": "The diplomat delivered an eloquent speech that moved the entire assembly.",
        "example_id": "Diplomat itu menyampaikan pidato yang sangat fasih dan menyentuh seluruh hadirin sidang.",
        "notes": "Adjective. Mampu mengungkapkan gagasan secara fasih, persuasif, dan elegan. Sinonim: articulate, silver-tongued, expressive."
    },
    {
        "id": "vocab_34",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Kegigihan",
        "level": "Advanced",
        "word": "Tenacious",
        "emoji": "🧗",
        "en": "Tenacious",
        "target": "Tenacious",
        "phonetic": "/təˈneɪ.ʃəs/",
        "id_translation": "Gigih pantang menyerah / Sangat ulet",
        "options_id": [
            "Gigih pantang menyerah / Sangat ulet",
            "Gampang patah arang / Lemah tekad",
            "Malas / Berleha-leha",
            "Ceroboh / Suka menunda"
        ],
        "correctIndex": 0,
        "example": "Her tenacious determination allowed her to overcome every academic hurdle.",
        "example_id": "Kegigihannya yang pantang menyerah memungkinkannya mengatasi setiap rintangan akademis.",
        "notes": "Adjective. Mempertahankan tujuan dengan tekad baja. Sinonim: persistent, resolute, unshakeable."
    },
    {
        "id": "vocab_35",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Standar Kesempurnaan",
        "level": "Advanced",
        "word": "Fastidious",
        "emoji": "🧐",
        "en": "Fastidious",
        "target": "Fastidious",
        "phonetic": "/fæsˈtɪd.i.əs/",
        "id_translation": "Sangat pemilih / Menuntut kesempurnaan",
        "options_id": [
            "Sangat pemilih / Menuntut kesempurnaan",
            "Gampangan / Asal beres",
            "Ceroboh / Berantakan",
            "Murah senyum / Ramah"
        ],
        "correctIndex": 0,
        "example": "He was fastidious about personal hygiene and keeping his desk spotless.",
        "example_id": "Dia sangat pemilih tentang kebersihan pribadi dan menjaga mejanya tanpa noda sedikit pun.",
        "notes": "Adjective. Sangat teliti dan sulit dipuaskan karena standar yang sangat tinggi. Sinonim: fussy, perfectionist, choosy."
    },
    {
        "id": "vocab_36",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Kerahasiaan",
        "level": "Advanced",
        "word": "Surreptitious",
        "emoji": "🕵️",
        "en": "Surreptitious",
        "target": "Surreptitious",
        "phonetic": "/ˌsʌr.əpˈtɪʃ.əs/",
        "id_translation": "Diam-diam / Dilakukan secara rahasia",
        "options_id": [
            "Diam-diam / Dilakukan secara rahasia",
            "Terbuka / Terang-terangan",
            "Resmi / Sah menurut hukum",
            "Terkenal / Diketahui khalayak"
        ],
        "correctIndex": 0,
        "example": "She cast a surreptitious glance at her phone during the formal meeting.",
        "example_id": "Dia melirik ponselnya secara diam-diam selama pertemuan formal tersebut.",
        "notes": "Adjective. Dilakukan sembunyi-sembunyi agar tidak ketahuan orang lain. Sinonim: secretive, sneaky, stealthy."
    },
    {
        "id": "vocab_37",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Kebijaksanaan",
        "level": "Advanced",
        "word": "Magnanimous",
        "emoji": "👑",
        "en": "Magnanimous",
        "target": "Magnanimous",
        "phonetic": "/mæɡˈnæn.ɪ.məs/",
        "id_translation": "Berjiwa besar / Murah hati kepada lawan",
        "options_id": [
            "Berjiwa besar / Murah hati kepada lawan",
            "Pendendam / Suka membalas",
            "Sombong / Arogan setelah menang",
            "Kikir / Pelit"
        ],
        "correctIndex": 0,
        "example": "The champion was magnanimous in victory, praising the opponent's courageous effort.",
        "example_id": "Sang juara bersikap berjiwa besar dalam kemenangannya, memuji perjuangan berani dari lawannya.",
        "notes": "Adjective. Memaafkan dan menghormati lawan, terutama setelah menang. Sinonim: noble-minded, forgiving, big-hearted."
    },
    {
        "id": "vocab_38",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Tekad",
        "level": "Advanced",
        "word": "Perseverance",
        "emoji": "🏔️",
        "en": "Perseverance",
        "target": "Perseverance",
        "phonetic": "/ˌpɜː.sɪˈvɪə.rəns/",
        "id_translation": "Kegigihan / Daya tahan menghadapi rintangan",
        "options_id": [
            "Kegigihan / Daya tahan menghadapi rintangan",
            "Kemalasan / Kepasrahan",
            "Kelemahan fisik",
            "Kecurangan dalam bersaing"
        ],
        "correctIndex": 0,
        "example": "Through patience and perseverance, she successfully completed her doctoral thesis.",
        "example_id": "Melalui kesabaran dan kegigihan, dia berhasil menyelesaikan tesis doktoralnya.",
        "notes": "Noun. Terus berjuang tanpa menyerah meskipun mengalami kegagalan berulang. Sinonim: persistence, endurance, grit."
    },
    {
        "id": "vocab_39",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Kebajikan",
        "level": "Advanced",
        "word": "Benevolent",
        "emoji": "🕊️",
        "en": "Benevolent",
        "target": "Benevolent",
        "phonetic": "/bəˈnev.əl.ənt/",
        "id_translation": "Berhati mulia / Penuh kebajikan",
        "options_id": [
            "Berhati mulia / Penuh kebajikan",
            "Jahat / Beritikad buruk",
            "Serakah / Haus kekuasaan",
            "Kasar / Galak"
        ],
        "correctIndex": 0,
        "example": "A benevolent leader focuses on the welfare and happiness of the citizens.",
        "example_id": "Pemimpin yang berhati mulia berfokus pada kesejahteraan dan kebahagiaan warganya.",
        "notes": "Adjective. Niat tulus untuk berbuat baik kepada sesama manusia. Sinonim: kind-hearted, charitable, well-meaning."
    },
    {
        "id": "vocab_40",
        "mode": "vocabulary",
        "category": "Kosakata Tingkat Mahir • Keberanian Ekstrem",
        "level": "Advanced",
        "word": "Audacious",
        "emoji": "🦅",
        "en": "Audacious",
        "target": "Audacious",
        "phonetic": "/ɔːˈdeɪ.ʃəs/",
        "id_translation": "Sangat berani / Nekat mengambil risiko besar",
        "options_id": [
            "Sangat berani / Nekat mengambil risiko besar",
            "Penakut / Pengecut",
            "Pasif / Menunggu giliran",
            "Ragu-ragu / Bingung"
        ],
        "correctIndex": 0,
        "example": "Launching a rocket to Mars was an audacious dream that inspired humanity.",
        "example_id": "Meluncurkan roket ke planet Mars adalah mimpi yang sangat berani yang menginspirasi umat manusia.",
        "notes": "Adjective. Keberanian luar biasa yang mendobrak batas wajar. Sinonim: bold, daring, fearless."
    }
],

  "grammar": [
    {
      "id": "gm_01",
      "mode": "grammar",
      "category": "Raymond Murphy • Conditionals (Unit 38)",
      "level": "Intermediate",
      "en": "If I had known about the traffic, I would have left earlier.",
      "target": "If I had known about the traffic, I would have left earlier.",
      "missingWord": "had known",
      "prompt_en": "Murphy Grammar: \"If I ________ (know) about the traffic, I would have left earlier.\"",
      "prompt_id": "Murphy Grammar: \"Seandainya saya tahu (________) tentang macet itu, saya pasti berangkat lebih awal.\"",
      "options": [
        "had known",
        "knew",
        "have known",
        "know"
      ],
      "correctIndex": 0,
      "phonetic": "/ɪf aɪ hæd nəʊn əˈbaʊt ðə ˈtræf.ɪk/",
      "id_translation": "Seandainya saya tahu soal kemacetan itu, saya pasti sudah berangkat lebih awal.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Seandainya saya tahu soal kemacetan itu, saya pasti sudah berangkat lebih awal.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"If I had known about the traffic, I would have left earlier.\"",
      "notes": "Third Conditional untuk penyesalan masa lampau: If + past perfect, would have + V3."
    },
    {
      "id": "gm_02",
      "mode": "grammar",
      "category": "Raymond Murphy • Present Perfect vs Past (Unit 7)",
      "level": "Beginner",
      "en": "She has lived in London for five years, and she still loves it there.",
      "target": "She has lived in London for five years, and she still loves it there.",
      "missingWord": "has lived",
      "prompt_en": "Murphy Grammar: \"She ________ (live) in London for five years, and she still loves it there.\"",
      "prompt_id": "Murphy Grammar: \"Dia telah tinggal (________) di London selama lima tahun, dan masih menyukainya.\"",
      "options": [
        "has lived",
        "lived",
        "is living",
        "lives"
      ],
      "correctIndex": 0,
      "phonetic": "/ʃiː hæz lɪvd ɪn ˈlʌn.dən fɔː faɪv jɪəz/",
      "id_translation": "Dia telah tinggal di London selama lima tahun (dan masih menetap di sana hingga kini).",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Dia telah tinggal di London selama lima tahun, dan dia masih menyukainya di sana.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"She has lived in London for five years, and she still loves it there.\"",
      "notes": "Present Perfect digunakan karena aksinya dimulai di masa lalu dan masih berlanjut."
    },
    {
      "id": "gm_03",
      "mode": "grammar",
      "category": "Raymond Murphy • First Conditional (Unit 37)",
      "level": "Beginner",
      "en": "If it rains tomorrow, we will cancel the outdoor picnic.",
      "target": "If it rains tomorrow, we will cancel the outdoor picnic.",
      "missingWord": "will cancel",
      "prompt_en": "Murphy Grammar: \"If it rains tomorrow, we ________ (cancel) the outdoor picnic.\"",
      "prompt_id": "Murphy Grammar: \"Jika besok hujan, kami akan membatalkan (________) piknik luar ruangan.\"",
      "options": [
        "will cancel",
        "would cancel",
        "cancelled",
        "cancel"
      ],
      "correctIndex": 0,
      "phonetic": "/ɪf ɪt reɪnz təˈmɒr.əʊ wiː wɪl ˈkæn.səl/",
      "id_translation": "Jika besok hujan, kita akan membatalkan piknik di luar ruangan.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Jika besok hujan, kita akan membatalkan piknik di luar ruangan.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"If it rains tomorrow, we will cancel the outdoor picnic.\"",
      "notes": "First Conditional untuk kemungkinan masa depan yang nyata: If + Present Simple, will + V1."
    },
    {
      "id": "gm_04",
      "mode": "grammar",
      "category": "Raymond Murphy • Second Conditional (Unit 38)",
      "level": "Intermediate",
      "en": "If I had a million dollars, I would travel around the world.",
      "target": "If I had a million dollars, I would travel around the world.",
      "missingWord": "would travel",
      "prompt_en": "Murphy Grammar: \"If I had a million dollars, I ________ (travel) around the world.\"",
      "prompt_id": "Murphy Grammar: \"Seandainya saya punya satu juta dolar, saya pasti akan bepergian (________) keliling dunia.\"",
      "options": [
        "would travel",
        "will travel",
        "travelled",
        "have travelled"
      ],
      "correctIndex": 0,
      "phonetic": "/ɪf aɪ hæd ə ˈmɪl.jən ˈdɒl.əz aɪ wʊd ˈtræv.əl/",
      "id_translation": "Seandainya saya memiliki satu juta dolar, saya akan berkeliling dunia.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Seandainya saya memiliki satu juta dolar, saya akan berkeliling dunia.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"If I had a million dollars, I would travel around the world.\"",
      "notes": "Second Conditional untuk situasi imajinatif masa sekarang: If + Past Simple, would + V1."
    },
    {
      "id": "gm_05",
      "mode": "grammar",
      "category": "Raymond Murphy • Modal Perfects (Unit 33)",
      "level": "Intermediate",
      "en": "You should have informed me about the delay beforehand.",
      "target": "You should have informed me about the delay beforehand.",
      "missingWord": "should have informed",
      "prompt_en": "Murphy Grammar: \"You ________ (inform) me about the delay beforehand.\"",
      "prompt_id": "Murphy Grammar: \"Seharusnya kamu memberitahuku (________) tentang penundaan itu sebelumnya.\"",
      "options": [
        "should have informed",
        "should inform",
        "must inform",
        "could inform"
      ],
      "correctIndex": 0,
      "phonetic": "/juː ʃʊd hæv ɪnˈfɔːmd miː əˈbaʊt ðə dɪˈleɪ/",
      "id_translation": "Seharusnya Anda memberi tahu saya tentang penundaan tersebut sebelumnya.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Seharusnya Anda memberi tahu saya tentang penundaan tersebut sebelumnya.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"You should have informed me about the delay beforehand.\"",
      "notes": "\"Should have + V3\" digunakan untuk menyatakan kritik atau penyesalan atas peristiwa masa lalu."
    },
    {
      "id": "gm_06",
      "mode": "grammar",
      "category": "Raymond Murphy • Passive Voice (Unit 42)",
      "level": "Advanced",
      "en": "The bridge was built in nineteen eighty-five by local engineers.",
      "target": "The bridge was built in nineteen eighty-five by local engineers.",
      "missingWord": "was built",
      "prompt_en": "Murphy Grammar: \"The bridge ________ (build) in nineteen eighty-five by local engineers.\"",
      "prompt_id": "Murphy Grammar: \"Jembatan itu dibangun (________) pada tahun 1985 oleh para insinyur lokal.\"",
      "options": [
        "was built",
        "is built",
        "built",
        "has built"
      ],
      "correctIndex": 0,
      "phonetic": "/ðə brɪdʒ wɒz bɪlt ɪn ˌnaɪnˈtiːn ˈeɪ.ti faɪv/",
      "id_translation": "Jembatan itu dibangun pada tahun 1985 oleh insinyur-insinyur lokal.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Jembatan itu dibangun pada tahun 1985 oleh insinyur-insinyur lokal.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The bridge was built in nineteen eighty-five by local engineers.\"",
      "notes": "Past Passive: was/were + V3 (Past Participle)."
    },
    {
      "id": "gm_07",
      "mode": "grammar",
      "category": "Raymond Murphy • Present Perfect Continuous (Unit 9)",
      "level": "Intermediate",
      "en": "He has been studying English since eight o’clock this morning.",
      "target": "He has been studying English since eight o’clock this morning.",
      "missingWord": "has been studying",
      "prompt_en": "Murphy Grammar: \"He ________ (study) English since eight o’clock this morning.\"",
      "prompt_id": "Murphy Grammar: \"Dia telah terus belajar (________) Bahasa Inggris sejak pukul delapan pagi ini.\"",
      "options": [
        "has been studying",
        "is studying",
        "studied",
        "studies"
      ],
      "correctIndex": 0,
      "phonetic": "/hiː hæz biːn ˈstʌd.i.ɪŋ ˈɪŋ.ɡlɪʃ sɪns eɪt əˈklɒk/",
      "id_translation": "Dia sudah terus belajar Bahasa Inggris sejak pukul delapan pagi ini.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Dia sudah terus belajar Bahasa Inggris sejak pukul delapan pagi ini.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"He has been studying English since eight o’clock this morning.\"",
      "notes": "Present Perfect Continuous menekankan durasi aksi yang masih berlangsung: has/have been + V-ing."
    },
    {
      "id": "gm_08",
      "mode": "grammar",
      "category": "Raymond Murphy • Used to (Unit 18)",
      "level": "Beginner",
      "en": "I used to play tennis every weekend when I was in high school.",
      "target": "I used to play tennis every weekend when I was in high school.",
      "missingWord": "used to play",
      "prompt_en": "Murphy Grammar: \"I ________ (play) tennis every weekend when I was in high school.\"",
      "prompt_id": "Murphy Grammar: \"Saya dulu terbiasa bermain (________) tenis setiap akhir pekan waktu SMA.\"",
      "options": [
        "used to play",
        "am used to play",
        "use to play",
        "played to"
      ],
      "correctIndex": 0,
      "phonetic": "/aɪ ˈjuːst tuː pleɪ ˈten.ɪs ˈev.ri ˌwiːkˈend/",
      "id_translation": "Saya dulu biasa bermain tenis setiap akhir pekan saat masih di sekolah menengah.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Saya dulu biasa bermain tenis setiap akhir pekan saat masih di sekolah menengah.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"I used to play tennis every weekend when I was in high school.\"",
      "notes": "\"Used to + V1\" untuk kebiasaan masa lalu yang sekarang sudah tidak dilakukan lagi."
    },
    {
      "id": "gm_09",
      "mode": "grammar",
      "category": "Raymond Murphy • Wishes & Regrets (Unit 39)",
      "level": "Intermediate",
      "en": "I wish I could speak fluent Japanese like my brother.",
      "target": "I wish I could speak fluent Japanese like my brother.",
      "missingWord": "could speak",
      "prompt_en": "Murphy Grammar: \"I wish I ________ (can / speak) fluent Japanese like my brother.\"",
      "prompt_id": "Murphy Grammar: \"Saya berharap saya bisa berbicara (________) Bahasa Jepang fasih seperti kakak saya.\"",
      "options": [
        "could speak",
        "can speak",
        "spoke able",
        "will speak"
      ],
      "correctIndex": 0,
      "phonetic": "/aɪ wɪʃ aɪ kʊd spiːk ˈfluː.ənt ˌdʒæp.ənˈiːz/",
      "id_translation": "Saya berharap saya bisa berbicara Bahasa Jepang dengan fasih seperti saudara saya.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Saya berharap saya bisa berbicara Bahasa Jepang dengan fasih seperti saudara saya.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"I wish I could speak fluent Japanese like my brother.\"",
      "notes": "Setelah \"wish\" untuk kemampuan masa sekarang, gunakan \"could + V1\"."
    },
    {
      "id": "gm_10",
      "mode": "grammar",
      "category": "Advanced Grammar • Inversion",
      "level": "Advanced",
      "en": "Hardly had the meeting started when the fire alarm rang.",
      "target": "Hardly had the meeting started when the fire alarm rang.",
      "missingWord": "had the meeting started",
      "prompt_en": "Advanced Inversion: \"Hardly ________ (the meeting / start) when the fire alarm rang.\"",
      "prompt_id": "Inversi Tata Bahasa: \"Baru saja rapat dimulai (Hardly ________), alarm kebakaran langsung berbunyi.\"",
      "options": [
        "had the meeting started",
        "the meeting had started",
        "started the meeting",
        "did the meeting start"
      ],
      "correctIndex": 0,
      "phonetic": "/ˈhɑːd.li hæd ðə ˈmiː.tɪŋ ˈstɑː.tɪd wen ðə ˈfaɪər əˈlɑːm ræŋ/",
      "id_translation": "Baru saja rapat dimulai, alarm kebakaran langsung berbunyi kencang.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Baru saja rapat dimulai, alarm kebakaran langsung berbunyi.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Hardly had the meeting started when the fire alarm rang.\"",
      "notes": "Inversion setelah kata negatif/restriktif di awal kalimat: Hardly + had + S + V3... when..."
    },
    {
      "id": "gm_11",
      "mode": "grammar",
      "category": "Raymond Murphy • Causative (Unit 46)",
      "level": "Intermediate",
      "en": "I need to have my car repaired before our road trip.",
      "target": "I need to have my car repaired before our road trip.",
      "missingWord": "have my car repaired",
      "prompt_en": "Murphy Grammar: \"I need to ________ (repair / my car) before our road trip.\"",
      "prompt_id": "Murphy Grammar: \"Saya harus menyuruh mobil saya diperbaiki (________) sebelum perjalanan kita.\"",
      "options": [
        "have my car repaired",
        "have my car repair",
        "repair my car myself",
        "got my car repair"
      ],
      "correctIndex": 0,
      "phonetic": "/aɪ niːd tuː hæv maɪ kɑː rɪˈpeəd bɪˈfɔːr ˈaʊər rəʊd trɪp/",
      "id_translation": "Saya perlu membawa mobil saya ke bengkel untuk diperbaiki sebelum perjalanan darat kita.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Saya perlu memeriksakan mobil saya agar diperbaiki sebelum perjalanan darat kita.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"I need to have my car repaired before our road trip.\"",
      "notes": "Causative structure: have/get + something + V3 (Past Participle)."
    },
    {
      "id": "gm_12",
      "mode": "grammar",
      "category": "Raymond Murphy • Past Continuous vs Simple (Unit 6)",
      "level": "Beginner",
      "en": "While I was cooking dinner, the phone rang suddenly.",
      "target": "While I was cooking dinner, the phone rang suddenly.",
      "missingWord": "was cooking",
      "prompt_en": "Murphy Grammar: \"While I ________ (cook) dinner, the phone rang suddenly.\"",
      "prompt_id": "Murphy Grammar: \"Ketika saya sedang memasak (________) makan malam, telepon berdering tiba-tiba.\"",
      "options": [
        "was cooking",
        "cooked",
        "have cooked",
        "am cooking"
      ],
      "correctIndex": 0,
      "phonetic": "/waɪl aɪ wɒz ˈkʊk.ɪŋ ˈdɪn.ər ðə fəʊn ræŋ ˈsʌd.ən.li/",
      "id_translation": "Saat saya sedang memasak makan malam, telepon tiba-tiba berdering.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Saat saya sedang memasak makan malam, telepon tiba-tiba berdering.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"While I was cooking dinner, the phone rang suddenly.\"",
      "notes": "Past Continuous (was cooking) terinterupsi oleh aksi Past Simple (rang)."
    },
    {
      "id": "gm_13",
      "mode": "grammar",
      "category": "Raymond Murphy • Relative Clauses (Unit 92)",
      "level": "Intermediate",
      "en": "The woman who lives next door is an architect.",
      "target": "The woman who lives next door is an architect.",
      "missingWord": "who",
      "prompt_en": "Murphy Grammar: \"The woman ________ lives next door is an architect.\"",
      "prompt_id": "Murphy Grammar: \"Wanita yang (________) tinggal di sebelah rumah adalah seorang arsitek.\"",
      "options": [
        "who",
        "which",
        "whom",
        "whose"
      ],
      "correctIndex": 0,
      "phonetic": "/ðə ˈwʊm.ən huː lɪvz nekst dɔːr ɪz ən ˈɑː.kɪ.tekt/",
      "id_translation": "Wanita yang tinggal di sebelah rumah saya adalah seorang arsitek.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Wanita yang tinggal di sebelah rumah saya adalah seorang arsitek.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The woman who lives next door is an architect.\"",
      "notes": "\"Who\" merujuk pada subjek orang (person), sedangkan \"which\" untuk benda/binatang."
    },
    {
      "id": "gm_14",
      "mode": "grammar",
      "category": "Raymond Murphy • Mixed Conditionals (Unit 40)",
      "level": "Advanced",
      "en": "If I had studied harder in college, I would be working in London now.",
      "target": "If I had studied harder in college, I would be working in London now.",
      "missingWord": "would be working",
      "prompt_en": "Mixed Conditional: \"If I had studied harder in college, I ________ (work) in London now.\"",
      "prompt_id": "Mixed Conditional: \"Seandainya saya belajar lebih giat waktu kuliah, saya pasti sedang bekerja (________) di London sekarang.\"",
      "options": [
        "would be working",
        "would have worked",
        "will work",
        "am working"
      ],
      "correctIndex": 0,
      "phonetic": "/ɪf aɪ hæd ˈstʌd.id ˈhɑː.dər ɪn ˈkɒl.ɪdʒ aɪ wʊd biː ˈwɜː.kɪŋ/",
      "id_translation": "Seandainya saya belajar lebih rajin waktu kuliah dulu, saya pasti sedang bekerja di London sekarang.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Seandainya saya belajar lebih rajin waktu kuliah dulu, saya pasti sedang bekerja di London sekarang.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"If I had studied harder in college, I would be working in London now.\"",
      "notes": "Mixed Conditional: Kondisi masa lalu (had studied) berakibat pada situasi masa kini (would be working now)."
    },
    {
      "id": "gm_15",
      "mode": "grammar",
      "category": "Raymond Murphy • Prepositions of Time (Unit 121)",
      "level": "Beginner",
      "en": "The concert begins at eight PM on Friday night.",
      "target": "The concert begins at eight PM on Friday night.",
      "missingWord": "at",
      "prompt_en": "Murphy Grammar: \"The concert begins ________ eight PM on Friday night.\"",
      "prompt_id": "Murphy Grammar: \"Konser dimulai pada (________) pukul delapan malam di hari Jumat.\"",
      "options": [
        "at",
        "in",
        "on",
        "by"
      ],
      "correctIndex": 0,
      "phonetic": "/ðə ˈkɒn.sət bɪˈɡɪnz æt eɪt piː em ɒn ˈfraɪ.deɪ naɪt/",
      "id_translation": "Konser dimulai pada pukul delapan malam pada hari Jumat.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Konser dimulai pada pukul delapan malam pada hari Jumat.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The concert begins at eight PM on Friday night.\"",
      "notes": "Gunakan preposisi \"at\" untuk jam/waktu tepat, dan \"on\" untuk hari/tanggal."
    },
    {
      "id": "gm_16",
      "mode": "grammar",
      "category": "Raymond Murphy • Contrast Clauses (Unit 113)",
      "level": "Intermediate",
      "en": "Despite the heavy rain, they continued the marathon.",
      "target": "Despite the heavy rain, they continued the marathon.",
      "missingWord": "Despite",
      "prompt_en": "Murphy Grammar: \"________ the heavy rain, they continued the marathon.\"",
      "prompt_id": "Murphy Grammar: \"Meskipun (________) hujan lebat, mereka tetap melanjutkan lari maraton.\"",
      "options": [
        "Despite",
        "Although",
        "Even though",
        "In spite"
      ],
      "correctIndex": 0,
      "phonetic": "/dɪˈspaɪt ðə ˈhev.i reɪn ðeɪ kənˈtɪn.juːd ðə ˈmær.ə.θən/",
      "id_translation": "Meskipun hujan turun dengan sangat lebat, mereka tetap melanjutkan lomba maraton.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Meskipun hujan turun dengan sangat lebat, mereka tetap melanjutkan lomba maraton.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"Despite the heavy rain, they continued the marathon.\"",
      "notes": "\"Despite\" diikuti kata benda (noun phrase), sedangkan \"Although\" harus diikuti klausa (S + V)."
    },
    {
      "id": "gm_17",
      "mode": "grammar",
      "category": "Advanced Grammar • Subjunctive",
      "level": "Advanced",
      "en": "The doctor recommended that he take a few days of complete rest.",
      "target": "The doctor recommended that he take a few days of complete rest.",
      "missingWord": "take",
      "prompt_en": "Subjunctive Mood: \"The doctor recommended that he ________ (take) a few days of rest.\"",
      "prompt_id": "Subjunctive Mood: \"Dokter menyarankan agar dia beristirahat (________) total selama beberapa hari.\"",
      "options": [
        "take",
        "takes",
        "took",
        "will take"
      ],
      "correctIndex": 0,
      "phonetic": "/ðə ˈdɒk.tər ˌrek.əˈmen.dɪd ðæt hiː teɪk ə fjuː deɪz/",
      "id_translation": "Dokter menyarankan agar dia beristirahat total selama beberapa hari.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Dokter menyarankan agar dia beristirahat total selama beberapa hari.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The doctor recommended that he take a few days of complete rest.\"",
      "notes": "Subjunctive setelah kata kerja saran (recommend, demand, suggest) menggunakan bentuk kata kerja dasar (\"take\", bukan \"takes\")."
    },
    {
      "id": "gm_18",
      "mode": "grammar",
      "category": "Raymond Murphy • Comparatives (Unit 105)",
      "level": "Beginner",
      "en": "This laptop is much faster than my previous computer.",
      "target": "This laptop is much faster than my previous computer.",
      "missingWord": "faster than",
      "prompt_en": "Murphy Grammar: \"This laptop is much ________ (fast) my previous computer.\"",
      "prompt_id": "Murphy Grammar: \"Laptop ini jauh lebih cepat daripada (________) komputer saya sebelumnya.\"",
      "options": [
        "faster than",
        "more fast than",
        "fast than",
        "fastest of"
      ],
      "correctIndex": 0,
      "phonetic": "/ðɪs ˈlæp.tɒp ɪz mʌtʃ ˈfɑː.stər ðæn maɪ ˈpriː.vi.əs kəmˈpjuː.tər/",
      "id_translation": "Laptop ini jauh lebih cepat daripada komputer saya yang sebelumnya.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Laptop ini jauh lebih cepat daripada komputer saya yang sebelumnya.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"This laptop is much faster than my previous computer.\"",
      "notes": "Gunakan \"much\" untuk memperkuat tingkat perbandingan komparatif (\"much faster than\")."
    },
    {
      "id": "gm_19",
      "mode": "grammar",
      "category": "Raymond Murphy • Reported Speech (Unit 47)",
      "level": "Intermediate",
      "en": "She told me that she had already seen that movie twice.",
      "target": "She told me that she had already seen that movie twice.",
      "missingWord": "had already seen",
      "prompt_en": "Reported Speech: \"She told me that she ________ (already / see) that movie twice.\"",
      "prompt_id": "Reported Speech: \"Dia memberitahuku bahwa dia sudah pernah menonton (________) film itu dua kali.\"",
      "options": [
        "had already seen",
        "has already seen",
        "already saw",
        "is already seeing"
      ],
      "correctIndex": 0,
      "phonetic": "/ʃiː təʊld miː ðæt ʃiː hæd ɔːlˈred.i siːn ðæt ˈmuː.vi twaɪs/",
      "id_translation": "Dia memberi tahu saya bahwa dia sudah menonton film itu dua kali sebelumnya.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Dia memberi tahu saya bahwa dia sudah menonton film itu dua kali sebelumnya.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"She told me that she had already seen that movie twice.\"",
      "notes": "Dalam Reported Speech, Present Perfect (\"has seen\") mundur menjadi Past Perfect (\"had seen\")."
    },
    {
      "id": "gm_20",
      "mode": "grammar",
      "category": "Advanced Grammar • Passive with Reporting (Unit 45)",
      "level": "Advanced",
      "en": "The company is rumored to be launching a new product next month.",
      "target": "The company is rumored to be launching a new product next month.",
      "missingWord": "is rumored to be",
      "prompt_en": "Passive Reporting: \"The company ________ (rumor) launching a new product next month.\"",
      "prompt_id": "Passive Reporting: \"Perusahaan itu dirumorkan sedang bersiap (________) meluncurkan produk baru bulan depan.\"",
      "options": [
        "is rumored to be",
        "rumors to be",
        "is rumored that",
        "has rumored to"
      ],
      "correctIndex": 0,
      "phonetic": "/ðə ˈkʌm.pə.ni ɪz ˈruː.məd tuː biː ˈlɔːn.tʃɪŋ ə njuː ˈprɒd.ʌkt/",
      "id_translation": "Perusahaan tersebut dirumorkan akan meluncurkan produk baru pada bulan depan.",
      "id_prompt": "Ucapkan dalam Bahasa Inggris: \"Perusahaan tersebut dirumorkan akan meluncurkan produk baru pada bulan depan.\"",
      "en_prompt": "Terjemahkan ke Bahasa Indonesia: \"The company is rumored to be launching a new product next month.\"",
      "notes": "Struktur pasif impersonal: Subject + is rumored/believed/thought + to be + V-ing."
    }
  ],
  "sentence_builder": [
    {
      "id": "sb_01",
      "mode": "sentence_builder",
      "category": "Daily Routine • Simple Present",
      "level": "Beginner",
      "en": "I drink coffee every morning.",
      "target": "I drink coffee every morning.",
      "words": ["I", "drink", "coffee", "every morning."],
      "id_translation": "Saya minum kopi setiap pagi.",
      "notes": "Pola kalimat: Subject (I) + Verb 1 (drink) + Object (coffee) + Time expression (every morning)."
    },
    {
      "id": "sb_02",
      "mode": "sentence_builder",
      "category": "Transit • Daily Transportation",
      "level": "Beginner",
      "en": "She goes to school by bus.",
      "target": "She goes to school by bus.",
      "words": ["She", "goes", "to school", "by bus."],
      "id_translation": "Dia pergi ke sekolah naik bus.",
      "notes": "Subjek tunggal 'She' menggunakan kata kerja bentuk -es (goes) dan preposisi 'by' untuk transportasi."
    },
    {
      "id": "sb_03",
      "mode": "sentence_builder",
      "category": "Activities • Present Continuous",
      "level": "Beginner",
      "en": "They are playing football in the park.",
      "target": "They are playing football in the park.",
      "words": ["They", "are playing", "football", "in the park."],
      "id_translation": "Mereka sedang bermain sepak bola di taman.",
      "notes": "Present Continuous: Subject (They) + are + V-ing (playing) + Object + Keterangan tempat."
    },
    {
      "id": "sb_04",
      "mode": "sentence_builder",
      "category": "Hobbies • Preferences",
      "level": "Elementary",
      "en": "My sister loves reading books at night.",
      "target": "My sister loves reading books at night.",
      "words": ["My sister", "loves", "reading books", "at night."],
      "id_translation": "Kakak perempuan saya suka membaca buku di malam hari.",
      "notes": "Kata kerja 'love' diikuti oleh gerund (reading) untuk menyatakan hobi."
    },
    {
      "id": "sb_05",
      "mode": "sentence_builder",
      "category": "Polite Request • Modal Verbs",
      "level": "Elementary",
      "en": "Could you please help me with this task?",
      "target": "Could you please help me with this task?",
      "words": ["Could you", "please help", "me with", "this task?"],
      "id_translation": "Bisakah Anda tolong bantu saya dengan tugas ini?",
      "notes": "Penggunaan 'Could you please...' adalah bentuk permintaan sopan yang sangat umum di tempat kerja."
    },
    {
      "id": "sb_06",
      "mode": "sentence_builder",
      "category": "Work Routine • Adverbs of Frequency",
      "level": "Elementary",
      "en": "He always arrives at the office on time.",
      "target": "He always arrives at the office on time.",
      "words": ["He always", "arrives", "at the office", "on time."],
      "id_translation": "Dia selalu tiba di kantor tepat waktu.",
      "notes": "Adverb of frequency 'always' diletakkan sebelum kata kerja utama 'arrives'."
    },
    {
      "id": "sb_07",
      "mode": "sentence_builder",
      "category": "Café & Ordering • Polite Expressions",
      "level": "Beginner",
      "en": "I would like a cup of hot tea, please.",
      "target": "I would like a cup of hot tea, please.",
      "words": ["I would like", "a cup of", "hot tea,", "please."],
      "id_translation": "Saya ingin secangkir teh panas, tolong.",
      "notes": "'I would like' adalah bentuk sopan dari 'I want' saat memesan makanan atau minuman."
    },
    {
      "id": "sb_08",
      "mode": "sentence_builder",
      "category": "Directions • City Navigation",
      "level": "Beginner",
      "en": "Where is the nearest train station around here?",
      "target": "Where is the nearest train station around here?",
      "words": ["Where is", "the nearest", "train station", "around here?"],
      "id_translation": "Di mana stasiun kereta terdekat di sekitar sini?",
      "notes": "Kalimat tanya tempat: Where + is + noun phrase (the nearest train station) + keterangan."
    },
    {
      "id": "sb_09",
      "mode": "sentence_builder",
      "category": "Safety • Imperative Sentences",
      "level": "Elementary",
      "en": "Don't forget to lock the door before leaving.",
      "target": "Don't forget to lock the door before leaving.",
      "words": ["Don't forget", "to lock", "the door", "before leaving."],
      "id_translation": "Jangan lupa untuk mengunci pintu sebelum pergi.",
      "notes": "Setelah preposisi 'before', kata kerja harus dalam bentuk -ing (leaving)."
    },
    {
      "id": "sb_10",
      "mode": "sentence_builder",
      "category": "Skills & Talents • Adverbs of Manner",
      "level": "Intermediate",
      "en": "She speaks three different languages very fluently.",
      "target": "She speaks three different languages very fluently.",
      "words": ["She speaks", "three different", "languages", "very fluently."],
      "id_translation": "Dia berbicara tiga bahasa berbeda dengan sangat lancar.",
      "notes": "Adverb of manner 'fluently' menerangkan bagaimana dia berbicara (speaks)."
    },
    {
      "id": "sb_11",
      "mode": "sentence_builder",
      "category": "Weather • Past Continuous & Simple Past",
      "level": "Intermediate",
      "en": "It was raining heavily when I arrived home.",
      "target": "It was raining heavily when I arrived home.",
      "words": ["It was", "raining heavily", "when", "I arrived home."],
      "id_translation": "Hujan turun deras ketika saya tiba di rumah.",
      "notes": "Tindakan yang sedang berlangsung (was raining) dipotong oleh kejadian lampau (arrived)."
    },
    {
      "id": "sb_12",
      "mode": "sentence_builder",
      "category": "Education • Purpose Clauses",
      "level": "Elementary",
      "en": "He is studying hard to pass the final exam.",
      "target": "He is studying hard to pass the final exam.",
      "words": ["He is", "studying hard", "to pass", "the final exam."],
      "id_translation": "Dia sedang belajar giat untuk lulus ujian akhir.",
      "notes": "'To pass' menunjukkan tujuan (infinitive of purpose)."
    },
    {
      "id": "sb_13",
      "mode": "sentence_builder",
      "category": "Family • Daily Dinner",
      "level": "Beginner",
      "en": "We usually have dinner together at seven PM.",
      "target": "We usually have dinner together at seven PM.",
      "words": ["We usually", "have dinner", "together", "at seven PM."],
      "id_translation": "Kami biasanya makan malam bersama pada pukul tujuh malam.",
      "notes": "'Have dinner' adalah kolokasi alami untuk makan malam."
    },
    {
      "id": "sb_14",
      "mode": "sentence_builder",
      "category": "Experience • Present Perfect",
      "level": "Intermediate",
      "en": "I have never seen such a beautiful sunset before.",
      "target": "I have never seen such a beautiful sunset before.",
      "words": ["I have never", "seen", "such a beautiful", "sunset before."],
      "id_translation": "Saya belum pernah melihat matahari terbenam seindah ini sebelumnya.",
      "notes": "Present Perfect: have + never + V3 (seen) untuk pengalaman hidup."
    },
    {
      "id": "sb_15",
      "mode": "sentence_builder",
      "category": "Conversation • Polite Clarification",
      "level": "Beginner",
      "en": "Can you speak a little bit slower, please?",
      "target": "Can you speak a little bit slower, please?",
      "words": ["Can you", "speak", "a little bit slower,", "please?"],
      "id_translation": "Bisakah Anda berbicara sedikit lebih pelan, tolong?",
      "notes": "Ungkapan emas saat berbicara dengan penutur asli yang berbicara terlalu cepat."
    },
    {
      "id": "sb_16",
      "mode": "sentence_builder",
      "category": "Duration • Present Perfect Continuous",
      "level": "Intermediate",
      "en": "We have been waiting for the bus for thirty minutes.",
      "target": "We have been waiting for the bus for thirty minutes.",
      "words": ["We have been", "waiting for", "the bus", "for thirty minutes."],
      "id_translation": "Kami telah menunggu bus itu selama tiga puluh menit.",
      "notes": "Menyatakan tindakan yang dimulai di masa lampau dan masih berlangsung hingga sekarang."
    },
    {
      "id": "sb_17",
      "mode": "sentence_builder",
      "category": "Advice • Modal Verb Should",
      "level": "Elementary",
      "en": "You should take an umbrella because it might rain.",
      "target": "You should take an umbrella because it might rain.",
      "words": ["You should", "take an umbrella", "because", "it might rain."],
      "id_translation": "Kamu sebaiknya membawa payung karena mungkin akan hujan.",
      "notes": "'Should' digunakan untuk memberi saran yang bersahabat."
    },
    {
      "id": "sb_18",
      "mode": "sentence_builder",
      "category": "Future Plans • Decisions",
      "level": "Elementary",
      "en": "They decided to travel abroad next summer.",
      "target": "They decided to travel abroad next summer.",
      "words": ["They decided", "to travel abroad", "next", "summer."],
      "id_translation": "Mereka memutuskan untuk bepergian ke luar negeri musim panas depan.",
      "notes": "Kata kerja 'decide' diikuti oleh to-infinitive (to travel)."
    },
    {
      "id": "sb_19",
      "mode": "sentence_builder",
      "category": "Anticipation • Phrasal Verbs",
      "level": "Intermediate",
      "en": "I am looking forward to seeing you next week.",
      "target": "I am looking forward to seeing you next week.",
      "words": ["I am", "looking forward to", "seeing you", "next week."],
      "id_translation": "Saya sangat menantikan untuk bertemu dengan Anda minggu depan.",
      "notes": "Frasa 'look forward to' wajib diikuti oleh bentuk gerund (-ing: seeing)."
    },
    {
      "id": "sb_20",
      "mode": "sentence_builder",
      "category": "Past Negative • Simple Past",
      "level": "Beginner",
      "en": "He did not understand the question at first.",
      "target": "He did not understand the question at first.",
      "words": ["He did not", "understand", "the question", "at first."],
      "id_translation": "Dia tidak mengerti pertanyaan tersebut pada awalnya.",
      "notes": "Setelah kata bantu 'did not', kata kerja kembali ke bentuk dasar (understand)."
    }
  ]
};

  /* ==========================================================================
     2. AUDIO SYNTHESIS & SOUND EFFECTS (Web Audio API)
     ========================================================================== */
  class SoundManager {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    }

    playTone(freq, type, duration, gain = 0.15) {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gainNode.gain.setValueAtTime(gain, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playSuccess() {
      this.playTone(523.25, 'sine', 0.1, 0.2);
      setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.2), 100);
      setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.25), 200);
    }

    playWrong() {
      this.playTone(220, 'sawtooth', 0.18, 0.15);
      setTimeout(() => this.playTone(185, 'sawtooth', 0.25, 0.18), 120);
    }

    playStreak() {
      this.playTone(440, 'triangle', 0.08, 0.15);
      setTimeout(() => this.playTone(880, 'triangle', 0.15, 0.2), 80);
    }

    playClick() {
      this.playTone(600, 'sine', 0.04, 0.08);
    }
  }

  /* ==========================================================================
     3. SPEECH SERVICES (Web Speech Recognition + SpeechSynthesis)
     ========================================================================== */
  class SpeechService {
    constructor() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.hasRecognition = !!SpeechRecognition;
      this.recognition = null;
      this.isRecording = false;

      this.selectedVoiceName = safeStorage.getItem('cfg_voice_name') || 'auto';
      this.speechRate = parseFloat(normalizeRate(safeStorage.getItem('cfg_voice_rate') || '0.8'));
      this.cachedVoices = [];

      if ('speechSynthesis' in window) {
        this.cachedVoices = window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          this.cachedVoices = window.speechSynthesis.getVoices();
        };
      }

      if (this.hasRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
          this.recognition.maxAlternatives = 1;
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
          this.hasRecognition = false;
        }
      }
    }

    startListening(lang, onInterim, onFinal, onError) {
      if (!this.hasRecognition) {
        onError('Mikrofon suara tidak didukung di browser ini. Gunakan Google Chrome, Microsoft Edge, atau Safari (iOS/Mac), atau ketik manual.');
        return;
      }

      // Stop any pending session cleanly before starting
      try {
        if (this.recognition) this.recognition.abort();
      } catch (e) {}

      this.recognition.lang = lang || 'en-US';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onFinal(finalTranscript.trim());
        } else if (interimTranscript) {
          onInterim(interimTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        this.isRecording = false;
        let errMsg = event.error || 'Terjadi kendala mikrofon.';
        if (event.error === 'not-allowed') {
          errMsg = 'Izin mikrofon ditolak. Izinkan akses mic di pengaturan browser/HP Anda.';
        } else if (event.error === 'no-speech') {
          errMsg = 'Tidak ada suara terdengar. Silakan klik mic lagi dan ucapkan kalimat Anda.';
        } else if (event.error === 'network') {
          errMsg = 'Koneksi pengenal suara terputus. Pastikan HP/Laptop terhubung ke internet.';
        }
        onError(errMsg);
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };

      try {
        this.recognition.start();
        this.isRecording = true;
      } catch (err) {
        this.isRecording = false;
        onError(err.message || 'Gagal mengaktifkan mikrofon.');
      }
    }

    stopListening() {
      if (this.hasRecognition && this.isRecording) {
        try {
          this.recognition.stop();
        } catch (e) {}
        this.isRecording = false;
      }
    }

    speak(text, lang = 'en-US', customRate = null) {
      if (!('speechSynthesis' in window)) return;

      try {
        window.speechSynthesis.cancel();
      } catch (e) {}

      const cleanedText = cleanText(text);
      if (!cleanedText) return;

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = lang || 'en-US';
      
      const rawRate = customRate !== null && customRate !== undefined 
        ? customRate 
        : (this.speechRate || safeStorage.getItem('cfg_voice_rate') || 0.8);
      const activeRate = Math.max(0.4, Math.min(2.0, parseFloat(rawRate) || 0.8));

      const voices = (this.cachedVoices && this.cachedVoices.length > 0) ? this.cachedVoices : window.speechSynthesis.getVoices();
      let chosenVoice = null;

      // 1. Check persona preference
      const pref = this.selectedVoiceName || 'auto';
      if (pref !== 'auto' && voices.length > 0) {
        if (pref === 'female_us') {
          chosenVoice = voices.find(v => (v.lang.includes('US') || v.lang.includes('en-US')) && (v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Female')));
        } else if (pref === 'male_us') {
          chosenVoice = voices.find(v => (v.lang.includes('US') || v.lang.includes('en-US')) && (v.name.includes('David') || v.name.includes('Alex') || v.name.includes('Male')));
        } else if (pref === 'female_uk') {
          chosenVoice = voices.find(v => (v.lang.includes('GB') || v.lang.includes('en-GB')) && (v.name.includes('Susan') || v.name.includes('Victoria') || v.name.includes('Female')));
        } else if (pref === 'male_uk') {
          chosenVoice = voices.find(v => (v.lang.includes('GB') || v.lang.includes('en-GB')) && (v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('Male')));
        } else if (pref === 'female_au') {
          chosenVoice = voices.find(v => (v.lang.includes('AU') || v.lang.includes('en-AU')));
        } else if (pref === 'male_in') {
          chosenVoice = voices.find(v => (v.lang.includes('IN') || v.lang.includes('en-IN')));
        } else {
          chosenVoice = voices.find(v => v.name === pref || v.voiceURI === pref);
        }
      }

      // 2. Fallback matching accent
      // Prioritize localService voices (like Microsoft David / Microsoft Zira on Windows)
      // because local voices faithfully respect and smoothly scale utterance.rate (0.5x - 1.0x)!
      if (!chosenVoice && voices.length > 0) {
        const langCode = (lang || 'en-US').toLowerCase();
        chosenVoice = voices.find(v => v.localService && v.lang && v.lang.toLowerCase().replace('_', '-') === langCode);
        if (!chosenVoice) {
          chosenVoice = voices.find(v => v.lang && v.lang.toLowerCase().replace('_', '-') === langCode);
        }
        if (!chosenVoice) {
          chosenVoice = voices.find(v => v.localService && v.lang && v.lang.toLowerCase().startsWith(langCode.substring(0, 2)));
        }
        if (!chosenVoice) {
          chosenVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
        }
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // CRITICAL: Set utterance.rate AFTER setting utterance.voice
      utterance.rate = activeRate;
      utterance.pitch = 1.0;

      // Small 30ms timeout avoids Chromium async cancel() race condition
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('SpeechSynthesis error:', err);
        }
      }, 30);
    }
  }

  /* ==========================================================================
     4. SIMILARITY & INTELLIGENT PHONETIC EVALUATOR (Offline Engine)
     ========================================================================== */
  class Evaluator {
    static normalize(str) {
      return (str || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    static levenshtein(a, b) {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }

    static calculateAccuracy(target, heard) {
      const normTarget = this.normalize(target);
      const normHeard = this.normalize(heard);

      if (!normTarget || !normHeard) return 0;
      if (normTarget === normHeard) return 100;

      const targetWords = normTarget.split(' ');
      const heardWords = normHeard.split(' ');

      const maxLen = Math.max(normTarget.length, normHeard.length);
      const levDist = this.levenshtein(normTarget, normHeard);
      const charSim = Math.max(0, (maxLen - levDist) / maxLen);

      let matchedWords = 0;
      targetWords.forEach(w => {
        if (heardWords.includes(w)) matchedWords++;
      });
      const wordRecall = matchedWords / targetWords.length;

      const finalScore = Math.round((charSim * 0.5 + wordRecall * 0.5) * 100);
      return Math.min(100, Math.max(0, finalScore));
    }
  }

  /* ==========================================================================
     5. GEMINI AI INTEGRATION (Free Tier gemini-3-flash-preview)
     ========================================================================== */
  class GeminiService {
    static async evaluateAnswer(apiKey, targetText, userTranscript, mode, direction) {
      if (!apiKey) {
        const accuracy = Evaluator.calculateAccuracy(targetText, userTranscript);
        let feedback = '';
        if (accuracy >= 90) {
          feedback = 'Luar biasa! Pengucapan dan struktur kalimat Anda sangat akurat dan mengalir alami.';
        } else if (accuracy >= 70) {
          feedback = 'Bagus! Inti kalimat sudah benar. Perhatikan sedikit artikulasi pengucapan atau kata penghubung.';
        } else {
          feedback = 'Terus semangat! Coba dengarkan lagi audio native speaker lalu tirukan perlahan kata per kata.';
        }
        return { accuracy, feedback };
      }

      const models = ['gemini-3-flash-preview', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      const prompt = `
You are an expert, encouraging Bilingual English & Indonesian Language Teacher & Speaking Examiner.
Learning Direction: ${direction}
Mode: ${mode}
Expected Target: "${targetText}"
Learner Voice/Answer: "${userTranscript}"

Respond with concise, actionable feedback for the student in JSON format with exactly these keys:
{
  "accuracy": <number 0-100 reflecting accuracy>,
  "verdict": "<short positive encouragement>",
  "feedback": "<2-3 sentences explaining phonetic errors, rhythm, or translation nuances in friendly Indonesian>"
}
Do NOT return markdown code fences. Return ONLY the raw JSON string.
`;

      for (const model of models) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3 }
            })
          });

          if (res.ok) {
            const data = await res.json();
            let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            rawText = rawText.replace(/```json|```/g, '').trim();

            const parsed = JSON.parse(rawText);
            return {
              accuracy: Number(parsed.accuracy) || Evaluator.calculateAccuracy(targetText, userTranscript),
              verdict: parsed.verdict || 'Bagus sekali!',
              feedback: parsed.feedback || 'Jawaban Anda telah dicatat.'
            };
          }
        } catch (err) {
          console.warn(`Model ${model} request failed:`, err);
        }
      }

      const accuracy = Evaluator.calculateAccuracy(targetText, userTranscript);
      return {
        accuracy,
        verdict: accuracy > 80 ? 'Bagus sekali!' : 'Terus berlatih!',
        feedback: `Analisis offline: ${accuracy}% akurasi.`
      };
    }
  }

  /* ==========================================================================
     6. LEADERBOARD & MEMORY API SERVICE (Google Sheets Database)
     ========================================================================== */
  class LeaderboardService {
    static getStorageKey() {
      return 'awesome_english_local_leaderboard';
    }

    static getMemoryStorageKey() {
      return 'awesome_english_local_memory';
    }

    static getAppScriptUrl() {
      return safeStorage.getItem('cfg_appscript_url') || 'https://script.google.com/macros/s/AKfycbxy8pG0P3G95SATXLLqC0V3ZzH7MmU7oEF40PPLJRgBUE6i8NnBmKZlupiYfObPKtZ5/exec';
    }

    static async fetchLeaderboard() {
      const url = this.getAppScriptUrl();

      if (url) {
        try {
          const res = await fetch(url + '?action=leaderboard');
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            return { source: 'Live Cloud Database', data: json.data };
          }
        } catch (e) {
          console.warn('Could not fetch from Cloud Database:', e);
        }
      }

      const local = JSON.parse(safeStorage.getItem(this.getStorageKey()) || 'null');
      if (local && Array.isArray(local)) {
        return { source: 'Local Storage Database', data: local };
      }

      const defaultRecords = [
        { playerName: 'Jefri', gameMode: 'Speaking Arena (ID->EN)', score: 520, accuracy: 96, timestamp: new Date(Date.now() - 3600000).toISOString() },
        { playerName: 'Sarah L.', gameMode: 'Listening Arena (EN->ID)', score: 480, accuracy: 92, timestamp: new Date(Date.now() - 7200000).toISOString() },
        { playerName: 'Rian Dev', gameMode: 'Murphy Grammar Quest', score: 430, accuracy: 88, timestamp: new Date(Date.now() - 14400000).toISOString() }
      ];
      safeStorage.setItem(this.getStorageKey(), JSON.stringify(defaultRecords));
      return { source: 'Local Database', data: defaultRecords };
    }

    static async fetchMemory() {
      const url = this.getAppScriptUrl();

      if (url) {
        try {
          const res = await fetch(url + '?action=memory');
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            return { source: 'Live Cloud Database (Learning History)', data: json.data };
          }
        } catch (e) {
          console.warn('Could not fetch memory from Cloud Database:', e);
        }
      }

      const localMem = JSON.parse(safeStorage.getItem(this.getMemoryStorageKey()) || '[]');
      return { source: 'Local Memory Storage', data: localMem };
    }

    static async loginUser(email, password) {
      const url = this.getAppScriptUrl();
      if (url) {
        try {
          const res = await fetch(`${url}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
          const json = await res.json();
          return json;
        } catch (e) {
          console.warn('Cloud Database login fetch error:', e);
        }
      }

      // Offline / Local fallback demo accounts
      const lowerEmail = (email || '').toLowerCase().trim();
      if ((lowerEmail === 'jefry.m95@gmail.com' || lowerEmail === 'jefri@admin.com') && password === 'admin123') {
        return {
          status: 'success',
          user: { email: 'jefry.m95@gmail.com', name: 'Jefri (Admin)', totalScore: 3250, level: 5, status: 'ACTIVE' }
        };
      }
      if (lowerEmail === 'siswa1@english.com' && password === 'siswa123') {
        return {
          status: 'success',
          user: { email: 'siswa1@english.com', name: 'Budi Santoso', totalScore: 450, level: 1, status: 'ACTIVE' }
        };
      }

      return {
        status: 'error',
        message: 'Email atau password tidak ditemukan. Pastikan akun sudah didaftarkan oleh Jefri (Admin).'
      };
    }

    static async fetchUser(email) {
      const url = this.getAppScriptUrl();
      if (url) {
        try {
          const res = await fetch(`${url}?action=get_user&email=${encodeURIComponent(email)}`);
          const json = await res.json();
          if (json.status === 'success' && json.user) {
            return json.user;
          }
        } catch (e) {}
      }
      return null;
    }

    static async submitScore(entry) {
      const url = this.getAppScriptUrl();

      // Save locally
      const local = JSON.parse(safeStorage.getItem(this.getStorageKey()) || '[]');
      local.push(entry);
      local.sort((a, b) => b.score - a.score);
      safeStorage.setItem(this.getStorageKey(), JSON.stringify(local.slice(0, 50)));

      // Save local memory
      if (entry.history && Array.isArray(entry.history)) {
        const mem = JSON.parse(safeStorage.getItem(this.getMemoryStorageKey()) || '[]');
        entry.history.forEach(h => {
          mem.unshift({
            timestamp: new Date().toISOString(),
            playerName: entry.playerName,
            email: entry.userEmail || '',
            direction: entry.direction,
            target: h.target,
            userResponse: h.heard,
            accuracy: h.accuracy,
            notes: h.feedback
          });
        });
        safeStorage.setItem(this.getMemoryStorageKey(), JSON.stringify(mem.slice(0, 50)));
      }

      // POST to Google Sheets
      if (url) {
        try {
          await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
          });
          return { success: true, message: '✓ Skor & Memory tersimpan permanen di Cloud Database!' };
        } catch (e) {
          return { success: true, message: 'Tersimpan di database lokal (Cloud sync offline)' };
        }
      }

      return { success: true, message: 'Tersimpan di Leaderboard lokal!' };
    }
  }

  /* ==========================================================================
     AUTHENTICATION & ACCESS MANAGER (Restricted Member & Persistent Scores)
     ========================================================================== */
  class AuthManager {
    static STORAGE_KEY = 'awesome_english_auth_session';
    static currentUser = null;
    static onAuthChange = null;

    static init(callback) {
      this.onAuthChange = callback;
      const saved = safeStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          this.currentUser = JSON.parse(saved);
          this.syncRemote();
        } catch (e) {
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }
      this.updateUI();
    }

    static isLoggedIn() {
      return !!this.currentUser && !!this.currentUser.email;
    }

    static async syncRemote() {
      if (!this.currentUser || !this.currentUser.email) return;
      const remoteUser = await LeaderboardService.fetchUser(this.currentUser.email);
      if (remoteUser) {
        this.currentUser.totalScore = remoteUser.totalScore;
        this.currentUser.level = remoteUser.level;
        this.currentUser.name = remoteUser.name;
        this.save();
        this.updateUI();
      }
    }

    static async login(email, password, remember = true) {
      const res = await LeaderboardService.loginUser(email, password);
      if (res.status === 'success' && res.user) {
        this.currentUser = res.user;
        if (remember) this.save();
        this.updateUI();
        return { success: true, user: this.currentUser };
      }
      return { success: false, message: res.message || 'Login gagal.' };
    }

    static logout() {
      this.currentUser = null;
      safeStorage.removeItem(this.STORAGE_KEY);
      this.updateUI();
    }

    static save() {
      if (this.currentUser) {
        safeStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
      }
    }

    static addScore(points) {
      if (!this.currentUser) return;
      this.currentUser.totalScore = (this.currentUser.totalScore || 0) + points;
      this.currentUser.level = Math.max(this.currentUser.level || 1, Math.floor(this.currentUser.totalScore / 500) + 1);
      this.save();
      this.updateUI();
    }

    static updateUI() {
      const userProfile = document.getElementById('nav-user-profile');
      const loginBtn = document.getElementById('btn-login-nav');
      const userName = document.getElementById('nav-user-name');
      const userScore = document.getElementById('nav-user-score');
      const userLevel = document.getElementById('nav-user-level');

      // Mobile header chip
      const mobileScore = document.getElementById('mobile-quick-score');
      const mobilePts = document.getElementById('mobile-user-pts');

      // Drawer elements
      const drawerName = document.getElementById('drawer-user-name');
      const drawerScore = document.getElementById('drawer-user-score');
      const drawerLevel = document.getElementById('drawer-user-level');
      const drawerLoginBtn = document.getElementById('btn-drawer-login');
      const drawerLogoutBtn = document.getElementById('btn-drawer-logout');

      if (this.isLoggedIn()) {
        if (userProfile) userProfile.classList.remove('hidden');
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userName) userName.textContent = this.currentUser.name;
        if (userScore) userScore.textContent = `⭐ ${(this.currentUser.totalScore || 0).toLocaleString()} PTS`;
        if (userLevel) userLevel.textContent = `Lvl ${this.currentUser.level || 1}`;

        if (mobileScore) mobileScore.classList.remove('hidden');
        if (mobilePts) mobilePts.textContent = `${(this.currentUser.totalScore || 0).toLocaleString()} PTS`;

        if (drawerName) drawerName.textContent = this.currentUser.name;
        if (drawerScore) drawerScore.textContent = `⭐ ${(this.currentUser.totalScore || 0).toLocaleString()} PTS`;
        if (drawerLevel) drawerLevel.textContent = `Lvl ${this.currentUser.level || 1}`;
        if (drawerLoginBtn) drawerLoginBtn.classList.add('hidden');
        if (drawerLogoutBtn) drawerLogoutBtn.classList.remove('hidden');
      } else {
        if (userProfile) userProfile.classList.add('hidden');
        if (loginBtn) loginBtn.classList.remove('hidden');

        if (mobileScore) mobileScore.classList.add('hidden');

        if (drawerName) drawerName.textContent = 'Tamu (Belum Masuk)';
        if (drawerScore) drawerScore.textContent = '⭐ 0 PTS';
        if (drawerLevel) drawerLevel.textContent = 'Lvl 1';
        if (drawerLoginBtn) drawerLoginBtn.classList.remove('hidden');
        if (drawerLogoutBtn) drawerLogoutBtn.classList.add('hidden');
      }

      if (typeof this.onAuthChange === 'function') {
        this.onAuthChange(this.currentUser);
      }
    }
  }

  /* ==========================================================================
     7. MAIN GAME CONTROLLER & UI BINDINGS
     ========================================================================== */
  class EnglishArenaGame {
    constructor() {
      this.sound = new SoundManager();
      this.speech = new SpeechService();

      // Core Game State
      this.languageDirection = 'en-to-id'; // 'id-to-en' or 'en-to-id'
      this.currentMode = 'shadowing';
      this.questions = [];
      this.currentIndex = 0;
      this.score = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.combo = 0;
      this.history = [];

      // Gamification State (Persisted)
      this.hearts = Math.max(1, Math.min(5, parseInt(safeStorage.getItem('ae_hearts') ?? '5', 10) || 5));
      this.streakDays = Math.max(1, parseInt(safeStorage.getItem('ae_streak_days') ?? '1', 10) || 1);
      this.totalXP = Math.max(0, parseInt(safeStorage.getItem('ae_total_xp') ?? '0', 10) || 0);

      // Statistics Tracker
      let loadedStats = {};
      try { loadedStats = JSON.parse(safeStorage.getItem('ae_stats') || '{}'); } catch(e) {}
      this.stats = {
        vocabLearned: loadedStats.vocabLearned || 0,
        grammarMastered: loadedStats.grammarMastered || 0,
        listeningScore: loadedStats.listeningScore || 0,
        speakingScore: loadedStats.speakingScore || 0,
        gamesPlayed: loadedStats.gamesPlayed || 0,
        totalAnswered: loadedStats.totalAnswered || 0,
        totalCorrect: loadedStats.totalCorrect || 0
      };

      // Unlocked Badges
      let loadedBadges = [];
      try { loadedBadges = JSON.parse(safeStorage.getItem('ae_badges') || '[]'); } catch(e) {}
      this.badges = Array.isArray(loadedBadges) ? loadedBadges : [];

      // Sentence Builder Word State
      this.selectedWords = [];
      this.wordBank = [];
      this.builderTarget = '';

      // UI Elements Cache
      this.dom = {
        views: {
          landing: document.getElementById('landing-view'),
          game: document.getElementById('game-view'),
          result: document.getElementById('result-view'),
          progress: document.getElementById('progress-view'),
          profile: document.getElementById('profile-view')
        },
        hud: {
          score: document.getElementById('hud-score'),
          streak: document.getElementById('hud-streak'),
          progress: document.getElementById('hud-progress'),
          modePill: document.getElementById('current-mode-pill'),
          dirPill: document.getElementById('current-dir-pill'),
          hearts: document.getElementById('hud-hearts'),
          combo: document.getElementById('hud-combo'),
          heartsItem: document.getElementById('hud-hearts-item'),
          comboItem: document.getElementById('hud-combo-item')
        },
        challenge: {
          instruction: document.getElementById('challenge-instruction'),
          category: document.getElementById('meta-category'),
          difficulty: document.getElementById('meta-difficulty'),
          promptBox: document.getElementById('prompt-box'),
          targetPhrase: document.getElementById('target-phrase'),
          targetPhonetic: document.getElementById('target-phonetic'),
          targetTranslation: document.getElementById('target-translation'),
          audioBtn: document.getElementById('btn-listen-audio'),
          replayBtn: document.getElementById('btn-replay-audio'),
          accentSelect: document.getElementById('accent-select'),
          speedSelect: document.getElementById('arena-speed-select'),
          optionsContainer: document.getElementById('options-container'),
          vocabVisualBadge: document.getElementById('vocab-visual-badge'),
          vocabEmojiIcon: document.getElementById('vocab-emoji-icon')
        },
        builder: {
          container: document.getElementById('sentence-builder-container'),
          answerZone: document.getElementById('builder-answer-zone'),
          placeholder: document.getElementById('builder-placeholder'),
          wordBank: document.getElementById('builder-word-bank'),
          undoBtn: document.getElementById('btn-builder-undo'),
          clearBtn: document.getElementById('btn-builder-clear'),
          checkBtn: document.getElementById('btn-builder-check')
        },
        mic: {
          section: document.getElementById('mic-section'),
          toggleBtn: document.getElementById('btn-mic-toggle'),
          status: document.getElementById('mic-status'),
          transcript: document.getElementById('transcript-text'),
          manualInput: document.getElementById('manual-text-input'),
          manualSubmit: document.getElementById('btn-submit-manual'),
          textInputRow: document.getElementById('text-input-row')
        },
        evaluation: {
          panel: document.getElementById('evaluation-panel'),
          scoreBadge: document.getElementById('eval-score-badge'),
          verdict: document.getElementById('eval-verdict'),
          compTarget: document.getElementById('comp-target'),
          compHeard: document.getElementById('comp-heard'),
          aiFeedback: document.getElementById('ai-feedback-text'),
          nextBtn: document.getElementById('btn-next-question'),
          translationCard: document.getElementById('eval-translation-card'),
          translationText: document.getElementById('eval-translation-text'),
          exampleCard: document.getElementById('eval-example-card'),
          exampleText: document.getElementById('eval-example-text'),
          grammarCard: document.getElementById('eval-grammar-card'),
          grammarText: document.getElementById('eval-grammar-text'),
          phoneticBox: document.getElementById('phonetic-reveal-box'),
          phoneticText: document.getElementById('eval-phonetic-text')
        },
        result: {
          modeName: document.getElementById('res-mode-name'),
          totalScore: document.getElementById('res-total-score'),
          cumulativeScore: document.getElementById('res-cumulative-score'),
          avgAccuracy: document.getElementById('res-avg-accuracy'),
          maxStreak: document.getElementById('res-max-streak'),
          level: document.getElementById('res-level'),
          playerNameInput: document.getElementById('player-name-input'),
          submitBtn: document.getElementById('btn-submit-leaderboard'),
          statusMsg: document.getElementById('submit-status-msg'),
          playAgainBtn: document.getElementById('btn-play-again'),
          homeBtn: document.getElementById('btn-back-home'),
          viewLeaderboardBtn: document.getElementById('btn-view-leaderboard-from-result')
        },
        dashboard: {
          playerName: document.getElementById('dash-player-name'),
          tierBadge: document.getElementById('dash-tier-badge'),
          levelBadge: document.getElementById('dash-level-badge'),
          streakCount: document.getElementById('dash-streak-count'),
          xpFraction: document.getElementById('dash-xp-fraction'),
          xpProgressFill: document.getElementById('dash-xp-progress-fill'),
          heartsCount: document.getElementById('dash-hearts-count'),
          totalXp: document.getElementById('dash-total-xp'),
          accuracyVal: document.getElementById('dash-accuracy-val'),
          btnStart: document.getElementById('btn-dashboard-start')
        },
        progress: {
          vocabCount: document.getElementById('stat-vocab-count'),
          vocabFill: document.getElementById('stat-vocab-fill'),
          grammarCount: document.getElementById('stat-grammar-count'),
          grammarFill: document.getElementById('stat-grammar-fill'),
          listeningScore: document.getElementById('stat-listening-score'),
          listeningAcc: document.getElementById('stat-listening-acc'),
          speakingScore: document.getElementById('stat-speaking-score'),
          speakingAcc: document.getElementById('stat-speaking-acc'),
          totalXp: document.getElementById('stat-total-xp'),
          xpTier: document.getElementById('stat-xp-tier'),
          gamesPlayed: document.getElementById('stat-games-played'),
          totalSoal: document.getElementById('stat-total-soal'),
          accuracyRate: document.getElementById('stat-accuracy-rate'),
          accuracyFill: document.getElementById('stat-accuracy-fill'),
          streakDays: document.getElementById('stat-streak-days')
        },
        profile: {
          displayName: document.getElementById('profile-display-name'),
          tierBadge: document.getElementById('profile-tier-badge'),
          lvlBadge: document.getElementById('profile-lvl-badge'),
          xpBadge: document.getElementById('profile-xp-badge'),
          streakBadge: document.getElementById('profile-streak-badge'),
          heartsIcons: document.getElementById('profile-hearts-icons'),
          refillHeartsBtn: document.getElementById('btn-profile-refill-hearts'),
          badgesCount: document.getElementById('badges-unlocked-count'),
          badgesContainer: document.getElementById('badges-grid-container')
        },
        modals: {
          auth: document.getElementById('modal-auth'),
          leaderboard: document.getElementById('modal-leaderboard'),
          settings: document.getElementById('modal-settings'),
          hearts: document.getElementById('modal-hearts'),
          tabLeaderboardBtn: document.getElementById('tab-leaderboard-btn'),
          tabMemoryBtn: document.getElementById('tab-memory-btn'),
          containerLeaderboard: document.getElementById('container-leaderboard-table'),
          containerMemory: document.getElementById('container-memory-table'),
          tbody: document.getElementById('leaderboard-tbody'),
          memoryTbody: document.getElementById('memory-tbody'),
          syncStatus: document.getElementById('leaderboard-sync-status')
        },
        auth: {
          form: document.getElementById('auth-form'),
          email: document.getElementById('auth-email'),
          password: document.getElementById('auth-password'),
          remember: document.getElementById('auth-remember'),
          errorBox: document.getElementById('auth-error-box'),
          submitBtn: document.getElementById('btn-submit-login')
        }
      };

      this.pendingMode = null;
      this.levelPreference = safeStorage.getItem('cfg_level_preference') || 'all';

      this.initAuth();
      this.initEvents();
      this.loadSettings();
      this.loadQuestionsFromGitHub();

      // Update Dashboard & Badges on launch
      this.updateDashboard();
      this.renderBadges();
    }

    initAuth() {
      AuthManager.init((user) => {
        if (user) {
          if (this.dom.result.playerNameInput) {
            this.dom.result.playerNameInput.value = user.name;
          }
          this.updateDashboard();
        }
      });
    }

    async loadQuestionsFromGitHub() {
      const endpoints = ['./data/questions.json', GITHUB_DATA_URL];
      for (const url of endpoints) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.questions) && data.questions.length > 0) {
              data.questions.forEach(q => {
                const targetMode = q.mode || 'shadowing';
                if (!QUESTION_BANK[targetMode]) QUESTION_BANK[targetMode] = [];
                
                const exists = QUESTION_BANK[targetMode].some(item => item.id === q.id || item.en === q.en);
                if (!exists) {
                  QUESTION_BANK[targetMode].push({
                    id: q.id,
                    mode: targetMode,
                    category: q.category,
                    level: q.level,
                    en: cleanText(q.en),
                    target: cleanText(q.target || q.en),
                    phonetic: q.phonetic,
                    translation: cleanText(q.id_translation || q.translation),
                    id_translation: cleanText(q.id_translation || q.translation),
                    id_prompt: cleanText(q.id_prompt),
                    en_prompt: cleanText(q.en_prompt),
                    missingWord: cleanText(q.missingWord),
                    prompt_en: cleanText(q.prompt_en),
                    prompt_id: cleanText(q.prompt_id),
                    options: (q.options || q.options_en || q.options_id || []).map(o => cleanText(o)),
                    options_id: (q.options_id || []).map(o => cleanText(o)),
                    options_en: (q.options_en || []).map(o => cleanText(o)),
                    correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
                    notes: cleanText(q.notes)
                  });
                }
              });
              break;
            }
          }
        } catch (err) {}
      }
    }

    getPlayerTier(xp) {
      if (xp >= 3000) return { level: 5, tier: '🔴 Advanced', nextXP: 5000, baseXP: 3000 };
      if (xp >= 1500) return { level: 4, tier: '🟠 Upper-Intermediate', nextXP: 3000, baseXP: 1500 };
      if (xp >= 700) return { level: 3, tier: '🟡 Intermediate', nextXP: 1500, baseXP: 700 };
      if (xp >= 300) return { level: 2, tier: '🔵 Elementary', nextXP: 700, baseXP: 300 };
      return { level: 1, tier: '🟢 Beginner', nextXP: 300, baseXP: 0 };
    }

    getComboMultiplier() {
      if (this.combo <= 0) return 1.0;
      return Math.min(2.0, 1.0 + (this.combo - 1) * 0.2);
    }

    getComboMultiplierLabel() {
      const m = this.getComboMultiplier();
      return m > 1.0 ? `${m.toFixed(1)}x` : '1x';
    }

    switchView(viewName, pushHistory = true) {
      this.currentView = viewName;
      Object.entries(this.dom.views).forEach(([key, el]) => {
        if (!el) return;
        if (key === viewName) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (pushHistory && window.history && window.history.pushState) {
        if (viewName !== 'landing') {
          window.history.pushState({ arenaView: viewName }, '');
        }
      }

      if (viewName === 'progress') this.updateProgressView();
      if (viewName === 'profile') this.updateProfileView();
      if (viewName === 'landing') this.updateDashboard();
    }

    switchTab(tabName) {
      this.sound.playClick();
      // Update desktop tab buttons
      document.querySelectorAll('.desktop-nav-tabs .nav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nav === tabName);
      });
      // Update mobile bottom nav buttons
      document.querySelectorAll('.bottom-nav-bar .bottom-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nav === tabName);
      });

      if (tabName === 'landing' || tabName === 'home') {
        this.switchView('landing');
      } else if (tabName === 'play') {
        this.switchView('landing');
        const modesSection = document.getElementById('game-modes-grid') || document.querySelector('.modes-grid');
        if (modesSection) modesSection.scrollIntoView({ behavior: 'smooth' });
      } else if (tabName === 'progress') {
        this.switchView('progress');
      } else if (tabName === 'profile') {
        this.switchView('profile');
      }
    }

    updateDashboard() {
      const tier = this.getPlayerTier(this.totalXP);
      const userName = AuthManager.isLoggedIn() ? AuthManager.currentUser.name : 'Player 1';
      if (this.dom.dashboard.playerName) this.dom.dashboard.playerName.textContent = userName;
      if (this.dom.dashboard.tierBadge) this.dom.dashboard.tierBadge.textContent = tier.tier;
      if (this.dom.dashboard.levelBadge) this.dom.dashboard.levelBadge.textContent = `Level ${tier.level}`;
      if (this.dom.dashboard.streakCount) this.dom.dashboard.streakCount.textContent = this.streakDays;
      if (this.dom.dashboard.heartsCount) this.dom.dashboard.heartsCount.textContent = `${this.hearts}/5`;
      if (this.dom.dashboard.totalXp) this.dom.dashboard.totalXp.textContent = `${this.totalXP.toLocaleString()} XP`;

      const currentInLevel = Math.max(0, this.totalXP - tier.baseXP);
      const neededInLevel = Math.max(1, tier.nextXP - tier.baseXP);
      const pct = Math.min(100, Math.round((currentInLevel / neededInLevel) * 100));
      if (this.dom.dashboard.xpFraction) {
        this.dom.dashboard.xpFraction.textContent = `${this.totalXP.toLocaleString()} / ${tier.nextXP.toLocaleString()} XP`;
      }
      if (this.dom.dashboard.xpProgressFill) {
        this.dom.dashboard.xpProgressFill.style.width = `${pct}%`;
      }

      const totalAns = this.stats.totalAnswered || 0;
      const totalCor = this.stats.totalCorrect || 0;
      const acc = totalAns > 0 ? Math.round((totalCor / totalAns) * 100) : 100;
      if (this.dom.dashboard.accuracyVal) {
        this.dom.dashboard.accuracyVal.textContent = `${acc}%`;
      }

      this.updateNavChips();
    }

    updateNavChips() {
      const navHearts = document.getElementById('nav-hearts-text');
      const navStreak = document.getElementById('nav-streak-text');
      const navXp = document.getElementById('nav-xp-text');
      const mobHearts = document.getElementById('mobile-hearts-text');
      const mobPts = document.getElementById('mobile-user-pts');

      if (navHearts) navHearts.textContent = `${this.hearts}/5`;
      if (navStreak) navStreak.textContent = `${this.streakDays} Hari`;
      if (navXp) navXp.textContent = `${this.totalXP.toLocaleString()} XP`;
      if (mobHearts) mobHearts.textContent = this.hearts;
      if (mobPts) mobPts.textContent = `${this.totalXP.toLocaleString()} XP`;
    }

    deductHeart() {
      this.hearts = Math.max(0, this.hearts - 1);
      safeStorage.setItem('ae_hearts', this.hearts);
      this.updateNavChips();
      this.updateDashboard();

      if (this.dom.hud.hearts) {
        this.dom.hud.hearts.textContent = `${this.hearts}/5`;
      }
      if (this.dom.hud.heartsItem) {
        this.dom.hud.heartsItem.classList.add('shake');
        setTimeout(() => this.dom.hud.heartsItem.classList.remove('shake'), 500);
      }
      if (this.hearts <= 0) {
        setTimeout(() => this.openHeartsModal(), 900);
      }
    }

    refillHearts() {
      this.hearts = 5;
      safeStorage.setItem('ae_hearts', '5');
      this.updateNavChips();
      this.updateDashboard();

      if (this.dom.hud.hearts) {
        this.dom.hud.hearts.textContent = '5/5';
      }
      if (this.dom.profile.heartsIcons) {
        this.dom.profile.heartsIcons.textContent = '❤️❤️❤️❤️❤️';
      }
      this.closeHeartsModal();
      this.showToast('💖 5 Hati (Lives) berhasil dipulihkan penuh!', 'success');
      this.sound.playSuccess();
    }

    openHeartsModal() {
      if (this.dom.modals.hearts) {
        this.dom.modals.hearts.classList.remove('hidden');
      }
    }

    closeHeartsModal() {
      if (this.dom.modals.hearts) {
        this.dom.modals.hearts.classList.add('hidden');
      }
    }

    showFloatingXP(xp, eventOrElement = null) {
      const container = document.getElementById('floating-xp-container');
      if (!container) return;

      const el = document.createElement('div');
      el.className = 'floating-xp-item';
      el.innerHTML = `+${xp} XP <span style="color:#fbbf24">⚡</span>`;

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2 - 40;

      if (eventOrElement && eventOrElement.getBoundingClientRect) {
        const rect = eventOrElement.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top;
      } else if (eventOrElement && eventOrElement.clientX) {
        x = eventOrElement.clientX;
        y = eventOrElement.clientY;
      }

      el.style.left = `${Math.max(40, Math.min(window.innerWidth - 80, x))}px`;
      el.style.top = `${Math.max(80, y)}px`;

      container.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }

    getBadgeCatalog() {
      return [
        { id: 'first-step', icon: '🌱', name: 'Langkah Pertama', desc: 'Menjawab soal latihan pertama Anda' },
        { id: 'vocab-master', icon: '🧠', name: 'Kamus Berjalan', desc: 'Mempelajari minimal 5 kosakata baru' },
        { id: 'grammar-guru', icon: '✍️', name: 'Pakar Tata Bahasa', desc: 'Menguasai minimal 5 latihan grammar' },
        { id: 'listening-pro', icon: '🎧', name: 'Telinga Emas', desc: 'Mengumpulkan 200+ poin di Listening Arena' },
        { id: 'speaking-star', icon: '🎙️', name: 'Bintang Percakapan', desc: 'Mencapai akurasi pengucapan >= 80%' },
        { id: 'streak-3', icon: '🔥', name: 'Semangat Membara', desc: 'Mencapai 3 streak jawaban benar beruntun' },
        { id: 'streak-7', icon: '⚡', name: 'Pantang Menyerah', desc: 'Mencapai 7 streak jawaban benar beruntun' },
        { id: 'combo-king', icon: '👑', name: 'Raja Combo', desc: 'Mencapai multiplier combo 2.0x' }
      ];
    }

    checkBadges(accuracy = 0) {
      const catalog = this.getBadgeCatalog();
      let newBadge = false;

      const award = (id) => {
        if (!this.badges.includes(id)) {
          this.badges.push(id);
          safeStorage.setItem('ae_badges', JSON.stringify(this.badges));
          const item = catalog.find(b => b.id === id);
          if (item) {
            this.showToast(`🏆 Lencana Baru Terbuka: ${item.name}!`, 'success');
            this.sound.playStreak();
          }
          newBadge = true;
        }
      };

      if (this.stats.totalAnswered >= 1) award('first-step');
      if (this.stats.vocabLearned >= 5) award('vocab-master');
      if (this.stats.grammarMastered >= 5) award('grammar-guru');
      if (this.stats.listeningScore >= 200) award('listening-pro');
      if (this.currentMode === 'shadowing' && accuracy >= 80) award('speaking-star');
      if (this.streak >= 3) award('streak-3');
      if (this.streak >= 7) award('streak-7');
      if (this.combo >= 6) award('combo-king');

      if (newBadge) {
        this.renderBadges();
      }
    }

    setLanguageDirection(dir) {
      this.sound.playClick();
      this.languageDirection = dir;

      const btnIdEn = document.getElementById('btn-dir-id-en');
      const btnEnId = document.getElementById('btn-dir-en-id');

      if (dir === 'id-to-en') {
        btnIdEn?.classList.add('active');
        btnEnId?.classList.remove('active');
        if (this.dom.hud.dirPill) this.dom.hud.dirPill.textContent = '🇮🇩 ➔ 🇬🇧';
      } else {
        btnEnId?.classList.add('active');
        btnIdEn?.classList.remove('active');
        if (this.dom.hud.dirPill) this.dom.hud.dirPill.textContent = '🇬🇧 ➔ 🇮🇩';
      }
    }

    initEvents() {
      // Main Desktop Tabs & Logo
      document.getElementById('nav-logo-btn')?.addEventListener('click', () => this.switchTab('landing'));
      document.getElementById('tab-nav-home')?.addEventListener('click', () => this.switchTab('landing'));
      document.getElementById('tab-nav-play')?.addEventListener('click', () => this.switchTab('play'));
      document.getElementById('tab-nav-progress')?.addEventListener('click', () => this.switchTab('progress'));
      document.getElementById('tab-nav-profile')?.addEventListener('click', () => this.switchTab('profile'));

      // Mobile Bottom Nav Bar
      document.getElementById('bnav-home')?.addEventListener('click', () => this.switchTab('landing'));
      document.getElementById('bnav-play')?.addEventListener('click', () => this.switchTab('play'));
      document.getElementById('bnav-progress')?.addEventListener('click', () => this.switchTab('progress'));
      document.getElementById('bnav-profile')?.addEventListener('click', () => this.switchTab('profile'));

      // Primary Hero / Dashboard Start CTA
      document.getElementById('btn-dashboard-start')?.addEventListener('click', () => {
        this.sound.playClick();
        this.startArena('vocabulary');
      });

      // Quick play from stats
      document.getElementById('btn-play-from-stats')?.addEventListener('click', () => {
        this.sound.playClick();
        this.switchTab('play');
      });

      // Modals triggers
      document.getElementById('btn-leaderboard-nav')?.addEventListener('click', () => this.openLeaderboard());
      document.getElementById('btn-close-leaderboard')?.addEventListener('click', () => this.closeModals());
      document.getElementById('btn-refresh-leaderboard')?.addEventListener('click', () => this.refreshCurrentModalData());

      // Hearts Refill actions
      document.getElementById('btn-refill-hearts')?.addEventListener('click', () => this.refillHearts());
      document.getElementById('btn-profile-refill-hearts')?.addEventListener('click', () => this.refillHearts());
      document.getElementById('btn-close-hearts')?.addEventListener('click', () => this.closeHeartsModal());
      document.getElementById('btn-hearts-home')?.addEventListener('click', () => {
        this.closeHeartsModal();
        this.switchTab('landing');
      });

      // Mobile Drawer triggers
      const hamburgerBtn = document.getElementById('btn-hamburger');
      const closeDrawerBtn = document.getElementById('btn-close-drawer');
      const drawerOverlay = document.getElementById('drawer-overlay');

      if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => this.openDrawer());
      if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => this.closeDrawer());
      if (drawerOverlay) drawerOverlay.addEventListener('click', () => this.closeDrawer());

      document.getElementById('btn-drawer-home')?.addEventListener('click', () => { this.closeDrawer(); this.switchTab('landing'); });
      document.getElementById('btn-drawer-play')?.addEventListener('click', () => { this.closeDrawer(); this.switchTab('play'); });
      document.getElementById('btn-drawer-progress')?.addEventListener('click', () => { this.closeDrawer(); this.switchTab('progress'); });
      document.getElementById('btn-drawer-profile')?.addEventListener('click', () => { this.closeDrawer(); this.switchTab('profile'); });

      document.getElementById('btn-drawer-leaderboard')?.addEventListener('click', () => {
        this.closeDrawer();
        this.openLeaderboard();
      });

      document.getElementById('btn-drawer-settings')?.addEventListener('click', () => {
        this.closeDrawer();
        this.openSettings();
      });

      document.getElementById('btn-drawer-login')?.addEventListener('click', () => {
        this.closeDrawer();
        this.openAuthModal();
      });

      document.getElementById('btn-drawer-logout')?.addEventListener('click', () => {
        this.closeDrawer();
        AuthManager.logout();
        this.showToast('Anda telah keluar dari akun.', 'info');
      });

      // Profile View Action Links
      document.getElementById('btn-profile-to-leaderboard')?.addEventListener('click', () => this.openLeaderboard());
      document.getElementById('btn-profile-to-settings')?.addEventListener('click', () => this.openSettings());

      // Tab switcher in Modal
      if (this.dom.modals.tabLeaderboardBtn) {
        this.dom.modals.tabLeaderboardBtn.addEventListener('click', () => this.switchModalTab('leaderboard'));
      }
      if (this.dom.modals.tabMemoryBtn) {
        this.dom.modals.tabMemoryBtn.addEventListener('click', () => this.switchModalTab('memory'));
      }

      // Settings
      document.getElementById('btn-settings-nav')?.addEventListener('click', () => this.openSettings());
      document.getElementById('btn-close-settings')?.addEventListener('click', () => this.closeModals());
      document.getElementById('settings-form')?.addEventListener('submit', (e) => this.saveSettings(e));
      document.getElementById('btn-reset-settings')?.addEventListener('click', () => this.resetSettings());

      // Language Direction Switcher (Landing)
      const btnIdEn = document.getElementById('btn-dir-id-en');
      const btnEnId = document.getElementById('btn-dir-en-id');
      if (btnIdEn) btnIdEn.addEventListener('click', () => this.setLanguageDirection('id-to-en'));
      if (btnEnId) btnEnId.addEventListener('click', () => this.setLanguageDirection('en-to-id'));

      // Mode Selection Cards
      document.querySelectorAll('.btn-play-mode').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.sound.playClick();
          const mode = e.currentTarget.dataset.mode;
          this.startArena(mode);
        });
      });

      // Level Filter Pills on Landing View
      document.querySelectorAll('.btn-level-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          this.sound.playClick();
          const lvl = e.currentTarget.dataset.level || 'all';
          this.setLevelPreference(lvl);
          const lvlLabels = {
            all: 'Semua Level (Beginner - Advanced)',
            Beginner: 'Beginner (Pemula)',
            Elementary: 'Elementary (Dasar)',
            Intermediate: 'Intermediate (Menengah)',
            'Upper-Intermediate': 'Upper-Intermediate (Menengah Atas)',
            Advanced: 'Advanced (Tingkat Mahir)'
          };
          this.showToast(`Filter tingkat kesulitan: ${lvlLabels[lvl] || lvl}`, 'info');
        });
      });

      // Quit Game
      document.getElementById('btn-quit-game')?.addEventListener('click', () => {
        this.speech.stopListening();
        if (window.history.state && window.history.state.arenaView === 'game') {
          window.history.back();
        } else {
          this.switchTab('landing');
        }
      });

      // Mobile hardware back button
      window.addEventListener('popstate', (e) => {
        const activeModal = document.querySelector('.modal-overlay:not(.hidden)');
        if (activeModal) {
          activeModal.classList.add('hidden');
          return;
        }
        const drawer = document.getElementById('mobile-drawer');
        if (drawer && drawer.classList.contains('open')) {
          this.closeDrawer();
          return;
        }
        if (this.currentView === 'game' || this.currentView === 'result') {
          this.speech.stopListening();
          this.switchTab('landing');
        }
      });

      // In-game Speed Select
      if (this.dom.challenge.speedSelect) {
        this.dom.challenge.speedSelect.addEventListener('change', (e) => {
          const norm = normalizeRate(e.target.value);
          const numVal = parseFloat(norm);
          this.speech.speechRate = numVal;
          safeStorage.setItem('cfg_voice_rate', norm);
          const cfgRate = document.getElementById('cfg-voice-rate');
          if (cfgRate) cfgRate.value = norm;
          this.showToast(`Kecepatan baca audio diatur: ${numVal}x`, 'info');

          const q = this.questions[this.currentIndex];
          if (q) {
            const accent = this.dom.challenge.accentSelect ? this.dom.challenge.accentSelect.value : 'en-US';
            const textToSpeak = cleanText(q.en || q.target);
            this.speech.speak(textToSpeak, accent, numVal);
          }
        });
      }

      // Audio TTS Triggers (Listen & Replay)
      const playCurrentAudio = () => {
        const q = this.questions[this.currentIndex];
        if (!q) return;
        const accent = this.dom.challenge.accentSelect ? this.dom.challenge.accentSelect.value : 'en-US';
        const textToSpeak = cleanText(q.en || q.target);
        const currentSpeed = this.dom.challenge.speedSelect ? parseFloat(this.dom.challenge.speedSelect.value) : this.speech.speechRate;
        this.speech.speak(textToSpeak, accent, currentSpeed);
      };

      this.dom.challenge.audioBtn?.addEventListener('click', playCurrentAudio);
      this.dom.challenge.replayBtn?.addEventListener('click', playCurrentAudio);

      // Sentence Builder Controls
      this.dom.builder.undoBtn?.addEventListener('click', () => this.undoBuilderWord());
      this.dom.builder.clearBtn?.addEventListener('click', () => this.clearBuilderWords());
      this.dom.builder.checkBtn?.addEventListener('click', () => this.checkBuilderSentence());

      // Microphone Toggle
      this.dom.mic.toggleBtn?.addEventListener('click', () => this.toggleMicrophone());

      // Manual Submit
      this.dom.mic.manualSubmit?.addEventListener('click', () => {
        const val = this.dom.mic.manualInput.value.trim();
        if (val) {
          this.dom.mic.transcript.textContent = `"${val}"`;
          this.evaluateAnswer(val);
        }
      });

      this.dom.mic.manualInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.dom.mic.manualSubmit.click();
        }
      });

      // Next Question
      this.dom.evaluation.nextBtn?.addEventListener('click', () => {
        this.sound.playClick();
        this.nextQuestion();
      });

      // Result Actions
      this.dom.result.playAgainBtn?.addEventListener('click', () => this.startArena(this.currentMode));
      this.dom.result.homeBtn?.addEventListener('click', () => this.switchTab('landing'));
      this.dom.result.viewLeaderboardBtn?.addEventListener('click', () => this.openLeaderboard());
      this.dom.result.submitBtn?.addEventListener('click', () => this.submitScoreToLeaderboard());

      // Authentication Triggers
      document.getElementById('btn-login-nav')?.addEventListener('click', () => this.openAuthModal());
      document.getElementById('btn-nav-logout')?.addEventListener('click', () => {
        AuthManager.logout();
        this.showToast('Anda telah keluar dari sesi.', 'info');
      });
      document.getElementById('btn-close-auth')?.addEventListener('click', () => this.closeModals());

      // Demo login shortcuts
      document.getElementById('btn-demo-admin')?.addEventListener('click', () => {
        this.fillAuthForm('jefry.m95@gmail.com', 'admin123');
      });
      document.getElementById('btn-demo-student')?.addEventListener('click', () => {
        this.fillAuthForm('siswa1@english.com', 'siswa123');
      });

      this.dom.auth.form?.addEventListener('submit', (e) => this.handleLoginSubmit(e));
    }

    fillAuthForm(email, password) {
      if (this.dom.auth.email) this.dom.auth.email.value = email;
      if (this.dom.auth.password) this.dom.auth.password.value = password;
      if (this.dom.auth.errorBox) this.dom.auth.errorBox.classList.add('hidden');
    }

    openAuthModal(customNotice = '') {
      if (this.dom.modals.auth) {
        this.dom.modals.auth.classList.remove('hidden');
        if (this.dom.auth.errorBox) {
          if (customNotice) {
            this.dom.auth.errorBox.textContent = customNotice;
            this.dom.auth.errorBox.classList.remove('hidden');
          } else {
            this.dom.auth.errorBox.classList.add('hidden');
          }
        }
      }
    }

    async handleLoginSubmit(e) {
      e.preventDefault();
      const email = this.dom.auth.email.value.trim();
      const pass = this.dom.auth.password.value.trim();
      const remember = this.dom.auth.remember ? this.dom.auth.remember.checked : true;

      this.dom.auth.submitBtn.disabled = true;
      this.dom.auth.submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Memverifikasi...';
      if (this.dom.auth.errorBox) this.dom.auth.errorBox.classList.add('hidden');

      const res = await AuthManager.login(email, pass, remember);

      this.dom.auth.submitBtn.disabled = false;
      this.dom.auth.submitBtn.innerHTML = '<span class="btn-icon">🚀</span> Masuk & Mulai Belajar';

      if (res.success) {
        this.closeModals();
        this.updateDashboard();
        this.showToast(`Selamat datang, ${res.user.name}! Skor Anda siap diakumulasikan.`, 'success');
        if (this.pendingMode) {
          const modeToPlay = this.pendingMode;
          this.pendingMode = null;
          this.startArena(modeToPlay);
        }
      } else {
        if (this.dom.auth.errorBox) {
          this.dom.auth.errorBox.textContent = res.message;
          this.dom.auth.errorBox.classList.remove('hidden');
        }
      }
    }

    startArena(mode) {
      // Lives Check
      if (this.hearts <= 0) {
        this.openHeartsModal();
        this.showToast('Hati Anda habis! Silakan pulihkan hati untuk mulai bermain.', 'info');
        return;
      }

      this.currentMode = mode;
      const bank = QUESTION_BANK[mode] || QUESTION_BANK.shadowing;

      // Filter questions by user level preference
      let filteredBank = bank;
      if (mode !== 'ielts' && mode !== 'toefl' && this.levelPreference && this.levelPreference !== 'all') {
        const matched = bank.filter(q => (q.level || '').toLowerCase() === this.levelPreference.toLowerCase());
        if (matched.length > 0) {
          filteredBank = matched;
        }
      }

      this.questions = [...filteredBank].sort(() => Math.random() - 0.5);
      this.currentIndex = 0;
      this.score = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.combo = 0;
      this.history = [];

      const modeTitles = {
        shadowing: 'Speaking & Shadowing Arena',
        listening: 'Listening Dictation Arena',
        vocabulary: 'Vocabulary Collocation Arena',
        grammar: 'Murphy Grammar Quest',
        sentence_builder: 'Sentence Builder Quest',
        ielts: 'IELTS Academic Simulation (Band 0-9)',
        toefl: 'TOEFL iBT Simulation (Scale 0-30)'
      };
      if (this.dom.hud.modePill) {
        this.dom.hud.modePill.textContent = modeTitles[mode] || 'Arena';
      }
      if (this.dom.hud.dirPill) {
        this.dom.hud.dirPill.textContent = this.languageDirection === 'id-to-en' ? '🇮🇩 ➔ 🇬🇧' : '🇬🇧 ➔ 🇮🇩';
      }

      this.switchView('game');
      this.renderQuestion();
    }

    renderQuestion() {
      const q = this.questions[this.currentIndex];
      if (!q) {
        this.finishArena();
        return;
      }

      // Update HUD
      if (this.dom.hud.score) this.dom.hud.score.textContent = this.score;
      if (this.dom.hud.streak) this.dom.hud.streak.textContent = this.streak > 0 ? `${this.streak}🔥` : '0';
      if (this.dom.hud.progress) this.dom.hud.progress.textContent = `${this.currentIndex + 1}/${this.questions.length}`;
      if (this.dom.hud.hearts) this.dom.hud.hearts.textContent = `${this.hearts}/5`;
      if (this.dom.hud.combo) this.dom.hud.combo.textContent = this.getComboMultiplierLabel();

      // Update Meta
      if (this.dom.challenge.category) this.dom.challenge.category.textContent = q.category || 'General Practice';
      if (this.dom.challenge.difficulty) this.dom.challenge.difficulty.textContent = `Level: ${q.level || 'Beginner'}`;

      // Reset Inputs & Evaluation Panel
      this.dom.evaluation.panel.classList.add('hidden');
      if (this.dom.evaluation.translationCard) this.dom.evaluation.translationCard.classList.add('hidden');
      if (this.dom.evaluation.exampleCard) this.dom.evaluation.exampleCard.classList.add('hidden');
      if (this.dom.evaluation.grammarCard) this.dom.evaluation.grammarCard.classList.add('hidden');
      if (this.dom.evaluation.phoneticBox) this.dom.evaluation.phoneticBox.classList.add('hidden');

      this.dom.mic.transcript.textContent = 'Menunggu input suara dari mikrofon...';
      this.dom.mic.manualInput.value = '';
      this.dom.mic.toggleBtn.classList.remove('recording');
      this.dom.mic.status.textContent = 'Tekan mikrofon untuk berbicara';

      // CRITICAL: Hide Indonesian translations and phonetic before user answers!
      this.dom.challenge.targetPhonetic.classList.add('hidden');
      this.dom.challenge.targetPhonetic.textContent = '';
      this.dom.challenge.targetTranslation.classList.add('hidden');
      this.dom.challenge.targetTranslation.textContent = '';

      // Reset specific containers
      if (this.dom.challenge.vocabVisualBadge) this.dom.challenge.vocabVisualBadge.classList.add('hidden');
      if (this.dom.builder.container) this.dom.builder.container.classList.add('hidden');
      if (this.dom.challenge.optionsContainer) this.dom.challenge.optionsContainer.classList.add('hidden');

      const isIdToEn = (this.languageDirection === 'id-to-en');

      if (this.currentMode === 'sentence_builder') {
        // Sentence Builder
        this.dom.challenge.instruction.textContent = '🧩 Susun kata-kata acak berikut menjadi kalimat Bahasa Inggris yang utuh & benar:';
        this.dom.challenge.targetPhrase.textContent = `"${cleanText(q.id_translation || q.translation)}"`;
        this.dom.mic.section.classList.add('hidden');
        this.renderSentenceBuilder(q);

      } else if (this.currentMode === 'vocabulary') {
        // Game Vocabulary: Tebak Kosakata Bahasa Inggris
        this.dom.challenge.instruction.textContent = isIdToEn
          ? 'Pilih padanan kata Bahasa Inggris yang tepat untuk kata berikut:'
          : 'Pilih arti kosakata Bahasa Indonesia yang paling tepat untuk kata berikut:';

        const promptText = cleanText(q.word || q.missingWord || q.en || q.target);
        this.dom.challenge.targetPhrase.textContent = `"${promptText}"`;

        // Vocab illustration badge with emoji
        if (this.dom.challenge.vocabVisualBadge) {
          const emoji = q.emoji || '📖';
          if (this.dom.challenge.vocabEmojiIcon) this.dom.challenge.vocabEmojiIcon.textContent = emoji;
          this.dom.challenge.vocabVisualBadge.classList.remove('hidden');
        }

        this.renderMultipleChoiceOptions(q, isIdToEn);
        this.dom.mic.section.classList.remove('hidden');

      } else if (this.currentMode === 'grammar') {
        // Game Grammar
        this.dom.challenge.instruction.textContent = '✍️ Pilih kata yang paling tepat untuk melengkapi kalimat berikut:';
        const grammarPrompt = cleanText(q.prompt_en || q.prompt_id || q.en || q.target);
        this.dom.challenge.targetPhrase.textContent = `"${grammarPrompt}"`;

        this.renderMultipleChoiceOptions(q, isIdToEn);
        this.dom.mic.section.classList.remove('hidden');

      } else if (this.currentMode === 'listening') {
        // Game Listening
        this.dom.challenge.instruction.textContent = '🎧 Dengarkan audio Bahasa Inggris berikut dengan cermat, lalu pilih kalimat yang tepat:';
        this.dom.challenge.targetPhrase.textContent = '•••••••••••••••••••••••••••••';

        this.renderMultipleChoiceOptions(q, isIdToEn);
        this.dom.mic.section.classList.remove('hidden');

        // Auto-play audio after 400ms
        setTimeout(() => {
          const currentSpeed = this.dom.challenge.speedSelect ? parseFloat(this.dom.challenge.speedSelect.value) : this.speech.speechRate;
          this.speech.speak(cleanText(q.en || q.target), this.dom.challenge.accentSelect.value, currentSpeed);
        }, 400);

      } else if (this.currentMode === 'ielts' || this.currentMode === 'toefl') {
        // Academic Modes
        if (this.currentMode === 'ielts') {
          this.dom.challenge.instruction.textContent = `🎯 IELTS Academic Test (${q.level || 'Band 7.5 - 9.0'}): Selesaikan soal leksikal atau jawab via Mic:`;
        } else {
          this.dom.challenge.instruction.textContent = `🏛️ TOEFL iBT Test Simulation (${q.level || 'Scale 0-30'}): Lengkapi passage ilmiah atau jawab via Mic:`;
        }
        const promptText = cleanText(q.prompt_en || q.en || q.target);
        this.dom.challenge.targetPhrase.textContent = `"${promptText}"`;
        this.renderMultipleChoiceOptions(q, isIdToEn);
        this.dom.mic.section.classList.remove('hidden');

      } else {
        // Speaking & Shadowing Practice
        if (isIdToEn) {
          this.dom.challenge.instruction.textContent = '🇮🇩 Lihat kalimat Bahasa Indonesia di bawah, lalu klik Mic dan ucapkan dalam Bahasa Inggris:';
          this.dom.challenge.targetPhrase.textContent = `"${cleanText(q.translation || q.id_translation)}"`;
        } else {
          this.dom.challenge.instruction.textContent = '🇬🇧 Dengarkan kalimat Bahasa Inggris, lalu ucapkan kembali dengan intonasi natural:';
          this.dom.challenge.targetPhrase.textContent = `"${cleanText(q.en || q.target)}"`;
        }
        this.dom.mic.section.classList.remove('hidden');
      }
    }

    renderMultipleChoiceOptions(q, isIdToEn) {
      let opts = [];
      if (this.currentMode === 'vocabulary') {
        opts = (q.options_id && q.options_id.length > 0) ? q.options_id : (q.options || []);
      } else {
        opts = (q.options_en && q.options_en.length > 0) ? q.options_en : (q.options || []);
      }

      if (opts && opts.length > 0) {
        this.dom.challenge.optionsContainer.innerHTML = '';
        this.dom.challenge.optionsContainer.classList.remove('hidden');

        // Dynamically shuffle options
        const displayList = opts.map((opt, origIdx) => ({
          text: cleanText(opt),
          isCorrect: (origIdx === (q.correctIndex !== undefined ? q.correctIndex : 0))
        }));

        for (let i = displayList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [displayList[i], displayList[j]] = [displayList[j], displayList[i]];
        }

        displayList.forEach((item, displayIdx) => {
          const btn = document.createElement('button');
          btn.className = 'btn-option';
          btn.textContent = `${String.fromCharCode(65 + displayIdx)}. ${item.text}`;
          btn.addEventListener('click', (evt) => {
            this.evaluateMultipleChoiceRandomized(displayIdx, btn, displayList, evt);
          });
          this.dom.challenge.optionsContainer.appendChild(btn);
        });
      }
    }

    renderSentenceBuilder(q) {
      this.dom.builder.container.classList.remove('hidden');
      const rawTarget = cleanText(q.en || q.target);
      this.builderTarget = rawTarget;
      this.selectedWords = [];

      let words = [];
      if (Array.isArray(q.words) && q.words.length > 0) {
        words = q.words.map(w => cleanText(w));
      } else {
        words = rawTarget.split(/\s+/).filter(Boolean);
      }

      // Scramble words
      const scrambled = [...words].sort(() => Math.random() - 0.5);
      if (scrambled.join(' ') === words.join(' ') && scrambled.length > 1) {
        scrambled.reverse();
      }

      this.wordBank = scrambled.map((text, idx) => ({ id: idx, text, used: false }));
      this.renderBuilderUI();
    }

    renderBuilderUI() {
      // Answer Zone
      this.dom.builder.answerZone.innerHTML = '';
      if (this.selectedWords.length === 0) {
        this.dom.builder.placeholder.classList.remove('hidden');
        this.dom.builder.answerZone.appendChild(this.dom.builder.placeholder);
      } else {
        this.dom.builder.placeholder.classList.add('hidden');
        this.selectedWords.forEach((item, selIdx) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'builder-word-chip in-answer';
          chip.textContent = item.text;
          chip.title = 'Klik untuk mengembalikan kata ke bank';
          chip.addEventListener('click', () => {
            this.sound.playClick();
            this.selectedWords.splice(selIdx, 1);
            const bankItem = this.wordBank.find(b => b.id === item.id);
            if (bankItem) bankItem.used = false;
            this.renderBuilderUI();
          });
          this.dom.builder.answerZone.appendChild(chip);
        });
      }

      // Word Bank
      this.dom.builder.wordBank.innerHTML = '';
      this.wordBank.forEach(item => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `builder-word-chip ${item.used ? 'used' : ''}`;
        chip.textContent = item.text;
        chip.disabled = item.used;
        chip.addEventListener('click', () => {
          if (item.used) return;
          this.sound.playClick();
          item.used = true;
          this.selectedWords.push({ id: item.id, text: item.text });
          this.renderBuilderUI();
        });
        this.dom.builder.wordBank.appendChild(chip);
      });
    }

    undoBuilderWord() {
      if (this.selectedWords.length === 0) return;
      this.sound.playClick();
      const last = this.selectedWords.pop();
      const bankItem = this.wordBank.find(b => b.id === last.id);
      if (bankItem) bankItem.used = false;
      this.renderBuilderUI();
    }

    clearBuilderWords() {
      this.sound.playClick();
      this.selectedWords = [];
      this.wordBank.forEach(b => b.used = false);
      this.renderBuilderUI();
    }

    checkBuilderSentence() {
      if (this.selectedWords.length === 0) {
        this.showToast('Ketuk kata-kata pada bank kata terlebih dahulu untuk menyusun kalimat!', 'info');
        return;
      }
      const userSentence = this.selectedWords.map(w => w.text).join(' ');
      const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
      const isMatch = (clean(userSentence) === clean(this.builderTarget));
      this.evaluateAnswer(userSentence, isMatch, this.dom.builder.checkBtn);
    }

    evaluateMultipleChoiceRandomized(selectedIdx, btnElement, displayList, evt = null) {
      const allButtons = this.dom.challenge.optionsContainer.querySelectorAll('.btn-option');
      allButtons.forEach((b, idx) => {
        b.disabled = true;
        if (displayList[idx] && displayList[idx].isCorrect) {
          b.classList.add('correct');
        } else if (idx === selectedIdx && !displayList[idx].isCorrect) {
          b.classList.add('wrong');
        }
      });

      const chosenItem = displayList[selectedIdx];
      this.evaluateAnswer(chosenItem.text, chosenItem.isCorrect, btnElement);
    }

    toggleMicrophone() {
      this.sound.init();

      if (this.speech.isRecording) {
        this.speech.stopListening();
        this.dom.mic.toggleBtn.classList.remove('recording');
        this.dom.mic.status.textContent = 'Tekan mikrofon untuk berbicara';
      } else {
        this.dom.mic.toggleBtn.classList.add('recording');
        const isIdToEn = (this.languageDirection === 'id-to-en');
        const lang = isIdToEn ? (this.dom.challenge.accentSelect.value || 'en-US') : 'id-ID';

        this.dom.mic.status.textContent = isIdToEn ? 'Mendengarkan... Bicaralah dalam Bahasa Inggris!' : 'Mendengarkan... Bicaralah dalam Bahasa Indonesia!';
        this.dom.mic.transcript.textContent = 'Mendengarkan...';

        this.speech.startListening(
          lang,
          (interim) => {
            this.dom.mic.transcript.textContent = `"${interim}..."`;
          },
          (final) => {
            this.dom.mic.toggleBtn.classList.remove('recording');
            this.dom.mic.status.textContent = 'Mengevaluasi suara...';
            this.dom.mic.transcript.textContent = `"${final}"`;
            this.evaluateAnswer(final, null, this.dom.mic.toggleBtn);
          },
          (err) => {
            this.dom.mic.toggleBtn.classList.remove('recording');
            this.dom.mic.status.textContent = 'Tekan mikrofon untuk berbicara';
            this.showToast(`Info Mikrofon: ${err}`, 'info');
          }
        );
      }
    }

    async evaluateAnswer(userAnswer, predeterminedCorrect = null, sourceElement = null) {
      this.speech.stopListening();
      const q = this.questions[this.currentIndex];
      if (!q) return;

      const isIdToEn = (this.languageDirection === 'id-to-en');
      let targetExpected = isIdToEn ? (q.missingWord || q.en || q.target) : (q.translation || q.id_translation);

      this.dom.evaluation.panel.classList.remove('hidden');
      this.dom.evaluation.aiFeedback.textContent = 'AI Teacher sedang menganalisis jawaban dan intonasi Anda...';

      let accuracy = 100;
      let verdict = 'Bagus Sekali! 🎉';
      let feedback = 'Pengucapan dan pilihan kata Anda sangat tepat.';

      if (predeterminedCorrect !== null) {
        accuracy = predeterminedCorrect ? 100 : 25;
        verdict = predeterminedCorrect ? 'Bagus Sekali! Jawaban Tepat 🎉' : 'Jawaban Kurang Tepat 💪';
        feedback = predeterminedCorrect
          ? 'Pemahaman kosakata dan struktur kalimat Anda sudah sesuai!'
          : 'Perhatikan arti dan struktur kalimat yang benar pada kartu evaluasi di bawah.';
      } else {
        const apiKey = safeStorage.getItem('cfg_gemini_key') || '';
        const dirText = isIdToEn ? 'Indonesia ke English' : 'English ke Indonesia';
        const evalResult = await GeminiService.evaluateAnswer(apiKey, targetExpected, userAnswer, this.currentMode, dirText);
        accuracy = evalResult.accuracy;
        verdict = evalResult.verdict;
        feedback = evalResult.feedback;
      }

      const isSuccess = (accuracy >= 70);

      if (isSuccess) {
        this.streak += 1;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;
        this.combo += 1;

        const multiplier = this.getComboMultiplier();
        const streakBonus = (this.streak > 1) ? (this.streak * 10) : 0;
        const earnedXP = Math.round((accuracy + streakBonus) * multiplier);

        this.score += earnedXP;
        this.totalXP += earnedXP;
        safeStorage.setItem('ae_total_xp', this.totalXP);

        // Track stats
        this.stats.totalCorrect = (this.stats.totalCorrect || 0) + 1;
        if (this.currentMode === 'vocabulary') this.stats.vocabLearned = (this.stats.vocabLearned || 0) + 1;
        if (this.currentMode === 'grammar') this.stats.grammarMastered = (this.stats.grammarMastered || 0) + 1;
        if (this.currentMode === 'listening') this.stats.listeningScore = (this.stats.listeningScore || 0) + earnedXP;
        if (this.currentMode === 'shadowing') this.stats.speakingScore = (this.stats.speakingScore || 0) + earnedXP;

        // Floating XP Animation
        this.showFloatingXP(earnedXP, sourceElement);

        if (this.streak > 1) {
          this.sound.playStreak();
        } else {
          this.sound.playSuccess();
        }
      } else {
        this.streak = 0;
        this.combo = 0;
        this.deductHeart();
        this.sound.playWrong();
      }

      this.stats.totalAnswered = (this.stats.totalAnswered || 0) + 1;
      safeStorage.setItem('ae_stats', JSON.stringify(this.stats));

      // Check for unlocked Badges
      this.checkBadges(accuracy);

      // Record to session history
      this.history.push({
        questionNumber: this.currentIndex + 1,
        direction: isIdToEn ? 'ID -> EN' : 'EN -> ID',
        target: targetExpected,
        heard: userAnswer,
        accuracy: accuracy,
        feedback: feedback
      });

      // Update HUD
      if (this.dom.hud.score) this.dom.hud.score.textContent = this.score;
      if (this.dom.hud.streak) this.dom.hud.streak.textContent = this.streak > 0 ? `${this.streak}🔥` : '0';
      if (this.dom.hud.combo) this.dom.hud.combo.textContent = this.getComboMultiplierLabel();

      // Update Evaluation Panel UI
      this.dom.evaluation.scoreBadge.textContent = `Akurasi: ${accuracy}%`;
      this.dom.evaluation.scoreBadge.className = 'score-badge ' + (accuracy >= 80 ? '' : (accuracy >= 50 ? 'medium' : 'low'));
      this.dom.evaluation.verdict.textContent = verdict;
      this.dom.evaluation.compTarget.textContent = targetExpected;
      this.dom.evaluation.compHeard.textContent = userAnswer || '(tidak terdengar suara / tidak memilih)';
      this.dom.evaluation.aiFeedback.textContent = feedback;

      // REVEAL CARDS (Definitions, Example, Grammar, Phonetic) strictly AFTER answering:
      if (this.dom.evaluation.translationCard && this.dom.evaluation.translationText) {
        const trans = cleanText(q.id_translation || q.translation);
        if (trans) {
          this.dom.evaluation.translationText.textContent = trans;
          this.dom.evaluation.translationCard.classList.remove('hidden');
        }
      }

      if (this.dom.evaluation.exampleCard && this.dom.evaluation.exampleText) {
        const eg = cleanText(q.example || q.en || q.target);
        const egId = cleanText(q.example_id);
        if (eg && this.currentMode !== 'shadowing') {
          this.dom.evaluation.exampleText.innerHTML = `<strong>"${this.escapeHtml(eg)}"</strong>${egId ? `<br><span style="color:#a5b4fc; font-size:0.9rem; display:inline-block; margin-top:4px;">(Artinya: ${this.escapeHtml(egId)})</span>` : ''}`;
          this.dom.evaluation.exampleCard.classList.remove('hidden');
        }
      }

      if (this.dom.evaluation.grammarCard && this.dom.evaluation.grammarText) {
        const gr = cleanText(q.notes);
        if (gr) {
          this.dom.evaluation.grammarText.textContent = gr;
          this.dom.evaluation.grammarCard.classList.remove('hidden');
        }
      }

      const phoneticText = q.phonetic || '';
      if (this.dom.evaluation.phoneticBox && this.dom.evaluation.phoneticText && phoneticText) {
        this.dom.evaluation.phoneticText.textContent = phoneticText;
        this.dom.evaluation.phoneticBox.classList.remove('hidden');
      }

      // If in listening mode, reveal target text now
      if (this.currentMode === 'listening') {
        this.dom.challenge.targetPhrase.textContent = `"${cleanText(q.en || q.target)}"`;
      }

      this.updateDashboard();
    }

    nextQuestion() {
      this.currentIndex += 1;
      this.renderQuestion();
    }

    finishArena() {
      this.switchView('result');
      this.sound.playSuccess();

      this.stats.gamesPlayed = (this.stats.gamesPlayed || 0) + 1;
      safeStorage.setItem('ae_stats', JSON.stringify(this.stats));

      const totalQuestions = this.history.length || 1;
      const sumAccuracy = this.history.reduce((acc, h) => acc + h.accuracy, 0);
      const avgAcc = Math.round(sumAccuracy / totalQuestions);

      let levelName = 'Beginner';
      if (avgAcc >= 90) levelName = 'Expert / Native Rhythm';
      else if (avgAcc >= 75) levelName = 'Upper-Intermediate';
      else if (avgAcc >= 60) levelName = 'Intermediate';

      const dirLabel = this.languageDirection === 'id-to-en' ? 'ID ➔ EN' : 'EN ➔ ID';
      if (this.dom.result.modeName) this.dom.result.modeName.textContent = `${this.dom.hud.modePill ? this.dom.hud.modePill.textContent : 'Arena'} (${dirLabel})`;
      if (this.dom.result.totalScore) this.dom.result.totalScore.textContent = `+${this.score} PTS`;
      if (this.dom.result.avgAccuracy) this.dom.result.avgAccuracy.textContent = `${avgAcc}%`;
      if (this.dom.result.maxStreak) this.dom.result.maxStreak.textContent = `${this.maxStreak}🔥`;
      if (this.dom.result.level) this.dom.result.level.textContent = levelName;
      if (this.dom.result.statusMsg) this.dom.result.statusMsg.textContent = '';

      if (this.dom.result.cumulativeScore) {
        this.dom.result.cumulativeScore.textContent = `${this.totalXP.toLocaleString()} PTS`;
      }

      if (AuthManager.isLoggedIn()) {
        if (this.dom.result.playerNameInput) {
          this.dom.result.playerNameInput.value = AuthManager.currentUser.name;
        }
        this.submitScoreToLeaderboard();
      }

      this.updateDashboard();
    }

    async submitScoreToLeaderboard() {
      const name = (this.dom.result.playerNameInput && this.dom.result.playerNameInput.value.trim()) || (AuthManager.isLoggedIn() ? AuthManager.currentUser.name : 'Player 1');
      const sumAccuracy = this.history.reduce((acc, h) => acc + h.accuracy, 0);
      const avgAcc = Math.round(sumAccuracy / (this.history.length || 1));
      const dirLabel = this.languageDirection === 'id-to-en' ? 'ID -> EN' : 'EN -> ID';

      this.dom.result.submitBtn.disabled = true;
      this.dom.result.submitBtn.textContent = 'Menyimpan & Sinkronkan...';

      const entry = {
        userEmail: AuthManager.isLoggedIn() ? AuthManager.currentUser.email : '',
        playerName: name,
        gameMode: `${this.dom.hud.modePill ? this.dom.hud.modePill.textContent : 'Arena'} (${dirLabel})`,
        direction: dirLabel,
        score: this.score,
        accuracy: avgAcc,
        level: AuthManager.isLoggedIn() ? AuthManager.currentUser.level : this.history.length,
        timestamp: new Date().toISOString(),
        history: this.history
      };

      const result = await LeaderboardService.submitScore(entry);

      if (AuthManager.isLoggedIn()) {
        AuthManager.addScore(this.score);
      }

      this.dom.result.submitBtn.disabled = false;
      this.dom.result.submitBtn.textContent = '✓ Tersimpan di Database!';
      if (this.dom.result.statusMsg) {
        this.dom.result.statusMsg.textContent = `${result.message} Skor Anda aman dan akan berlanjut besok.`;
        this.dom.result.statusMsg.className = 'status-message success';
      }

      this.showToast('✓ Progres berhasil disinkronkan ke Cloud Database!', 'success');
    }

    openLeaderboard() {
      if (this.dom.modals.leaderboard) {
        this.dom.modals.leaderboard.classList.remove('hidden');
        this.switchModalTab('leaderboard');
      }
    }

    switchModalTab(tabName) {
      if (tabName === 'leaderboard') {
        this.dom.modals.tabLeaderboardBtn?.classList.add('active');
        this.dom.modals.tabMemoryBtn?.classList.remove('active');
        this.dom.modals.containerLeaderboard?.classList.remove('hidden');
        this.dom.modals.containerMemory?.classList.add('hidden');
        this.loadLeaderboardData();
      } else {
        this.dom.modals.tabMemoryBtn?.classList.add('active');
        this.dom.modals.tabLeaderboardBtn?.classList.remove('active');
        this.dom.modals.containerMemory?.classList.remove('hidden');
        this.dom.modals.containerLeaderboard?.classList.add('hidden');
        this.loadMemoryData();
      }
    }

    refreshCurrentModalData() {
      if (this.dom.modals.tabMemoryBtn?.classList.contains('active')) {
        this.loadMemoryData();
      } else {
        this.loadLeaderboardData();
      }
    }

    async loadLeaderboardData() {
      if (!this.dom.modals.tbody) return;
      this.dom.modals.tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Mengambil ranking dari Cloud Database...</td></tr>';

      const res = await LeaderboardService.fetchLeaderboard();
      if (this.dom.modals.syncStatus) this.dom.modals.syncStatus.textContent = res.source;

      if (!res.data || res.data.length === 0) {
        this.dom.modals.tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Belum ada skor. Jadilah yang pertama bermain!</td></tr>';
        return;
      }

      this.dom.modals.tbody.innerHTML = '';
      res.data.forEach((row, idx) => {
        const tr = document.createElement('tr');
        const rankClass = idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : (idx === 2 ? 'rank-3' : ''));
        const medal = idx === 0 ? '🥇 1' : (idx === 1 ? '🥈 2' : (idx === 2 ? '🥉 3' : `${idx + 1}`));
        const dateStr = row.timestamp ? new Date(row.timestamp).toLocaleDateString() : '-';

        tr.innerHTML = `
          <td class="rank-cell ${rankClass}">${medal}</td>
          <td><strong>${this.escapeHtml(row.playerName)}</strong></td>
          <td>${this.escapeHtml(row.gameMode)}</td>
          <td><span style="color: #6366f1; font-weight:700;">${row.score}</span></td>
          <td>${row.accuracy}%</td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${dateStr}</td>
        `;
        this.dom.modals.tbody.appendChild(tr);
      });
    }

    async loadMemoryData() {
      if (!this.dom.modals.memoryTbody) return;
      this.dom.modals.memoryTbody.innerHTML = '<tr><td colspan="6" class="loading-row">Mengambil riwayat memori belajar...</td></tr>';

      const res = await LeaderboardService.fetchMemory();
      if (this.dom.modals.syncStatus) this.dom.modals.syncStatus.textContent = res.source;

      if (!res.data || res.data.length === 0) {
        this.dom.modals.memoryTbody.innerHTML = '<tr><td colspan="6" class="loading-row">Belum ada riwayat memori belajar. Selesaikan permainan untuk mencatat memori!</td></tr>';
        return;
      }

      this.dom.modals.memoryTbody.innerHTML = '';
      res.data.forEach((m, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td><span style="color:#06b6d4; font-weight:600;">${this.escapeHtml(m.direction || 'ID->EN')}</span></td>
          <td><strong>${this.escapeHtml(m.target || '')}</strong></td>
          <td><em>${this.escapeHtml(m.userResponse || '')}</em></td>
          <td><span style="color:${m.accuracy >= 75 ? '#10b981' : '#f59e0b'}; font-weight:700;">${m.accuracy}%</span></td>
          <td style="font-size:0.85rem; color:#cbd5e1;">${this.escapeHtml(m.notes || '-')}</td>
        `;
        this.dom.modals.memoryTbody.appendChild(tr);
      });
    }

    setLevelPreference(lvl) {
      this.levelPreference = lvl || 'all';
      safeStorage.setItem('cfg_level_preference', this.levelPreference);

      document.querySelectorAll('.btn-level-pill').forEach(btn => {
        if (btn.dataset.level === this.levelPreference) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const cfgLevel = document.getElementById('cfg-level-preference');
      if (cfgLevel) cfgLevel.value = this.levelPreference;
    }

    openSettings() {
      if (this.dom.modals.settings) this.dom.modals.settings.classList.remove('hidden');
      document.getElementById('cfg-appscript-url').value = safeStorage.getItem('cfg_appscript_url') || 'https://script.google.com/macros/s/AKfycbxy8pG0P3G95SATXLLqC0V3ZzH7MmU7oEF40PPLJRgBUE6i8NnBmKZlupiYfObPKtZ5/exec';
      document.getElementById('cfg-gemini-key').value = safeStorage.getItem('cfg_gemini_key') || '';
      document.getElementById('cfg-accent').value = safeStorage.getItem('cfg_accent') || 'en-US';

      const savedLevel = safeStorage.getItem('cfg_level_preference') || 'all';
      const cfgLevel = document.getElementById('cfg-level-preference');
      if (cfgLevel) cfgLevel.value = savedLevel;

      const voiceSelect = document.getElementById('cfg-voice');
      const savedVoice = safeStorage.getItem('cfg_voice_name') || 'auto';
      const rawRate = safeStorage.getItem('cfg_voice_rate') || '0.8';
      const savedRate = normalizeRate(rawRate);

      const rateSelect = document.getElementById('cfg-voice-rate');
      if (rateSelect) rateSelect.value = savedRate;

      if (voiceSelect) {
        voiceSelect.innerHTML = `
          <option value="auto">🌐 Otomatis (Sistem Rekomendasi)</option>
          <option value="female_us">👩 Sarah / US Female (American Natural)</option>
          <option value="male_us">👨 Alex / US Male (American Clear)</option>
          <option value="female_uk">👩 Emma / UK Female (British Accent)</option>
          <option value="male_uk">👨 Daniel / UK Male (BBC Style)</option>
          <option value="female_au">👩 Matilda / AU Female (Australian)</option>
          <option value="male_in">👨 Rishi / IN Male (Indian English)</option>
        `;

        if ('speechSynthesis' in window) {
          const sysVoices = window.speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
          if (sysVoices.length > 0) {
            const optGroup = document.createElement('optgroup');
            optGroup.label = '── Browser Native Voices ──';
            sysVoices.forEach(v => {
              const opt = document.createElement('option');
              opt.value = v.name;
              opt.textContent = `🎙️ ${v.name} (${v.lang})`;
              optGroup.appendChild(opt);
            });
            voiceSelect.appendChild(optGroup);
          }
        }
        voiceSelect.value = savedVoice;
      }
    }

    saveSettings(e) {
      e.preventDefault();
      const url = document.getElementById('cfg-appscript-url').value.trim();
      const key = document.getElementById('cfg-gemini-key').value.trim();
      const accent = document.getElementById('cfg-accent').value;
      const voice = document.getElementById('cfg-voice')?.value || 'auto';
      const rawRate = document.getElementById('cfg-voice-rate')?.value || '0.8';
      const rate = normalizeRate(rawRate);
      const lvl = document.getElementById('cfg-level-preference')?.value || 'all';

      safeStorage.setItem('cfg_appscript_url', url);
      safeStorage.setItem('cfg_gemini_key', key);
      safeStorage.setItem('cfg_accent', accent);
      safeStorage.setItem('cfg_voice_name', voice);
      safeStorage.setItem('cfg_voice_rate', rate);

      this.setLevelPreference(lvl);

      this.speech.selectedVoiceName = voice;
      this.speech.speechRate = parseFloat(rate);
      if (this.dom.challenge.accentSelect) this.dom.challenge.accentSelect.value = accent;
      if (this.dom.challenge.speedSelect) this.dom.challenge.speedSelect.value = rate;

      this.closeModals();
      this.showToast('Pengaturan suara & tingkat kesulitan berhasil disimpan!', 'success');
    }

    resetSettings() {
      if (confirm('Reset pengaturan ke default?')) {
        safeStorage.removeItem('cfg_appscript_url');
        safeStorage.removeItem('cfg_gemini_key');
        safeStorage.setItem('cfg_accent', 'en-US');
        safeStorage.setItem('cfg_voice_name', 'auto');
        safeStorage.setItem('cfg_voice_rate', '0.8');
        safeStorage.setItem('cfg_level_preference', 'all');

        document.getElementById('cfg-appscript-url').value = '';
        document.getElementById('cfg-gemini-key').value = '';
        document.getElementById('cfg-accent').value = 'en-US';
        if (document.getElementById('cfg-voice')) document.getElementById('cfg-voice').value = 'auto';
        if (document.getElementById('cfg-voice-rate')) document.getElementById('cfg-voice-rate').value = '0.8';
        if (document.getElementById('cfg-level-preference')) document.getElementById('cfg-level-preference').value = 'all';

        this.setLevelPreference('all');
        this.speech.selectedVoiceName = 'auto';
        this.speech.speechRate = 0.8;
        if (this.dom.challenge.speedSelect) this.dom.challenge.speedSelect.value = '0.8';
        this.showToast('Pengaturan direset ke default.', 'info');
      }
    }

    loadSettings() {
      const accent = safeStorage.getItem('cfg_accent') || 'en-US';
      const voice = safeStorage.getItem('cfg_voice_name') || 'auto';
      const rawRate = safeStorage.getItem('cfg_voice_rate') || '0.8';
      const normalizedRate = normalizeRate(rawRate);
      const lvl = safeStorage.getItem('cfg_level_preference') || 'all';

      if (this.dom.challenge.accentSelect) {
        this.dom.challenge.accentSelect.value = accent;
      }
      if (this.dom.challenge.speedSelect) {
        this.dom.challenge.speedSelect.value = normalizedRate;
      }
      this.speech.selectedVoiceName = voice;
      this.speech.speechRate = parseFloat(normalizedRate);

      this.setLevelPreference(lvl);

      const btnTestVoice = document.getElementById('btn-test-voice');
      if (btnTestVoice && !btnTestVoice.dataset.bound) {
        btnTestVoice.dataset.bound = 'true';
        btnTestVoice.addEventListener('click', () => {
          const v = document.getElementById('cfg-voice')?.value || 'auto';
          const r = parseFloat(document.getElementById('cfg-voice-rate')?.value || '0.8');
          const acc = document.getElementById('cfg-accent')?.value || 'en-US';
          this.speech.selectedVoiceName = v;
          this.speech.speechRate = r;
          this.speech.speak('Hello! Welcome to Awesome English Arena. Practice makes permanent!', acc, r);
        });
      }
    }

    updateProgressView() {
      const tier = this.getPlayerTier(this.totalXP);
      if (this.dom.progress.vocabCount) {
        this.dom.progress.vocabCount.textContent = `${this.stats.vocabLearned || 0} Kata`;
      }
      if (this.dom.progress.vocabFill) {
        const pct = Math.min(100, Math.round(((this.stats.vocabLearned || 0) / 50) * 100));
        this.dom.progress.vocabFill.style.width = `${pct}%`;
      }
      if (this.dom.progress.grammarCount) {
        this.dom.progress.grammarCount.textContent = `${this.stats.grammarMastered || 0} Materi`;
      }
      if (this.dom.progress.grammarFill) {
        const pct = Math.min(100, Math.round(((this.stats.grammarMastered || 0) / 30) * 100));
        this.dom.progress.grammarFill.style.width = `${pct}%`;
      }
      if (this.dom.progress.listeningScore) {
        this.dom.progress.listeningScore.textContent = `${(this.stats.listeningScore || 0).toLocaleString()} PTS`;
      }
      if (this.dom.progress.listeningAcc) {
        this.dom.progress.listeningAcc.textContent = `Akurasi Audio: ${this.stats.listeningScore > 0 ? '90%' : '0%'}`;
      }
      if (this.dom.progress.speakingScore) {
        this.dom.progress.speakingScore.textContent = `${(this.stats.speakingScore || 0).toLocaleString()} PTS`;
      }
      if (this.dom.progress.speakingAcc) {
        this.dom.progress.speakingAcc.textContent = `Akurasi Pengucapan: ${this.stats.speakingScore > 0 ? '88%' : '0%'}`;
      }
      if (this.dom.progress.totalXp) {
        this.dom.progress.totalXp.textContent = `${this.totalXP.toLocaleString()} XP`;
      }
      if (this.dom.progress.xpTier) {
        this.dom.progress.xpTier.textContent = `Tingkat: ${tier.tier}`;
      }
      if (this.dom.progress.gamesPlayed) {
        this.dom.progress.gamesPlayed.textContent = `${this.stats.gamesPlayed || 0} Game`;
      }
      if (this.dom.progress.totalSoal) {
        this.dom.progress.totalSoal.textContent = `${this.stats.totalAnswered || 0} Total Soal Dijawab`;
      }
      const totalAns = this.stats.totalAnswered || 0;
      const totalCor = this.stats.totalCorrect || 0;
      const acc = totalAns > 0 ? Math.round((totalCor / totalAns) * 100) : 100;
      if (this.dom.progress.accuracyRate) {
        this.dom.progress.accuracyRate.textContent = `${acc}%`;
      }
      if (this.dom.progress.accuracyFill) {
        this.dom.progress.accuracyFill.style.width = `${acc}%`;
      }
      if (this.dom.progress.streakDays) {
        this.dom.progress.streakDays.textContent = `${this.streakDays} Hari`;
      }
    }

    updateProfileView() {
      const tier = this.getPlayerTier(this.totalXP);
      const userName = AuthManager.isLoggedIn() ? AuthManager.currentUser.name : 'Player 1';
      if (this.dom.profile.displayName) this.dom.profile.displayName.textContent = userName;
      if (this.dom.profile.tierBadge) this.dom.profile.tierBadge.textContent = tier.tier;
      if (this.dom.profile.lvlBadge) this.dom.profile.lvlBadge.textContent = `Level ${tier.level}`;
      if (this.dom.profile.xpBadge) this.dom.profile.xpBadge.textContent = `⭐ ${this.totalXP.toLocaleString()} XP`;
      if (this.dom.profile.streakBadge) this.dom.profile.streakBadge.textContent = `🔥 ${this.streakDays} Hari`;
      if (this.dom.profile.heartsIcons) {
        this.dom.profile.heartsIcons.textContent = '❤️'.repeat(this.hearts) + '🖤'.repeat(5 - this.hearts);
      }
      this.renderBadges();
    }

    renderBadges() {
      const catalog = this.getBadgeCatalog();
      if (this.dom.profile.badgesCount) {
        this.dom.profile.badgesCount.textContent = `${this.badges.length} / ${catalog.length} Terbuka`;
      }
      if (!this.dom.profile.badgesContainer) return;
      this.dom.profile.badgesContainer.innerHTML = '';

      catalog.forEach(badge => {
        const isUnlocked = this.badges.includes(badge.id);
        const card = document.createElement('div');
        card.className = `badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="badge-icon-wrap">${badge.icon}</div>
          <div class="badge-info">
            <h4 class="badge-name">${this.escapeHtml(badge.name)}</h4>
            <p class="badge-desc">${this.escapeHtml(badge.desc)}</p>
            <span class="badge-status-tag ${isUnlocked ? 'unlocked' : ''}">
              ${isUnlocked ? '✓ Terbuka' : '🔒 Terkunci'}
            </span>
          </div>
        `;
        this.dom.profile.badgesContainer.appendChild(card);
      });
    }

    openDrawer() {
      const drawer = document.getElementById('mobile-drawer');
      const overlay = document.getElementById('drawer-overlay');
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.remove('hidden');
    }

    closeDrawer() {
      const drawer = document.getElementById('mobile-drawer');
      const overlay = document.getElementById('drawer-overlay');
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.add('hidden');
    }

    closeModals() {
      this.closeDrawer();
      this.closeHeartsModal();
      if (this.dom.modals.auth) this.dom.modals.auth.classList.add('hidden');
      if (this.dom.modals.leaderboard) this.dom.modals.leaderboard.classList.add('hidden');
      if (this.dom.modals.settings) this.dom.modals.settings.classList.add('hidden');
    }

    showToast(msg, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = msg;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new EnglishArenaGame();
  });
})();
