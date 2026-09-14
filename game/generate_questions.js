const fs = require('fs');
const path = require('path');

const questions = [
  /* ========================================================================
     1. SHADOWING & SPEAKING (20 SOAL)
     ======================================================================== */
  {
    id: 'sh_01',
    mode: 'shadowing',
    category: 'Shadowing • Refold Method',
    level: 'Intermediate',
    en: 'Could you please elaborate on that perspective?',
    target: 'Could you please elaborate on that perspective?',
    phonetic: '/kʊd juː pliːz ɪˈlæb.ə.reɪt ɒn ðæt pəˈspek.tɪv/',
    id_translation: 'Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?"',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Could you please elaborate on that perspective?"',
    options_en: [
      'Could you please elaborate on that perspective?',
      'Would you please summarize the final outcome?',
      'Can we schedule another discussion tomorrow?',
      'Do you agree with our general conclusion?'
    ],
    options_id: [
      'Bisakah Anda menjelaskan lebih rinci mengenai sudut pandang tersebut?',
      'Apakah Anda setuju dengan jadwal pertemuan besok?',
      'Tolong kirimkan dokumen laporan segera.',
      'Bisakah kita mengubah waktu rapat?'
    ],
    notes: 'Fokus pada linking sound antara "elaborate" dan "on" (/ɪˈlæbəreɪt‿ɒn/).'
  },
  {
    id: 'sh_02',
    mode: 'shadowing',
    category: 'Interview • Lex Fridman Podcast',
    level: 'Advanced',
    en: 'Curiosity and perseverance are far more important than raw talent.',
    target: 'Curiosity and perseverance are far more important than raw talent.',
    phonetic: '/ˌkjʊə.riˈɒs.ə.ti ænd ˌpɜː.sɪˈvɪə.rəns ɑː fɑː mɔːr ɪmˈpɔː.tənt/',
    id_translation: 'Rasa ingin tahu dan kegigihan jauh lebih penting daripada bakat semata.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Rasa ingin tahu dan kegigihan jauh lebih penting daripada bakat semata."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Curiosity and perseverance are far more important than raw talent."',
    options_en: [
      'Curiosity and perseverance are far more important than raw talent.',
      'Discipline and hard work lead directly to happiness.',
      'Creativity is the most critical asset in engineering.',
      'Talent will always triumph without dedicated effort.'
    ],
    options_id: [
      'Rasa ingin tahu dan kegigihan jauh lebih penting daripada bakat semata.',
      'Bakat alami selalu mengalahkan kerja keras dalam jangka panjang.',
      'Pendidikan formal adalah kunci utama kesuksesan karir.',
      'Kita harus selalu bersemangat setiap pagi.'
    ],
    notes: 'Penekanan pada suku kata kedua kata "perseverance" (/ˌpɜː.sɪˈvɪə.rəns/).'
  },
  {
    id: 'sh_03',
    mode: 'shadowing',
    category: 'Conversational • Luke’s English Podcast',
    level: 'Beginner',
    en: 'Let us touch base tomorrow afternoon to finalize the schedule.',
    target: 'Let us touch base tomorrow afternoon to finalize the schedule.',
    phonetic: '/let ʌs tʌtʃ beɪs təˈmɒr.əʊ ˌɑːf.təˈnuːn tuː ˈfaɪ.nəl.aɪz/',
    id_translation: 'Mari kita saling berkabar besok siang untuk menyelesaikan jadwalnya.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Mari kita saling berkabar besok siang untuk menyelesaikan jadwalnya."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Let us touch base tomorrow afternoon to finalize the schedule."',
    options_en: [
      'Let us touch base tomorrow afternoon to finalize the schedule.',
      'We must cancel tomorrow afternoon to review the contracts.',
      'Please send the schedule directly to our manager.',
      'Can you call me tomorrow morning before noon?'
    ],
    options_id: [
      'Mari kita saling berkabar besok siang untuk menyelesaikan jadwalnya.',
      'Jangan lupa membawa dokumen penting besok pagi.',
      'Pertemuan dibatalkan karena ada kendala teknis.',
      'Kita harus segera memesan tiket penerbangan.'
    ],
    notes: 'Idiom bisnis "touch base" berarti saling kontak singkat untuk update informasi.'
  },
  {
    id: 'sh_04',
    mode: 'shadowing',
    category: 'Motivation • BBC 6-Minute English',
    level: 'Intermediate',
    en: 'It is vital to step out of your comfort zone to achieve real progress.',
    target: 'It is vital to step out of your comfort zone to achieve real progress.',
    phonetic: '/ɪt ɪz ˈvaɪ.təl tuː step aʊt ɒv jɔː ˈkʌm.fət zəʊn/',
    id_translation: 'Sangat penting untuk keluar dari zona nyaman Anda demi mencapai kemajuan nyata.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Sangat penting untuk keluar dari zona nyaman Anda demi mencapai kemajuan nyata."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "It is vital to step out of your comfort zone to achieve real progress."',
    options_en: [
      'It is vital to step out of your comfort zone to achieve real progress.',
      'It is impossible to leave your safe environment without assistance.',
      'Progress requires patience and steady routine work.',
      'Staying inside your comfort zone ensures maximum efficiency.'
    ],
    options_id: [
      'Sangat penting untuk keluar dari zona nyaman Anda demi mencapai kemajuan nyata.',
      'Kemajuan hanya bisa diraih jika kita tetap berada di tempat aman.',
      'Kesabaran adalah hal terpenting dalam menyelesaikan pekerjaan.',
      'Jangan mengambil risiko jika belum memiliki pengalaman.'
    ],
    notes: 'Kata "vital" dilafalkan /ˈvaɪ.təl/, bukan /vi-tal/.'
  },
  {
    id: 'sh_05',
    mode: 'shadowing',
    category: 'Tech Podcast • Hard Fork NYT',
    level: 'Advanced',
    en: 'Artificial intelligence is fundamentally transforming how developers write code.',
    target: 'Artificial intelligence is fundamentally transforming how developers write code.',
    phonetic: '/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns ɪz ˌfʌn.dəˈmen.təl.i trænsˈfɔː.mɪŋ/',
    id_translation: 'Kecerdasan buatan secara fundamental mengubah cara para pengembang menulis kode.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Kecerdasan buatan secara fundamental mengubah cara para pengembang menulis kode."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Artificial intelligence is fundamentally transforming how developers write code."',
    options_en: [
      'Artificial intelligence is fundamentally transforming how developers write code.',
      'Modern computers require massive hardware to compile software.',
      'Software engineers should learn manual memory management.',
      'Cloud infrastructure speeds up continuous deployment cycles.'
    ],
    options_id: [
      'Kecerdasan buatan secara fundamental mengubah cara para pengembang menulis kode.',
      'Komputer modern membutuhkan memori yang sangat besar untuk bekerja.',
      'Programmer harus belajar bahasa pemrograman baru setiap tahun.',
      'Teknologi internet mempercepat komunikasi antar kantor.'
    ],
    notes: 'Penekanan pada suku kata utama: fun-da-MEN-tal-ly dan trans-FORM-ing.'
  },
  {
    id: 'sh_06',
    mode: 'shadowing',
    category: 'Mindset • The Tim Ferriss Show',
    level: 'Intermediate',
    en: 'Consistency in daily practice is what separates amateurs from professionals.',
    target: 'Consistency in daily practice is what separates amateurs from professionals.',
    phonetic: '/kənˈsɪs.tən.si ɪn ˈdeɪ.li ˈpræk.tɪs ɪz wɒt ˈsep.ər.eɪts ˈæm.ə.tərz/',
    id_translation: 'Konsistensi dalam latihan harian adalah hal yang membedakan amatir dari profesional.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Konsistensi dalam latihan harian adalah hal yang membedakan amatir dari profesional."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Consistency in daily practice is what separates amateurs from professionals."',
    options_en: [
      'Consistency in daily practice is what separates amateurs from professionals.',
      'Natural aptitude determines the eventual height of one’s career.',
      'Working long hours without breaks leads to rapid mastery.',
      'Experience in the industry is the sole measurement of expertise.'
    ],
    options_id: [
      'Konsistensi dalam latihan harian adalah hal yang membedakan amatir dari profesional.',
      'Bakat bawaan lahir menentukan seberapa tinggi karir seseorang.',
      'Bekerja tanpa istirahat menghasilkan penguasaan yang cepat.',
      'Pengalaman puluhan tahun adalah satu-satunya ukuran keahlian.'
    ],
    notes: 'Perhatikan pengucapan "amateurs" (/ˈæm.ə.tərz/).'
  },
  {
    id: 'sh_07',
    mode: 'shadowing',
    category: 'Developer • Google Cloud Platform Podcast',
    level: 'Advanced',
    en: 'We need to address the underlying vulnerabilities before deploying to production.',
    target: 'We need to address the underlying vulnerabilities before deploying to production.',
    phonetic: '/wiː niːd tuː əˈdres ðiː ˌʌn.dəˈlaɪ.ɪŋ ˌvʌl.nər.əˈbɪl.ə.tiz/',
    id_translation: 'Kita perlu mengatasi kerentanan mendasar sebelum merilis ke lingkungan produksi.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Kita perlu mengatasi kerentanan mendasar sebelum merilis ke lingkungan produksi."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "We need to address the underlying vulnerabilities before deploying to production."',
    options_en: [
      'We need to address the underlying vulnerabilities before deploying to production.',
      'We must install additional servers to handle peak user traffic.',
      'Security patches should be reviewed by the marketing department.',
      'The database query must be optimized for microsecond latency.'
    ],
    options_id: [
      'Kita perlu mengatasi kerentanan mendasar sebelum merilis ke lingkungan produksi.',
      'Kita harus menambah server baru untuk menampung lonjakan pengguna.',
      'Pembaruan keamanan harus diperiksa oleh tim pemasaran.',
      'Basis data perlu dioptimalkan agar respon lebih cepat.'
    ],
    notes: 'Latih artikulasi kata panjang "vulnerabilities" (/ˌvʌl.nər.əˈbɪl.ə.tiz/).'
  },
  {
    id: 'sh_08',
    mode: 'shadowing',
    category: 'Workplace • BBC English HowTo',
    level: 'Beginner',
    en: 'Would you mind giving me a hand with this presentation?',
    target: 'Would you mind giving me a hand with this presentation?',
    phonetic: '/wʊd juː maɪnd ˈɡɪv.ɪŋ miː ə hænd wɪð ðɪs ˌprez.ənˈteɪ.ʃən/',
    id_translation: 'Apakah Anda keberatan membantu saya menyiapkan presentasi ini?',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Apakah Anda keberatan membantu saya menyiapkan presentasi ini?"',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Would you mind giving me a hand with this presentation?"',
    options_en: [
      'Would you mind giving me a hand with this presentation?',
      'Can you review the presentation slides by yourself?',
      'Do you want me to cancel tomorrow’s presentation?',
      'Are you ready to deliver the speech in front of the board?'
    ],
    options_id: [
      'Apakah Anda keberatan membantu saya menyiapkan presentasi ini?',
      'Bisakah Anda memeriksa dokumen presentasi ini sendirian?',
      'Apakah Anda ingin membatalkan presentasi besok pagi?',
      'Apakah Anda sudah siap berpidato di hadapan dewan direksi?'
    ],
    notes: 'Idiom "give me a hand" berarti memberi pertolongan/bantuan.'
  },
  {
    id: 'sh_09',
    mode: 'shadowing',
    category: 'Soft Skills • All Ears English',
    level: 'Intermediate',
    en: 'I truly appreciate your feedback; it sheds light on a blind spot I had.',
    target: 'I truly appreciate your feedback; it sheds light on a blind spot I had.',
    phonetic: '/aɪ ˈtruː.li əˈpriː.ʃi.eɪt jɔː ˈfiːd.bæk ɪt ʃedz laɪt ɒn ə blaɪnd spɒt/',
    id_translation: 'Saya sangat menghargai masukan Anda; ini memperjelas titik buta yang sebelumnya tidak saya sadari.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Saya sangat menghargai masukan Anda; ini memperjelas titik buta yang sebelumnya tidak saya sadari."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "I truly appreciate your feedback; it sheds light on a blind spot I had."',
    options_en: [
      'I truly appreciate your feedback; it sheds light on a blind spot I had.',
      'I disagree with your remarks because they overlook key factors.',
      'Your suggestions were submitted too late for consideration.',
      'We should discuss this privately after the seminar concludes.'
    ],
    options_id: [
      'Saya sangat menghargai masukan Anda; ini memperjelas titik buta yang sebelumnya tidak saya sadari.',
      'Saya kurang setuju dengan catatan Anda karena mengabaikan faktor penting.',
      'Saran Anda terlambat dikirimkan sehingga tidak sempat dipertimbangkan.',
      'Mari kita bicarakan hal ini secara tertutup setelah seminar selesai.'
    ],
    notes: '"Sheds light on" adalah idiom untuk memperjelas atau menerangkan sesuatu.'
  },
  {
    id: 'sh_10',
    mode: 'shadowing',
    category: 'Business • Bloomberg Technology',
    level: 'Advanced',
    en: 'The intricate balance between innovation and regulation remains fiercely debated.',
    target: 'The intricate balance between innovation and regulation remains fiercely debated.',
    phonetic: '/ðiː ˈɪn.trɪ.kət ˈbæl.əns bɪˈtwiːn ˌɪn.əˈveɪ.ʃən ænd ˌreɡ.jəˈleɪ.ʃən/',
    id_translation: 'Keseimbangan rumit antara inovasi dan regulasi masih terus diperdebatkan secara sengit.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Keseimbangan rumit antara inovasi dan regulasi masih terus diperdebatkan secara sengit."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The intricate balance between innovation and regulation remains fiercely debated."',
    options_en: [
      'The intricate balance between innovation and regulation remains fiercely debated.',
      'Governments around the world have universally banned automated systems.',
      'New technological breakthroughs have made regulations completely obsolete.',
      'Regulatory compliance is the sole driver of enterprise profitability.'
    ],
    options_id: [
      'Keseimbangan rumit antara inovasi dan regulasi masih terus diperdebatkan secara sengit.',
      'Pemerintah dunia telah sepakat melarang seluruh sistem otomatis.',
      'Penemuan teknologi mutakhir telah membuat aturan hukum tak berguna.',
      'Kepatuhan aturan adalah satu-satunya penentu keuntungan perusahaan.'
    ],
    notes: 'Lafalkan "intricate" sebagai /ˈɪn.trɪ.kət/ dengan penekanan di suku kata pertama.'
  },
  {
    id: 'sh_11',
    mode: 'shadowing',
    category: 'Pronunciation • Rachel’s English',
    level: 'Beginner',
    en: 'Take your time and let me know when you are ready to proceed.',
    target: 'Take your time and let me know when you are ready to proceed.',
    phonetic: '/teɪk jɔː taɪm ænd let miː nəʊ wen juː ɑː ˈred.i tuː prəˈsiːd/',
    id_translation: 'Santai saja dan beri tahu saya ketika Anda sudah siap untuk melanjutkan.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Santai saja dan beri tahu saya ketika Anda sudah siap untuk melanjutkan."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Take your time and let me know when you are ready to proceed."',
    options_en: [
      'Take your time and let me know when you are ready to proceed.',
      'Hurry up because our flight is boarding in ten minutes.',
      'Please sit down and wait until your queue number is called.',
      'Do you need additional time to review the contract terms?'
    ],
    options_id: [
      'Santai saja dan beri tahu saya ketika Anda sudah siap untuk melanjutkan.',
      'Cepatlah karena pesawat kita akan lepas landas sepuluh menit lagi.',
      'Silakan duduk dan tunggu nomor antrean Anda dipanggil.',
      'Apakah Anda butuh waktu tambahan untuk memeriksa berkas kontrak?'
    ],
    notes: 'Perhatikan linking sound "let me know" (/let‿miː nəʊ/).'
  },
  {
    id: 'sh_12',
    mode: 'shadowing',
    category: 'Entrepreneurship • How I Built This with Guy Raz',
    level: 'Intermediate',
    en: 'To be honest, the initial results exceeded all our preliminary expectations.',
    target: 'To be honest, the initial results exceeded all our preliminary expectations.',
    phonetic: '/tuː biː ˈɒn.ɪst ðiː ɪˈnɪʃ.əl rɪˈzʌlts ɪkˈsiː.dɪd ɔːl ˈaʊər prɪˈlɪm.ɪ.nər.i/',
    id_translation: 'Sejujurnya, hasil awal melampaui semua ekspektasi awal kami.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Sejujurnya, hasil awal melampaui semua ekspektasi awal kami."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "To be honest, the initial results exceeded all our preliminary expectations."',
    options_en: [
      'To be honest, the initial results exceeded all our preliminary expectations.',
      'Unfortunately, the launch failed to meet our minimum sales quota.',
      'We anticipate substantial growth over the upcoming fiscal quarter.',
      'Customer retention declined sharply after the pricing restructure.'
    ],
    options_id: [
      'Sejujurnya, hasil awal melampaui semua ekspektasi awal kami.',
      'Sayangnya, peluncuran produk gagal memenuhi target penjualan minimal.',
      'Kami memperkirakan pertumbuhan pesat pada kuartal keuangan berikutnya.',
      'Tingkat retensi pelanggan merosot tajam setelah harga diubah.'
    ],
    notes: 'Huruf "h" pada kata "honest" tidak dibunyikan (silent h: /ˈɒn.ɪst/).'
  },
  {
    id: 'sh_13',
    mode: 'shadowing',
    category: 'Psychology • The Knowledge Project',
    level: 'Advanced',
    en: 'Cognitive biases frequently distort our perception of risk and probability.',
    target: 'Cognitive biases frequently distort our perception of risk and probability.',
    phonetic: '/ˈkɒɡ.nə.tɪv ˈbaɪ.əs.ɪz ˈfriː.kwənt.li dɪˈstɔːt ˈaʊər pəˈsep.ʃən/',
    id_translation: 'Bias kognitif sering kali mendistorsi persepsi kita tentang risiko dan probabilitas.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Bias kognitif sering kali mendistorsi persepsi kita tentang risiko dan probabilitas."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Cognitive biases frequently distort our perception of risk and probability."',
    options_en: [
      'Cognitive biases frequently distort our perception of risk and probability.',
      'Rational decision making guarantees successful outcomes in all markets.',
      'Emotional intelligence is primarily dictated by genetic predispositions.',
      'Statistical calculations eliminate psychological stress in trading.'
    ],
    options_id: [
      'Bias kognitif sering kali mendistorsi persepsi kita tentang risiko dan probabilitas.',
      'Keputusan rasional menjamin hasil yang menguntungkan di semua pasar.',
      'Kecerdasan emosional terutama dibentuk oleh faktor genetik.',
      'Perhitungan statistik menghilangkan tekanan batin dalam berinvestasi.'
    ],
    notes: 'Artikulasi kata "biases" (/ˈbaɪ.əs.ɪz/) dengan akhiran jamak yang jelas.'
  },
  {
    id: 'sh_14',
    mode: 'shadowing',
    category: 'ESL Essentials • RealLife English',
    level: 'Beginner',
    en: 'Could you repeat that sentence a little slower, please?',
    target: 'Could you repeat that sentence a little slower, please?',
    phonetic: '/kʊd juː rɪˈpiːt ðæt ˈsen.təns ə ˈlɪt.əl ˈsləʊ.ər pliːz/',
    id_translation: 'Bisakah Anda mengulangi kalimat itu sedikit lebih lambat?',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Bisakah Anda mengulangi kalimat itu sedikit lebih lambat?"',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Could you repeat that sentence a little slower, please?"',
    options_en: [
      'Could you repeat that sentence a little slower, please?',
      'Can you write down your email address on this paper?',
      'Where is the nearest subway station from here?',
      'What time does the conference registration begin?'
    ],
    options_id: [
      'Bisakah Anda mengulangi kalimat itu sedikit lebih lambat?',
      'Bisakah Anda menuliskan alamat email Anda di kertas ini?',
      'Di manakah stasiun kereta bawah tanah terdekat dari sini?',
      'Pukul berapa pendaftaran seminar dimulai?'
    ],
    notes: 'Frasa wajib dan sangat berguna bagi pembelajar saat berbicara dengan penutur asli.'
  },
  {
    id: 'sh_15',
    mode: 'shadowing',
    category: 'Finance • Bloomberg Radio',
    level: 'Intermediate',
    en: 'We should weigh the pros and cons thoroughly before committing any capital.',
    target: 'We should weigh the pros and cons thoroughly before committing any capital.',
    phonetic: '/wiː ʃʊd weɪ ðə prəʊz ænd kɒnz ˈθʌr.ə.li bɪˈfɔː kəˈmɪt.ɪŋ/',
    id_translation: 'Kita harus menimbang kelebihan dan kekurangannya secara matang sebelum menanamkan modal.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Kita harus menimbang kelebihan dan kekurangannya secara matang sebelum menanamkan modal."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "We should weigh the pros and cons thoroughly before committing any capital."',
    options_en: [
      'We should weigh the pros and cons thoroughly before committing any capital.',
      'We must invest immediately before stock prices rise further.',
      'All capital expenses must be approved by the accounting division.',
      'The board decided to liquidate remaining assets without delay.'
    ],
    options_id: [
      'Kita harus menimbang kelebihan dan kekurangannya secara matang sebelum menanamkan modal.',
      'Kita harus berinvestasi sekarang sebelum harga saham naik lebih tinggi.',
      'Semua pengeluaran modal harus disetujui oleh divisi akuntansi.',
      'Dewan direksi memutuskan untuk mencairkan aset yang tersisa segera.'
    ],
    notes: 'Idiom "pros and cons" berarti untung rugi atau kelebihan dan kekurangan.'
  },
  {
    id: 'sh_16',
    mode: 'shadowing',
    category: 'Open Source • Talk Python To Me',
    level: 'Advanced',
    en: 'The democratization of open-source models has accelerated global collaboration.',
    target: 'The democratization of open-source models has accelerated global collaboration.',
    phonetic: '/ðə dɪˌmɒk.rə.taɪˈzeɪ.ʃən ɒv ˈəʊ.pən sɔːs ˈmɒd.əlz/',
    id_translation: 'Demokratisasi model sumber terbuka telah mempercepat kolaborasi di seluruh dunia.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Demokratisasi model sumber terbuka telah mempercepat kolaborasi di seluruh dunia."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The democratization of open-source models has accelerated global collaboration."',
    options_en: [
      'The democratization of open-source models has accelerated global collaboration.',
      'Proprietary software continues to dominate enterprise data centers.',
      'Software engineers prefer closed architectures for high security.',
      'Cloud vendors offer managed hosting for distributed clusters.'
    ],
    options_id: [
      'Demokratisasi model sumber terbuka telah mempercepat kolaborasi di seluruh dunia.',
      'Perangkat lunak berbayar masih mendominasi pusat data perusahaan besar.',
      'Para pengembang lebih memilih sistem tertutup demi keamanan data.',
      'Penyedia cloud menawarkan hosting terkelola untuk server terdistribusi.'
    ],
    notes: 'Perhatikan ritme pada kata "democratization" (/dɪˌmɒk.rə.taɪˈzeɪ.ʃən/).'
  },
  {
    id: 'sh_17',
    mode: 'shadowing',
    category: 'Casual English • Culips Podcast',
    level: 'Beginner',
    en: 'I am really looking forward to catching up with you this weekend.',
    target: 'I am really looking forward to catching up with you this weekend.',
    phonetic: '/aɪ æm ˈrɪə.li ˈlʊk.ɪŋ ˈfɔː.wəd tuː ˈkætʃ.ɪŋ ʌp wɪð juː/',
    id_translation: 'Saya sangat menantikan untuk bertemu dan mengobrol dengan Anda akhir pekan ini.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Saya sangat menantikan untuk bertemu dan mengobrol dengan Anda akhir pekan ini."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "I am really looking forward to catching up with you this weekend."',
    options_en: [
      'I am really looking forward to catching up with you this weekend.',
      'I will probably be too busy with office work to meet anyone.',
      'Let us postpone our dinner appointment until next Friday.',
      'Did you finish the assignment we discussed yesterday?'
    ],
    options_id: [
      'Saya sangat menantikan untuk bertemu dan mengobrol dengan Anda akhir pekan ini.',
      'Kemungkinan saya terlalu sibuk dengan pekerjaan kantor untuk bertemu.',
      'Mari kita tunda janji makan malam sampai Jumat depan.',
      'Apakah Anda sudah menyelesaikan tugas yang kita bahas kemarin?'
    ],
    notes: '"Catch up" adalah phrasal verb umum untuk saling bertukar kabar setelah lama tak jumpa.'
  },
  {
    id: 'sh_18',
    mode: 'shadowing',
    category: 'Leadership • TED-Ed Talks',
    level: 'Intermediate',
    en: 'Effective communication is less about speaking and more about active listening.',
    target: 'Effective communication is less about speaking and more about active listening.',
    phonetic: '/ɪˈfek.tɪv kəˌmjuː.nɪˈkeɪ.ʃən ɪz les əˈbaʊt ˈspiː.kɪŋ ænd mɔːr/',
    id_translation: 'Komunikasi yang efektif bukan tentang banyak bicara, melainkan tentang mendengarkan secara aktif.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Komunikasi yang efektif bukan tentang banyak bicara, melainkan tentang mendengarkan secara aktif."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Effective communication is less about speaking and more about active listening."',
    options_en: [
      'Effective communication is less about speaking and more about active listening.',
      'Public speaking requires memorizing long speeches word for word.',
      'Charisma is an innate personality trait that cannot be cultivated.',
      'Great managers avoid direct conversations during conflicts.'
    ],
    options_id: [
      'Komunikasi yang efektif bukan tentang banyak bicara, melainkan tentang mendengarkan secara aktif.',
      'Berbicara di depan umum memerlukan hafalan pidato kata demi kata.',
      'Karisma adalah bakat bawaan lahir yang tidak dapat dipelajari.',
      'Manajer yang baik menghindari obrolan langsung saat terjadi konflik.'
    ],
    notes: 'Perhatikan kontras intonasi: "less about speaking" vs "more about active listening".'
  },
  {
    id: 'sh_19',
    mode: 'shadowing',
    category: 'Mindset • This American Life',
    level: 'Advanced',
    en: 'Resilience is not the absence of adversity, but the capacity to adapt through it.',
    target: 'Resilience is not the absence of adversity, but the capacity to adapt through it.',
    phonetic: '/rɪˈzɪl.jəns ɪz nɒt ðiː ˈæb.səns ɒv ədˈvɜː.sə.ti/',
    id_translation: 'Ketangguhan bukanlah ketiadaan kesulitan, melainkan kemampuan untuk beradaptasi melaluinya.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Ketangguhan bukanlah ketiadaan kesulitan, melainkan kemampuan untuk beradaptasi melaluinya."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Resilience is not the absence of adversity, but the capacity to adapt through it."',
    options_en: [
      'Resilience is not the absence of adversity, but the capacity to adapt through it.',
      'Success is measured exclusively by financial wealth and status.',
      'Hardship inevitably damages human determination in the long run.',
      'Confidence develops when people avoid challenging situations.'
    ],
    options_id: [
      'Ketangguhan bukanlah ketiadaan kesulitan, melainkan kemampuan untuk beradaptasi melaluinya.',
      'Kesuksesan hanya diukur dari kekayaan materi dan jabatan sosial.',
      'Kesulitan hidup pada akhirnya selalu merusak tekad manusia.',
      'Rasa percaya diri tumbuh saat orang menghindari situasi yang menantang.'
    ],
    notes: 'Lafalkan "adversity" (/ədˈvɜː.sə.ti/) dengan penekanan suku kata kedua.'
  },
  {
    id: 'sh_20',
    mode: 'shadowing',
    category: 'Travel • ESL Podcasts',
    level: 'Beginner',
    en: 'Have a safe flight and keep in touch while you are away.',
    target: 'Have a safe flight and keep in touch while you are away.',
    phonetic: '/hæv ə seɪf flaɪt ænd kiːp ɪn tʌtʃ waɪl juː ɑːr əˈweɪ/',
    id_translation: 'Semoga penerbangan Anda aman dan tetaplah berkabar selama Anda bepergian.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Semoga penerbangan Anda aman dan tetaplah berkabar selama Anda bepergian."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Have a safe flight and keep in touch while you are away."',
    options_en: [
      'Have a safe flight and keep in touch while you are away.',
      'Remember to pack warm clothing for the cold destination.',
      'Do not forget to exchange your money at the airport bank.',
      'Call the hotel directly if your flight gets delayed tonight.'
    ],
    options_id: [
      'Semoga penerbangan Anda aman dan tetaplah berkabar selama Anda bepergian.',
      'Jangan lupa membawa pakaian hangat untuk tujuan yang dingin.',
      'Jangan lupa menukarkan uang Anda di bank bandara.',
      'Hubungi pihak hotel secara langsung jika penerbangan Anda tertunda malam ini.'
    ],
    notes: 'Ungkapan ramah perpisahan "keep in touch" (/kiːp ɪn tʌtʃ/).'
  },

  /* ========================================================================
     2. LISTENING & DICTATION (20 SOAL)
     ======================================================================== */
  {
    id: 'ls_01',
    mode: 'listening',
    category: 'Dictation • Numblr Resource',
    level: 'Intermediate',
    en: 'The flight arrives at gate twenty-four at seven fifteen PM.',
    target: 'The flight arrives at gate twenty-four at seven fifteen PM.',
    phonetic: '/ðə flaɪt əˈraɪvz æt ɡeɪt ˈtwen.ti fɔːr æt ˈsev.ən fɪfˈtiːn/',
    id_translation: 'Penerbangan tiba di gerbang dua puluh empat pada pukul tujuh lima belas malam.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Penerbangan tiba di gerbang dua puluh empat pada pukul tujuh lima belas malam."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The flight arrives at gate twenty-four at seven fifteen PM."',
    options_en: [
      'The flight arrives at gate twenty-four at seven fifteen PM.',
      'The train departs from track fourteen at seven fifty PM.',
      'The bus will stop at terminal twenty-five at eight fifteen PM.',
      'Our flight lands at gate thirty-four at six fifteen PM.'
    ],
    options_id: [
      'Penerbangan tiba di gerbang dua puluh empat pada pukul tujuh lima belas malam.',
      'Kereta berangkat dari jalur empat belas pukul tujuh lima puluh malam.',
      'Bus akan berhenti di terminal dua puluh lima pukul delapan lima belas malam.',
      'Penerbangan kami mendarat di gerbang tiga puluh empat pukul enam lima belas.'
    ],
    notes: 'Latihan pendengaran angka gate "twenty-four" dan waktu "seven fifteen".'
  },
  {
    id: 'ls_02',
    mode: 'listening',
    category: 'Listening • NPR News Brief',
    level: 'Intermediate',
    en: 'Global investment in clean renewable energy reached record levels this year.',
    target: 'Global investment in clean renewable energy reached record levels this year.',
    phonetic: '/ˈɡləʊ.bəl ɪnˈvest.mənt ɪn kliːn rɪˈnjuː.ə.bəl ˈen.ə.dʒi/',
    id_translation: 'Investasi global dalam energi terbarukan yang bersih mencapai rekor tahun ini.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Investasi global dalam energi terbarukan yang bersih mencapai rekor tahun ini."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Global investment in clean renewable energy reached record levels this year."',
    options_en: [
      'Global investment in clean renewable energy reached record levels this year.',
      'Traditional energy companies reduced their exploration budgets sharply.',
      'International leaders signed a historic treaty to combat pollution.',
      'Electric vehicle production expanded across major European markets.'
    ],
    options_id: [
      'Investasi global dalam energi terbarukan yang bersih mencapai rekor tahun ini.',
      'Perusahaan energi tradisional memotong anggaran eksplorasi secara tajam.',
      'Para pemimpin dunia menandatangani perjanjian bersejarah untuk melawan polusi.',
      'Produksi mobil listrik melonjak di pasar-pasar utama Eropa.'
    ],
    notes: 'Dengarkan baik-baik kata "renewable" (/rɪˈnjuː.ə.bəl/).'
  },
  {
    id: 'ls_03',
    mode: 'listening',
    category: 'Listening • BBC Learning English',
    level: 'Beginner',
    en: 'Could you recommend a quiet coffee shop near the central station?',
    target: 'Could you recommend a quiet coffee shop near the central station?',
    phonetic: '/kʊd juː ˌrek.əˈmend ə ˈkwaɪət ˈkɒf.i ʃɒp nɪə ðə ˈsen.trəl ˈsteɪ.ʃən/',
    id_translation: 'Bisakah Anda merekomendasikan kedai kopi yang tenang dekat stasiun pusat?',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Bisakah Anda merekomendasikan kedai kopi yang tenang dekat stasiun pusat?"',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Could you recommend a quiet coffee shop near the central station?"',
    options_en: [
      'Could you recommend a quiet coffee shop near the central station?',
      'Is there an Italian restaurant close to the library?',
      'Can you tell me how to get to the nearest convenience store?',
      'Where can I purchase a ticket for the express train?'
    ],
    options_id: [
      'Bisakah Anda merekomendasikan kedai kopi yang tenang dekat stasiun pusat?',
      'Apakah ada restoran Italia yang dekat dengan perpustakaan?',
      'Bisakah Anda memberi tahu saya jalan ke minimarket terdekat?',
      'Di mana saya bisa membeli tiket untuk kereta ekspres?'
    ],
    notes: 'Frasa sopan untuk meminta rekomendasi tempat di area publik.'
  },
  {
    id: 'ls_04',
    mode: 'listening',
    category: 'Dates & Times • Numblr Listening',
    level: 'Beginner',
    en: 'The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM.',
    target: 'The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM.',
    phonetic: '/ðə ˈmiː.tɪŋ ɪz ˈʃed.juːld fɔː ˈtjuːz.deɪ mɑːtʃ ˌfɔːˈtiːnθ æt ten ˈθɜː.ti/',
    id_translation: 'Pertemuan dijadwalkan pada hari Selasa, empat belas Maret pukul sepuluh tiga puluh pagi.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Pertemuan dijadwalkan pada hari Selasa, empat belas Maret pukul sepuluh tiga puluh pagi."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM."',
    options_en: [
      'The meeting is scheduled for Tuesday, March fourteenth at ten thirty AM.',
      'The interview will take place on Thursday, May fourth at two thirty PM.',
      'We postponed the presentation to Wednesday, April fourteenth at nine AM.',
      'The team gathers every Monday morning at ten sharp in the boardroom.'
    ],
    options_id: [
      'Pertemuan dijadwalkan pada hari Selasa, empat belas Maret pukul sepuluh tiga puluh pagi.',
      'Wawancara akan berlangsung hari Kamis, empat Mei pukul dua tiga puluh siang.',
      'Kami menunda presentasi ke hari Rabu, empat belas April pukul sembilan pagi.',
      'Tim berkumpul setiap Senin pagi tepat pukul sepuluh di ruang rapat.'
    ],
    notes: 'Bedakan pelafalan ordinal "fourteenth" (/ˌfɔːˈtiːnθ/) dengan "fortieth".'
  },
  {
    id: 'ls_05',
    mode: 'listening',
    category: 'Currency • Numblr Listening',
    level: 'Intermediate',
    en: 'The total invoice amounts to four hundred eighty-five dollars and fifty cents.',
    target: 'The total invoice amounts to four hundred eighty-five dollars and fifty cents.',
    phonetic: '/ðə ˈtəʊ.təl ˈɪn.vɔɪs əˈmaʊnts tuː fɔː ˈhʌn.drəd ˈeɪ.ti faɪv ˈdɒl.əz/',
    id_translation: 'Total tagihan berjumlah empat ratus delapan puluh lima dolar lima puluh sen.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Total tagihan berjumlah empat ratus delapan puluh lima dolar lima puluh sen."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The total invoice amounts to four hundred eighty-five dollars and fifty cents."',
    options_en: [
      'The total invoice amounts to four hundred eighty-five dollars and fifty cents.',
      'The shipping cost is three hundred fifty-five dollars and fifteen cents.',
      'We received a discount of fifty-five dollars on the overall order.',
      'Your monthly subscription fee is four hundred ninety dollars.'
    ],
    options_id: [
      'Total tagihan berjumlah empat ratus delapan puluh lima dolar lima puluh sen.',
      'Biaya pengiriman adalah tiga ratus lima puluh lima dolar lima belas sen.',
      'Kami mendapatkan potongan lima puluh lima dolar untuk pesanan keseluruhan.',
      'Biaya langganan bulanan Anda adalah empat ratus sembilan puluh dolar.'
    ],
    notes: 'Latihan angka ratusan dan desimal sen ("four hundred eighty-five dollars and fifty cents").'
  },
  {
    id: 'ls_06',
    mode: 'listening',
    category: 'Economy • Bloomberg Radio',
    level: 'Advanced',
    en: 'Inflation dropped to two point seven percent in the third quarter.',
    target: 'Inflation dropped to two point seven percent in the third quarter.',
    phonetic: '/ɪnˈfleɪ.ʃən drɒpt tuː tuː pɔɪnt ˈsev.ən pəˈsent ɪn ðə θɜːd ˈkwɔː.tər/',
    id_translation: 'Inflasi turun menjadi dua koma tujuh persen pada kuartal ketiga.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Inflasi turun menjadi dua koma tujuh persen pada kuartal ketiga."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Inflation dropped to two point seven percent in the third quarter."',
    options_en: [
      'Inflation dropped to two point seven percent in the third quarter.',
      'Unemployment rose to three point seven percent earlier this month.',
      'Interest rates remained unchanged at four point five percent.',
      'Consumer confidence declined slightly in the fourth quarter.'
    ],
    options_id: [
      'Inflasi turun menjadi dua koma tujuh persen pada kuartal ketiga.',
      'Tingkat pengangguran naik menjadi tiga koma tujuh persen awal bulan ini.',
      'Suku bunga tetap tidak berubah pada posisi empat koma lima persen.',
      'Kepercayaan konsumen sedikit menurun pada kuartal keempat.'
    ],
    notes: 'Latihan mendengarkan angka desimal ("two point seven percent").'
  },
  {
    id: 'ls_07',
    mode: 'listening',
    category: 'Phone • Numblr Listening',
    level: 'Beginner',
    en: 'Please dial extension three zero eight to reach technical support.',
    target: 'Please dial extension three zero eight to reach technical support.',
    phonetic: '/pliːz ˈdaɪ.əl ɪkˈsten.ʃən θriː ˈzɪə.rəʊ eɪt tuː riːtʃ/',
    id_translation: 'Silakan tekan ekstensi tiga nol delapan untuk menghubungi bantuan teknis.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Silakan tekan ekstensi tiga nol delapan untuk menghubungi bantuan teknis."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Please dial extension three zero eight to reach technical support."',
    options_en: [
      'Please dial extension three zero eight to reach technical support.',
      'Call operator seven zero eight to reserve a conference room.',
      'Contact our customer service desk on line four zero eight.',
      'Press nine to leave a voicemail message for the representative.'
    ],
    options_id: [
      'Silakan tekan ekstensi tiga nol delapan untuk menghubungi bantuan teknis.',
      'Hubungi operator tujuh nol delapan untuk memesan ruang rapat.',
      'Hubungi meja layanan pelanggan kami di saluran empat nol delapan.',
      'Tekan sembilan untuk meninggalkan pesan suara bagi perwakilan kami.'
    ],
    notes: 'Angka 0 sering dilafalkan "zero" atau "oh" (/əʊ/).'
  },
  {
    id: 'ls_08',
    mode: 'listening',
    category: 'World Events • CNN 10',
    level: 'Intermediate',
    en: 'The conference will host over twelve hundred participants from fifty countries.',
    target: 'The conference will host over twelve hundred participants from fifty countries.',
    phonetic: '/ðə ˈkɒn.fər.əns wɪl həʊst ˈəʊ.vər twelv ˈhʌn.drəd pɑːˈtɪs.ɪ.pənts/',
    id_translation: 'Konferensi ini akan menampung lebih dari seribu dua ratus peserta dari lima puluh negara.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Konferensi ini akan menampung lebih dari seribu dua ratus peserta dari lima puluh negara."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The conference will host over twelve hundred participants from fifty countries."',
    options_en: [
      'The conference will host over twelve hundred participants from fifty countries.',
      'The exhibition welcomed nearly two thousand delegates from fifteen nations.',
      'The festival attracted over twelve thousand visitors over five days.',
      'The committee selected twenty-five scholarship recipients this year.'
    ],
    options_id: [
      'Konferensi ini akan menampung lebih dari seribu dua ratus peserta dari lima puluh negara.',
      'Pameran ini menyambut hampir dua ribu delegasi dari lima belas negara.',
      'Festival ini menarik lebih dari dua belas ribu pengunjung selama lima hari.',
      'Komite telah memilih dua puluh lima penerima beasiswa tahun ini.'
    ],
    notes: 'Penutur asli sering menyebut 1,200 sebagai "twelve hundred" alih-alih "one thousand two hundred".'
  },
  {
    id: 'ls_09',
    mode: 'listening',
    category: 'Science • Sky News Swipe',
    level: 'Advanced',
    en: 'The spacecraft completed its orbital insertion at approximately nineteen hundred hours.',
    target: 'The spacecraft completed its orbital insertion at approximately nineteen hundred hours.',
    phonetic: '/ðə ˈspeɪs.krɑːft kəmˈpliː.tɪd ɪts ˈɔː.bɪ.təl ɪnˈsɜː.ʃən æt əˈprɒk.sɪ.mət.li/',
    id_translation: 'Wahana antariksa berhasil menyelesaikan penyisipan orbitnya pada sekitar pukul sembilan belas.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Wahana antariksa berhasil menyelesaikan penyisipan orbitnya pada sekitar pukul sembilan belas."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The spacecraft completed its orbital insertion at approximately nineteen hundred hours."',
    options_en: [
      'The spacecraft completed its orbital insertion at approximately nineteen hundred hours.',
      'The satellite lost communication shortly after twenty-one hundred hours.',
      'Ground control confirmed the lunar landing at nine thirty PM UTC.',
      'The telescope transmitted high-resolution images back to earth.'
    ],
    options_id: [
      'Wahana antariksa berhasil menyelesaikan penyisipan orbitnya pada sekitar pukul sembilan belas.',
      'Satelit kehilangan komunikasi sesaat setelah pukul dua puluh satu.',
      'Stasiun kendali bumi mengonfirmasi pendaratan di bulan pada pukul sembilan tiga puluh.',
      'Teleskop memancarkan gambar resolusi tinggi kembali ke bumi.'
    ],
    notes: 'Waktu militer "nineteen hundred hours" sama dengan 19:00 (7:00 PM).'
  },
  {
    id: 'ls_10',
    mode: 'listening',
    category: 'Hospitality • Daily Listening',
    level: 'Beginner',
    en: 'Room four hundred and twelve is on the fourth floor next to the elevator.',
    target: 'Room four hundred and twelve is on the fourth floor next to the elevator.',
    phonetic: '/ruːm fɔː ˈhʌn.drəd ænd twelv ɪz ɒn ðə fɔːθ flɔː nekst tuː ðiː ˈel.ɪ.veɪ.tər/',
    id_translation: 'Kamar empat ratus dua belas berada di lantai empat di sebelah lift.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Kamar empat ratus dua belas berada di lantai empat di sebelah lift."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Room four hundred and twelve is on the fourth floor next to the elevator."',
    options_en: [
      'Room four hundred and twelve is on the fourth floor next to the elevator.',
      'Room four hundred and twenty is on the second floor near the stairs.',
      'Suite five hundred and twelve is reserved under Mr. Johnson’s name.',
      'The luggage was delivered to room four hundred and fourteen.'
    ],
    options_id: [
      'Kamar empat ratus dua belas berada di lantai empat di sebelah lift.',
      'Kamar empat ratus dua puluh berada di lantai dua dekat tangga.',
      'Kamar suite lima ratus dua belas dipesan atas nama Tuan Johnson.',
      'Koper telah diantarkan ke kamar empat ratus empat belas.'
    ],
    notes: 'Latihan membedakan "twelve" (12) dan "twenty" (20).'
  },
  {
    id: 'ls_11',
    mode: 'listening',
    category: 'Weather • BBC London',
    level: 'Intermediate',
    en: 'Temperatures are expected to drop below freezing by late Friday evening.',
    target: 'Temperatures are expected to drop below freezing by late Friday evening.',
    phonetic: '/ˈtem.prə.tʃərz ɑːr ɪkˈspek.tɪd tuː drɒp bɪˈləʊ ˈfriː.zɪŋ baɪ leɪt ˈfraɪ.deɪ/',
    id_translation: 'Suhu diperkirakan akan turun di bawah titik beku pada larut Jumat malam.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Suhu diperkirakan akan turun di bawah titik beku pada larut Jumat malam."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Temperatures are expected to drop below freezing by late Friday evening."',
    options_en: [
      'Temperatures are expected to drop below freezing by late Friday evening.',
      'Heavy thunderstorms will hit the southern coast throughout Saturday morning.',
      'A mild breeze will keep the afternoon climate pleasant and dry.',
      'Dense fog is causing major travel delays at London Heathrow.'
    ],
    options_id: [
      'Suhu diperkirakan akan turun di bawah titik beku pada larut Jumat malam.',
      'Badai petir lebat akan melanda pesisir selatan sepanjang Sabtu pagi.',
      'Angin sepoi-sepoi akan menjaga cuaca siang hari tetap hangat dan kering.',
      'Kabut tebal menyebabkan gangguan penerbangan besar di London Heathrow.'
    ],
    notes: 'Kata "temperature" lazim dilafalkan tiga suku kata: /ˈtem.prə.tʃər/.'
  },
  {
    id: 'ls_12',
    mode: 'listening',
    category: 'Economics • Bloomberg News',
    level: 'Advanced',
    en: 'Gross domestic product expanded by three point four percent annualized.',
    target: 'Gross domestic product expanded by three point four percent annualized.',
    phonetic: '/ɡrəʊs dəˈmes.tɪk ˈprɒd.ʌkt ɪkˈspæn.dɪd baɪ θriː pɔɪnt fɔː pəˈsent/',
    id_translation: 'Produk domestik bruto tumbuh sebesar tiga koma empat persen secara tahunan.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Produk domestik bruto tumbuh sebesar tiga koma empat persen secara tahunan."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Gross domestic product expanded by three point four percent annualized."',
    options_en: [
      'Gross domestic product expanded by three point four percent annualized.',
      'Retail spending contracted by two point four percent in November.',
      'Manufacturing output grew by four point three percent year over year.',
      'Export volumes reached seventy-five billion dollars last quarter.'
    ],
    options_id: [
      'Produk domestik bruto tumbuh sebesar tiga koma empat persen secara tahunan.',
      'Belanja ritel mengalami penurunan sebesar dua koma empat persen di bulan November.',
      'Produksi manufaktur meningkat sebesar empat koma tiga persen dibanding tahun lalu.',
      'Volume ekspor menembus angka tujuh puluh lima miliar dolar pada kuartal lalu.'
    ],
    notes: 'Singkatan GDP adalah singkatan dari "Gross Domestic Product".'
  },
  {
    id: 'ls_13',
    mode: 'listening',
    category: 'Transit • Travel Dictation',
    level: 'Beginner',
    en: 'Her train departs from platform six at eleven forty-five.',
    target: 'Her train departs from platform six at eleven forty-five.',
    phonetic: '/hɜː treɪn dɪˈpɑːts frɒm ˈplæt.fɔːm sɪks æt ɪˈlev.ən ˌfɔː.tiˈfaɪv/',
    id_translation: 'Keretanya berangkat dari peron enam pada pukul sebelas empat puluh lima.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Keretanya berangkat dari peron enam pada pukul sebelas empat puluh lima."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Her train departs from platform six at eleven forty-five."',
    options_en: [
      'Her train departs from platform six at eleven forty-five.',
      'The train arrived on platform sixteen at ten forty-five.',
      'Our flight boards at gate six at twelve forty-five.',
      'The express bus leaves station seven at eleven fifteen.'
    ],
    options_id: [
      'Keretanya berangkat dari peron enam pada pukul sebelas empat puluh lima.',
      'Kereta tiba di peron enam belas pada pukul sepuluh empat puluh lima.',
      'Penerbangan kita masuk pesawat di gerbang enam pukul dua belas empat puluh lima.',
      'Bus ekspres meninggalkan halte tujuh pada pukul sebelas lima belas.'
    ],
    notes: 'Perhatikan perbedaan angka peron "six" dan "sixteen".'
  },
  {
    id: 'ls_14',
    mode: 'listening',
    category: 'Research • NPR Social Science',
    level: 'Intermediate',
    en: 'Approximately seventy-three percent of survey respondents preferred remote work.',
    target: 'Approximately seventy-three percent of survey respondents preferred remote work.',
    phonetic: '/əˈprɒk.sɪ.mət.li ˌsev.ən.ti θriː pəˈsent ɒv ˈsɜː.veɪ rɪˈspɒn.dənts/',
    id_translation: 'Sekitar tujuh puluh tiga persen responden survei lebih memilih bekerja dari jarak jauh.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Sekitar tujuh puluh tiga persen responden survei lebih memilih bekerja dari jarak jauh."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Approximately seventy-three percent of survey respondents preferred remote work."',
    options_en: [
      'Approximately seventy-three percent of survey respondents preferred remote work.',
      'Over eighty-three percent of employees requested flexible working hours.',
      'Nearly seventy percent of companies transitioned to hybrid schedules.',
      'About sixty-three percent of managers reported higher productivity.'
    ],
    options_id: [
      'Sekitar tujuh puluh tiga persen responden survei lebih memilih bekerja dari jarak jauh.',
      'Lebih dari delapan puluh tiga persen karyawan meminta jam kerja fleksibel.',
      'Hampir tujuh puluh persen perusahaan beralih ke jadwal kerja campuran (hybrid).',
      'Sekitar enam puluh tiga persen manajer melaporkan produktivitas yang lebih tinggi.'
    ],
    notes: 'Latihan menangkap angka persentase cepat: "seventy-three percent".'
  },
  {
    id: 'ls_15',
    mode: 'listening',
    category: 'Computing • TechLinked',
    level: 'Advanced',
    en: 'The algorithm processed seventeen million transactions in under two seconds.',
    target: 'The algorithm processed seventeen million transactions in under two seconds.',
    phonetic: '/ðiː ˈæl.ɡə.rɪ.ðəm ˈprəʊ.sest ˌsev.ənˈtiːn ˈmɪl.jən trænˈzæk.ʃənz/',
    id_translation: 'Algoritma tersebut memproses tujuh belas juta transaksi dalam waktu kurang dari dua detik.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Algoritma tersebut memproses tujuh belas juta transaksi dalam waktu kurang dari dua detik."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The algorithm processed seventeen million transactions in under two seconds."',
    options_en: [
      'The algorithm processed seventeen million transactions in under two seconds.',
      'The database handled seventy million records in less than ten seconds.',
      'The server received seventeen thousand requests within one minute.',
      'The neural network trained on seven million images in three hours.'
    ],
    options_id: [
      'Algoritma tersebut memproses tujuh belas juta transaksi dalam waktu kurang dari dua detik.',
      'Basis data menangani tujuh puluh juta catatan dalam waktu kurang dari sepuluh detik.',
      'Server menerima tujuh belas ribu permintaan dalam kurun waktu satu menit.',
      'Jaringan saraf tiruan dilatih menggunakan tujuh juta gambar dalam tiga jam.'
    ],
    notes: 'Bedakan "seventeen million" (17.000.000) dengan "seventy million" (70.000.000).'
  },
  {
    id: 'ls_16',
    mode: 'listening',
    category: 'Commerce • Everyday English',
    level: 'Beginner',
    en: 'The store opens at eight in the morning and closes at nine at night.',
    target: 'The store opens at eight in the morning and closes at nine at night.',
    phonetic: '/ðə stɔːr ˈəʊ.pənz æt eɪt ɪn ðə ˈmɔː.nɪŋ ænd ˈkləʊ.zɪz æt naɪn æt naɪt/',
    id_translation: 'Toko buka pukul delapan pagi dan tutup pukul sembilan malam.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Toko buka pukul delapan pagi dan tutup pukul sembilan malam."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The store opens at eight in the morning and closes at nine at night."',
    options_en: [
      'The store opens at eight in the morning and closes at nine at night.',
      'The library opens at nine in the morning and closes at eight at night.',
      'The pharmacy is open twenty-four hours every single day.',
      'The bank operates from eight thirty AM until four PM weekdays.'
    ],
    options_id: [
      'Toko buka pukul delapan pagi dan tutup pukul sembilan malam.',
      'Perpustakaan buka pukul sembilan pagi dan tutup pukul delapan malam.',
      'Apotek ini buka dua puluh empat jam setiap hari.',
      'Bank beroperasi dari pukul delapan tiga puluh pagi hingga empat sore pada hari kerja.'
    ],
    notes: 'Kombinasi waktu jam dasar yang sangat sering dijumpai sehari-hari.'
  },
  {
    id: 'ls_17',
    mode: 'listening',
    category: 'Pricing • British Council LearnEnglish',
    level: 'Intermediate',
    en: 'Tickets cost thirty-nine pounds for adults and nineteen pounds for students.',
    target: 'Tickets cost thirty-nine pounds for adults and nineteen pounds for students.',
    phonetic: '/ˈtɪk.ɪts kɒst ˌθɜː.ti naɪn paʊndz fɔːr ˈæd.ʌlts ænd ˌnaɪnˈtiːn paʊndz/',
    id_translation: 'Harga tiket adalah tiga puluh sembilan pound untuk dewasa dan sembilan belas pound untuk pelajar.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Harga tiket adalah tiga puluh sembilan pound untuk dewasa dan sembilan belas pound untuk pelajar."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Tickets cost thirty-nine pounds for adults and nineteen pounds for students."',
    options_en: [
      'Tickets cost thirty-nine pounds for adults and nineteen pounds for students.',
      'Admission is forty-nine pounds for seniors and twenty-nine for children.',
      'Tickets are thirty pounds each if booked at least two weeks in advance.',
      'Group tickets for ten people are available for one hundred ninety pounds.'
    ],
    options_id: [
      'Harga tiket adalah tiga puluh sembilan pound untuk dewasa dan sembilan belas pound untuk pelajar.',
      'Biaya masuk adalah empat puluh sembilan pound untuk lansia dan dua puluh sembilan untuk anak-anak.',
      'Tiket seharga tiga puluh pound per orang jika dipesan minimal dua minggu sebelumnya.',
      'Tiket rombongan untuk sepuluh orang tersedia seharga seratus sembilan puluh pound.'
    ],
    notes: 'Mata uang Inggris "pounds" dilafalkan /paʊndz/.'
  },
  {
    id: 'ls_18',
    mode: 'listening',
    category: 'Environment • BBC News',
    level: 'Advanced',
    en: 'Carbon emissions have decreased by fourteen point six percent over five years.',
    target: 'Carbon emissions have decreased by fourteen point six percent over five years.',
    phonetic: '/ˈkɑː.bən ɪˈmɪʃ.ənz hæv dɪˈkriːst baɪ ˌfɔːˈtiːn pɔɪnt sɪks pəˈsent/',
    id_translation: 'Emisi karbon telah berkurang sebesar empat belas koma enam persen selama lima tahun.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Emisi karbon telah berkurang sebesar empat belas koma enam persen selama lima tahun."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Carbon emissions have decreased by fourteen point six percent over five years."',
    options_en: [
      'Carbon emissions have decreased by fourteen point six percent over five years.',
      'Renewable energy capacity expanded by forty point six percent since twenty twenty.',
      'Deforestation rates dropped by four point six percent across the Amazon basin.',
      'Air quality index improved by fourteen percent in metropolitan zones.'
    ],
    options_id: [
      'Emisi karbon telah berkurang sebesar empat belas koma enam persen selama lima tahun.',
      'Kapasitas energi terbarukan melesat empat puluh koma enam persen sejak tahun dua puluh dua puluh.',
      'Laju penggundulan hutan turun empat koma enam persen di seluruh cekungan Amazon.',
      'Indeks kualitas udara membaik sebesar empat belas persen di kawasan metropolitan.'
    ],
    notes: 'Dengarkan angka "fourteen point six" (/ˌfɔːˈtiːn pɔɪnt sɪks/).'
  },
  {
    id: 'ls_19',
    mode: 'listening',
    category: 'Telephony • Numblr Practice',
    level: 'Beginner',
    en: 'Call me back at five five five, zero one nine four as soon as you can.',
    target: 'Call me back at five five five, zero one nine four as soon as you can.',
    phonetic: '/kɔːl miː bæk æt faɪv faɪv faɪv ˈzɪə.rəʊ wʌn naɪn fɔːr/',
    id_translation: 'Hubungi saya kembali di nomor lima lima lima, nol satu sembilan empat sesegera mungkin.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Hubungi saya kembali di nomor lima lima lima, nol satu sembilan empat sesegera mungkin."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Call me back at five five five, zero one nine four as soon as you can."',
    options_en: [
      'Call me back at five five five, zero one nine four as soon as you can.',
      'Send a text message to five five five, zero nine one four immediately.',
      'My temporary office phone is five five five, zero one four nine.',
      'Please leave your contact number at the reception desk upon arrival.'
    ],
    options_id: [
      'Hubungi saya kembali di nomor lima lima lima, nol satu sembilan empat sesegera mungkin.',
      'Kirimkan pesan teks ke nomor lima lima lima, nol sembilan satu empat segera.',
      'Nomor telepon kantor sementara saya adalah lima lima lima, nol satu empat sembilan.',
      'Tolong tinggalkan nomor kontak Anda di meja resepsionis saat tiba.'
    ],
    notes: 'Latihan dikte urutan nomor telepon dalam Bahasa Inggris standar.'
  },
  {
    id: 'ls_20',
    mode: 'listening',
    category: 'Logistics • Everyday Dictation',
    level: 'Intermediate',
    en: 'The package weighs approximately two point five kilograms.',
    target: 'The package weighs approximately two point five kilograms.',
    phonetic: '/ðə ˈpæk.ɪdʒ weɪz əˈprɒk.sɪ.mət.li tuː pɔɪnt faɪv ˈkɪl.ə.ɡræmz/',
    id_translation: 'Paket tersebut memiliki berat sekitar dua koma lima kilogram.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Paket tersebut memiliki berat sekitar dua koma lima kilogram."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The package weighs approximately two point five kilograms."',
    options_en: [
      'The package weighs approximately two point five kilograms.',
      'The shipment contains twelve items and weighs five point two kilograms.',
      'Excess baggage costs twenty-five dollars per additional kilogram.',
      'The dimensions of the parcel exceed maximum postal limits.'
    ],
    options_id: [
      'Paket tersebut memiliki berat sekitar dua koma lima kilogram.',
      'Pengiriman berisi dua belas barang dan memiliki berat lima koma dua kilogram.',
      'Kelebihan bagasi dikenakan biaya dua puluh lima dolar per kilogram tambahan.',
      'Ukuran paket melebihi batas ketentuan pos yang berlaku.'
    ],
    notes: 'Pelafalan kata "weighs" berima dengan "days" (/weɪz/).'
  },

  /* ========================================================================
     3. VOCABULARY & COLLOCATIONS (20 SOAL)
     ======================================================================== */
  {
    id: 'vc_01',
    mode: 'vocabulary',
    category: 'Anki High-Yield • Verbal Advantage',
    level: 'Intermediate',
    en: 'She made a profound impact on the entire research team.',
    target: 'She made a profound impact on the entire research team.',
    missingWord: 'profound',
    prompt_en: 'Fill in the blank: "She made a ________ impact on the entire research team."',
    prompt_id: 'Lengkapi kalimat: "Dia memberikan dampak yang sangat mendalam (________) pada seluruh tim penelitian."',
    options: ['profound', 'shallow', 'trivial', 'negligible'],
    correctIndex: 0,
    phonetic: '/prəˈfaʊnd/',
    id_translation: 'Dia memberikan dampak yang sangat mendalam pada seluruh tim peneliti.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Dia memberikan dampak yang sangat mendalam pada seluruh tim peneliti."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "She made a profound impact on the entire research team."',
    notes: '"Profound" berkolokasi kuat dengan "impact", "effect", atau "wisdom".'
  },
  {
    id: 'vc_02',
    mode: 'vocabulary',
    category: 'Academic English • Collocations',
    level: 'Intermediate',
    en: 'The government will implement new policies next month.',
    target: 'The government will implement new policies next month.',
    missingWord: 'implement',
    prompt_en: 'Choose the best word: "The government will ________ new policies next month."',
    prompt_id: 'Pilih kata yang tepat: "Pemerintah akan menerapkan (________) kebijakan baru bulan depan."',
    options: ['implement', 'invent', 'fabricate', 'whisper'],
    correctIndex: 0,
    phonetic: '/ˈɪm.plɪ.ment/',
    id_translation: 'Pemerintah akan menerapkan kebijakan-kebijakan baru bulan depan.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Pemerintah akan menerapkan kebijakan-kebijakan baru bulan depan."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The government will implement new policies next month."',
    notes: '"Implement" sering digunakan dalam konteks resmi/bisnis untuk kebijakan atau rencana.'
  },
  {
    id: 'vc_03',
    mode: 'vocabulary',
    category: 'Everyday Idioms • BBC English',
    level: 'Beginner',
    en: 'We have accomplished a lot today, so let us call it a day.',
    target: 'We have accomplished a lot today, so let us call it a day.',
    missingWord: 'call it a day',
    prompt_en: 'Choose the idiom: "We have accomplished a lot today, so let us ________."',
    prompt_id: 'Pilih idiom yang tepat untuk menyudahi pekerjaan hari ini: "Mari kita ________."',
    options: ['call it a day', 'hit the road', 'break a leg', 'spill the beans'],
    correctIndex: 0,
    phonetic: '/kɔːl ɪt ə deɪ/',
    id_translation: 'Kita sudah menyelesaikan banyak hal hari ini, jadi mari kita sudahi pekerjaan hari ini.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Kita sudah menyelesaikan banyak hal hari ini, jadi mari kita sudahi pekerjaan hari ini."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "We have accomplished a lot today, so let us call it a day."',
    notes: '"Call it a day" adalah idiom untuk berhenti bekerja setelah seharian beraktivitas.'
  },
  {
    id: 'vc_04',
    mode: 'vocabulary',
    category: 'Advanced Vocab • Verbal Advantage',
    level: 'Advanced',
    en: 'Smartphones have become ubiquitous across modern society.',
    target: 'Smartphones have become ubiquitous across modern society.',
    missingWord: 'ubiquitous',
    prompt_en: 'Choose the word meaning "found everywhere": "Smartphones have become ________ across modern society."',
    prompt_id: 'Pilih kata yang bermakna "ada di mana-mana": "Ponsel pintar telah menjadi ________ di masyarakat modern."',
    options: ['ubiquitous', 'scarce', 'isolated', 'redundant'],
    correctIndex: 0,
    phonetic: '/juːˈbɪk.wɪ.təs/',
    id_translation: 'Ponsel pintar telah ada di mana-mana (hadir serentak) di seluruh masyarakat modern.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Ponsel pintar telah ada di mana-mana di seluruh masyarakat modern."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Smartphones have become ubiquitous across modern society."',
    notes: '"Ubiquitous" (/juːˈbɪk.wɪ.təs/) berarti hadir atau ditemukan di mana-mana.'
  },
  {
    id: 'vc_05',
    mode: 'vocabulary',
    category: 'Business English • Collocations',
    level: 'Intermediate',
    en: 'We must take a pragmatic approach to solve this logistics bottleneck.',
    target: 'We must take a pragmatic approach to solve this logistics bottleneck.',
    missingWord: 'pragmatic',
    prompt_en: 'Choose the word meaning "practical and realistic": "We must take a ________ approach."',
    prompt_id: 'Pilih kata yang bermakna "praktis dan realistis": "Kita harus mengambil pendekatan yang ________."',
    options: ['pragmatic', 'dogmatic', 'fictional', 'dramatic'],
    correctIndex: 0,
    phonetic: '/præɡˈmæt.ɪk/',
    id_translation: 'Kita harus mengambil pendekatan pragmatis (praktis) untuk mengatasi hambatan logistik ini.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Kita harus mengambil pendekatan pragmatis untuk mengatasi hambatan logistik ini."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "We must take a pragmatic approach to solve this logistics bottleneck."',
    notes: '"Pragmatic" menekankan solusi praktis yang terbukti bekerja di dunia nyata.'
  },
  {
    id: 'vc_06',
    mode: 'vocabulary',
    category: 'Precision Vocab • Verbal Advantage',
    level: 'Advanced',
    en: 'The engineer conducted a meticulous inspection of every component.',
    target: 'The engineer conducted a meticulous inspection of every component.',
    missingWord: 'meticulous',
    prompt_en: 'Choose the word meaning "extremely careful and precise": "Conducted a ________ inspection."',
    prompt_id: 'Pilih kata yang bermakna "sangat teliti dan cermat": "Melakukan pemeriksaan yang ________."',
    options: ['meticulous', 'careless', 'hasty', 'vague'],
    correctIndex: 0,
    phonetic: '/məˈtɪk.jə.ləs/',
    id_translation: 'Insinyur itu melakukan pemeriksaan yang sangat teliti terhadap setiap komponen.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Insinyur itu melakukan pemeriksaan yang sangat teliti terhadap setiap komponen."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The engineer conducted a meticulous inspection of every component."',
    notes: '"Meticulous" (/məˈtɪk.jə.ləs/) sering berpasangan dengan "inspection", "research", atau "planning".'
  },
  {
    id: 'vc_07',
    mode: 'vocabulary',
    category: 'Psychology • Sentence Mining',
    level: 'Intermediate',
    en: 'Children often demonstrate remarkable resilience when facing major changes.',
    target: 'Children often demonstrate remarkable resilience when facing major changes.',
    missingWord: 'resilience',
    prompt_en: 'Choose the noun meaning "ability to recover quickly": "Demonstrate remarkable ________."',
    prompt_id: 'Pilih kata benda yang berarti "daya tahan / ketangguhan": "Menunjukkan ________ yang luar biasa."',
    options: ['resilience', 'hesitation', 'fragility', 'reluctance'],
    correctIndex: 0,
    phonetic: '/rɪˈzɪl.jəns/',
    id_translation: 'Anak-anak sering kali menunjukkan ketangguhan yang luar biasa saat menghadapi perubahan besar.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Anak-anak sering kali menunjukkan ketangguhan yang luar biasa saat menghadapi perubahan besar."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Children often demonstrate remarkable resilience when facing major changes."',
    notes: '"Resilience" adalah kemampuan untuk pulih dan bangkit dari kesulitan.'
  },
  {
    id: 'vc_08',
    mode: 'vocabulary',
    category: 'Finance • Business English',
    level: 'Advanced',
    en: 'The company negotiated a lucrative contract with international suppliers.',
    target: 'The company negotiated a lucrative contract with international suppliers.',
    missingWord: 'lucrative',
    prompt_en: 'Choose the word meaning "producing great profit": "Negotiated a ________ contract."',
    prompt_id: 'Pilih kata yang berarti "sangat menguntungkan secara finansial": "Menegosiasikan kontrak yang ________."',
    options: ['lucrative', 'detrimental', 'bankrupt', 'tedious'],
    correctIndex: 0,
    phonetic: '/ˈluː.krə.tɪv/',
    id_translation: 'Perusahaan menegosiasikan kontrak yang sangat menguntungkan dengan pemasok internasional.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Perusahaan menegosiasikan kontrak yang sangat menguntungkan dengan pemasok internasional."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The company negotiated a lucrative contract with international suppliers."',
    notes: '"Lucrative" sinonim elegan dari "highly profitable".'
  },
  {
    id: 'vc_09',
    mode: 'vocabulary',
    category: 'Economics • Sentence Mining',
    level: 'Intermediate',
    en: 'Cryptocurrency markets are known for being exceptionally volatile.',
    target: 'Cryptocurrency markets are known for being exceptionally volatile.',
    missingWord: 'volatile',
    prompt_en: 'Choose the word meaning "liable to change rapidly": "Markets are exceptionally ________."',
    prompt_id: 'Pilih kata yang bermakna "fluktuatif / mudah berubah tajam": "Pasar dikenal sangat ________."',
    options: ['volatile', 'stable', 'permanent', 'predictable'],
    correctIndex: 0,
    phonetic: '/ˈvɒl.ə.taɪl/',
    id_translation: 'Pasar mata uang kripto dikenal sangat bergejolak dan mudah berubah drastis.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Pasar mata uang kripto dikenal sangat bergejolak dan mudah berubah drastis."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Cryptocurrency markets are known for being exceptionally volatile."',
    notes: '"Volatile" digunakan untuk mendeskripsikan harga saham, emosi, atau situasi yang tidak stabil.'
  },
  {
    id: 'vc_10',
    mode: 'vocabulary',
    category: 'Literature • Verbal Advantage',
    level: 'Advanced',
    en: 'Social media fame is often ephemeral and fades quickly.',
    target: 'Social media fame is often ephemeral and fades quickly.',
    missingWord: 'ephemeral',
    prompt_en: 'Choose the word meaning "lasting for a very short time": "Fame is often ________."',
    prompt_id: 'Pilih kata yang bermakna "bersifat sementara / cepat lenyap": "Ketenaran sering kali ________."',
    options: ['ephemeral', 'everlasting', 'durable', 'perpetual'],
    correctIndex: 0,
    phonetic: '/ɪˈfem.ər.əl/',
    id_translation: 'Ketenaran di media sosial sering kali bersifat sesaat dan memudar dengan cepat.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Ketenaran di media sosial sering kali bersifat sesaat dan memudar dengan cepat."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Social media fame is often ephemeral and fades quickly."',
    notes: '"Ephemeral" (/ɪˈfem.ər.əl/) berarti fana atau berlangsung singkat.'
  },
  {
    id: 'vc_11',
    mode: 'vocabulary',
    category: 'Idioms • Luke’s English Podcast',
    level: 'Beginner',
    en: 'I had to bite the bullet and tell my manager the bad news.',
    target: 'I had to bite the bullet and tell my manager the bad news.',
    missingWord: 'bite the bullet',
    prompt_en: 'Choose the idiom meaning "face a difficult situation with courage": "I had to ________."',
    prompt_id: 'Pilih idiom yang berarti "memberanikan diri menghadapi hal sulit": "Saya harus ________."',
    options: ['bite the bullet', 'burn the bridge', 'jump the gun', 'hit the sack'],
    correctIndex: 0,
    phonetic: '/baɪt ðə ˈbʊl.ɪt/',
    id_translation: 'Saya terpaksa memberanikan diri dan menyampaikan kabar buruk itu kepada manajer saya.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Saya terpaksa memberanikan diri dan menyampaikan kabar buruk itu kepada manajer saya."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "I had to bite the bullet and tell my manager the bad news."',
    notes: '"Bite the bullet" berasal dari zaman militer saat prajurit menggigit peluru untuk menahan sakit.'
  },
  {
    id: 'vc_12',
    mode: 'vocabulary',
    category: 'Corporate • Collocations',
    level: 'Intermediate',
    en: 'Our team needs to mitigate the potential risks before launching.',
    target: 'Our team needs to mitigate the potential risks before launching.',
    missingWord: 'mitigate',
    prompt_en: 'Choose the word meaning "make less severe": "Needs to ________ the potential risks."',
    prompt_id: 'Pilih kata yang bermakna "memitigasi / mengurangi keparahan": "Perlu ________ risiko potensial."',
    options: ['mitigate', 'escalate', 'provoke', 'multiply'],
    correctIndex: 0,
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    id_translation: 'Tim kami perlu memitigasi risiko potensial sebelum peluncuran dilakukan.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Tim kami perlu memitigasi risiko potensial sebelum peluncuran dilakukan."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Our team needs to mitigate the potential risks before launching."',
    notes: '"Mitigate risks" adalah kolokasi standar dalam manajemen proyek internasional.'
  },
  {
    id: 'vc_13',
    mode: 'vocabulary',
    category: 'Debate • Verbal Advantage',
    level: 'Advanced',
    en: 'His argument was so compelling that even skeptics were persuaded.',
    target: 'His argument was so compelling that even skeptics were persuaded.',
    missingWord: 'compelling',
    prompt_en: 'Choose the word meaning "powerfully convincing": "His argument was so ________."',
    prompt_id: 'Pilih kata yang bermakna "sangat meyakinkan dan memikat": "Argumennya begitu ________."',
    options: ['compelling', 'flimsy', 'unconvincing', 'shallow'],
    correctIndex: 0,
    phonetic: '/kəmˈpel.ɪŋ/',
    id_translation: 'Argumennya begitu kuat dan memikat sehingga orang yang ragu pun akhirnya teryakinkan.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Argumennya begitu kuat dan memikat sehingga orang yang ragu pun akhirnya teryakinkan."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "His argument was so compelling that even skeptics were persuaded."',
    notes: '"Compelling" sering dipakai untuk alasan ("compelling reason") atau cerita ("compelling story").'
  },
  {
    id: 'vc_14',
    mode: 'vocabulary',
    category: 'Everyday Idioms • BBC English',
    level: 'Beginner',
    en: 'You should not cut corners when it comes to construction safety.',
    target: 'You should not cut corners when it comes to construction safety.',
    missingWord: 'cut corners',
    prompt_en: 'Choose the idiom meaning "do something in a cheap or careless way": "Should not ________."',
    prompt_id: 'Pilih idiom yang bermakna "mengambil jalan pintas yang ceroboh / mengabaikan standar": "Tidak boleh ________."',
    options: ['cut corners', 'push the envelope', 'throw in the towel', 'break the ice'],
    correctIndex: 0,
    phonetic: '/kʌt ˈkɔː.nərz/',
    id_translation: 'Anda tidak boleh mengambil jalan pintas yang ceroboh jika menyangkut keselamatan konstruksi.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Anda tidak boleh mengambil jalan pintas yang ceroboh jika menyangkut keselamatan konstruksi."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "You should not cut corners when it comes to construction safety."',
    notes: '"Cut corners" berarti mengorbankan kualitas atau standar demi menghemat waktu/uang.'
  },
  {
    id: 'vc_15',
    mode: 'vocabulary',
    category: 'Governance • Collocations',
    level: 'Intermediate',
    en: 'The committee worked hard to reach a consensus on the project timeline.',
    target: 'The committee worked hard to reach a consensus on the project timeline.',
    missingWord: 'consensus',
    prompt_en: 'Choose the word meaning "general agreement": "Worked hard to reach a ________."',
    prompt_id: 'Pilih kata yang bermakna "kesepakatan bersama / mufakat": "Berusaha keras mencapai ________."',
    options: ['consensus', 'discord', 'stalemate', 'controversy'],
    correctIndex: 0,
    phonetic: '/kənˈsen.səs/',
    id_translation: 'Komite bekerja keras untuk mencapai mufakat (kesepakatan bersama) mengenai linimasa proyek.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Komite bekerja keras untuk mencapai mufakat mengenai linimasa proyek."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The committee worked hard to reach a consensus on the project timeline."',
    notes: 'Kolokasi: "reach a consensus" (mencapai mufakat).'
  },
  {
    id: 'vc_16',
    mode: 'vocabulary',
    category: 'Public Speaking • Verbal Advantage',
    level: 'Advanced',
    en: 'Her explanation was clear and eloquent, captivating the audience.',
    target: 'Her explanation was clear and eloquent, captivating the audience.',
    missingWord: 'eloquent',
    prompt_en: 'Choose the word meaning "fluent or persuasive in speaking": "Clear and ________."',
    prompt_id: 'Pilih kata yang bermakna "fasih dan memikat dalam bertutur kata": "Jelas dan ________."',
    options: ['eloquent', 'inarticulate', 'stuttering', 'clumsy'],
    correctIndex: 0,
    phonetic: '/ˈel.ə.kwənt/',
    id_translation: 'Penjelasannya sangat jelas dan fasih memikat, memesona seluruh audiens.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Penjelasannya sangat jelas dan fasih memikat, memesona seluruh audiens."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Her explanation was clear and eloquent, captivating the audience."',
    notes: '"Eloquent" (/ˈel.ə.kwənt/) adalah kualitas orang yang bertutur kata anggun dan persuasif.'
  },
  {
    id: 'vc_17',
    mode: 'vocabulary',
    category: 'Idioms • All Ears English',
    level: 'Beginner',
    en: 'We do not always see eye to eye, but we respect each other.',
    target: 'We do not always see eye to eye, but we respect each other.',
    missingWord: 'see eye to eye',
    prompt_en: 'Choose the idiom meaning "agree with each other": "We do not always ________."',
    prompt_id: 'Pilih idiom yang bermakna "sependapat / bersepakat": "Kami tidak selalu ________."',
    options: ['see eye to eye', 'play it by ear', 'let the cat out', 'beat around the bush'],
    correctIndex: 0,
    phonetic: '/siː aɪ tuː aɪ/',
    id_translation: 'Kami tidak selalu sependapat, tetapi kami saling menghormati satu sama lain.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Kami tidak selalu sependapat, tetapi kami saling menghormati satu sama lain."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "We do not always see eye to eye, but we respect each other."',
    notes: '"See eye to eye" berarti sepakat atau memiliki pandangan yang persis sama.'
  },
  {
    id: 'vc_18',
    mode: 'vocabulary',
    category: 'Management • Collocations',
    level: 'Intermediate',
    en: 'The new CEO introduced measures to streamline daily administrative tasks.',
    target: 'The new CEO introduced measures to streamline daily administrative tasks.',
    missingWord: 'streamline',
    prompt_en: 'Choose the verb meaning "make more efficient": "Measures to ________ tasks."',
    prompt_id: 'Pilih kata kerja yang berarti "merampingkan / mengefisienkan proses": "Langkah untuk ________ tugas."',
    options: ['streamline', 'complicate', 'impede', 'prolong'],
    correctIndex: 0,
    phonetic: '/ˈstriːm.laɪn/',
    id_translation: 'CEO baru memperkenalkan langkah-langkah untuk merampingkan dan mengefisienkan tugas administratif harian.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "CEO baru memperkenalkan langkah-langkah untuk merampingkan tugas administratif harian."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The new CEO introduced measures to streamline daily administrative tasks."',
    notes: '"Streamline" sering digunakan dalam perampingan birokrasi atau alur kerja digital.'
  },
  {
    id: 'vc_19',
    mode: 'vocabulary',
    category: 'Advanced Vocab • Verbal Advantage',
    level: 'Advanced',
    en: 'The scientist showed an insatiable curiosity for unraveling complex enigmas.',
    target: 'The scientist showed an insatiable curiosity for unraveling complex enigmas.',
    missingWord: 'insatiable',
    prompt_en: 'Choose the word meaning "impossible to satisfy": "An ________ curiosity."',
    prompt_id: 'Pilih kata yang berarti "tak pernah terpuaskan / selalu haus akan sesuatu": "Rasa ingin tahu yang ________."',
    options: ['insatiable', 'satisfied', 'indifferent', 'apathetic'],
    correctIndex: 0,
    phonetic: '/ɪnˈseɪ.ʃə.bəl/',
    id_translation: 'Ilmuwan itu menunjukkan rasa ingin tahu yang tak pernah terpuaskan dalam memecahkan teka-teki rumit.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Ilmuwan itu menunjukkan rasa ingin tahu yang tak pernah terpuaskan dalam memecahkan teka-teki rumit."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The scientist showed an insatiable curiosity for unraveling complex enigmas."',
    notes: '"Insatiable" (/ɪnˈseɪ.ʃə.bəl/) berkolokasi dengan "curiosity", "appetite", atau "desire".'
  },
  {
    id: 'vc_20',
    mode: 'vocabulary',
    category: 'Phrasal Verbs • Sink In App',
    level: 'Beginner',
    en: 'Could you shed light on why the deadline was postponed?',
    target: 'Could you shed light on why the deadline was postponed?',
    missingWord: 'shed light on',
    prompt_en: 'Choose the expression meaning "clarify or explain": "Could you ________ why?"',
    prompt_id: 'Pilih ungkapan yang bermakna "menerangkan / memperjelas alasan": "Bisakah Anda ________ mengapa tenggat diundur?"',
    options: ['shed light on', 'turn a blind eye to', 'give the green light to', 'put on the back burner'],
    correctIndex: 0,
    phonetic: '/ʃed laɪt ɒn/',
    id_translation: 'Bisakah Anda memperjelas alasan mengapa tenggat waktu tersebut ditunda?',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Bisakah Anda memperjelas alasan mengapa tenggat waktu tersebut ditunda?"',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Could you shed light on why the deadline was postponed?"',
    notes: '"Shed light on" berarti memberikan penjelasan yang membuat masalah menjadi terang/jelas.'
  },

  /* ========================================================================
     4. RAYMOND MURPHY GRAMMAR QUEST (20 SOAL)
     ======================================================================== */
  {
    id: 'gm_01',
    mode: 'grammar',
    category: 'Raymond Murphy • Conditionals (Unit 38)',
    level: 'Intermediate',
    en: 'If I had known about the traffic, I would have left earlier.',
    target: 'If I had known about the traffic, I would have left earlier.',
    missingWord: 'had known',
    prompt_en: 'Murphy Grammar: "If I ________ (know) about the traffic, I would have left earlier."',
    prompt_id: 'Murphy Grammar: "Seandainya saya tahu (________) tentang macet itu, saya pasti berangkat lebih awal."',
    options: ['had known', 'knew', 'have known', 'know'],
    correctIndex: 0,
    phonetic: '/ɪf aɪ hæd nəʊn əˈbaʊt ðə ˈtræf.ɪk/',
    id_translation: 'Seandainya saya tahu soal kemacetan itu, saya pasti sudah berangkat lebih awal.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Seandainya saya tahu soal kemacetan itu, saya pasti sudah berangkat lebih awal."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "If I had known about the traffic, I would have left earlier."',
    notes: 'Third Conditional untuk penyesalan masa lampau: If + past perfect, would have + V3.'
  },
  {
    id: 'gm_02',
    mode: 'grammar',
    category: 'Raymond Murphy • Present Perfect vs Past (Unit 7)',
    level: 'Beginner',
    en: 'She has lived in London for five years, and she still loves it there.',
    target: 'She has lived in London for five years, and she still loves it there.',
    missingWord: 'has lived',
    prompt_en: 'Murphy Grammar: "She ________ (live) in London for five years, and she still loves it there."',
    prompt_id: 'Murphy Grammar: "Dia telah tinggal (________) di London selama lima tahun, dan masih menyukainya."',
    options: ['has lived', 'lived', 'is living', 'lives'],
    correctIndex: 0,
    phonetic: '/ʃiː hæz lɪvd ɪn ˈlʌn.dən fɔː faɪv jɪəz/',
    id_translation: 'Dia telah tinggal di London selama lima tahun (dan masih menetap di sana hingga kini).',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Dia telah tinggal di London selama lima tahun, dan dia masih menyukainya di sana."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "She has lived in London for five years, and she still loves it there."',
    notes: 'Present Perfect digunakan karena aksinya dimulai di masa lalu dan masih berlanjut.'
  },
  {
    id: 'gm_03',
    mode: 'grammar',
    category: 'Raymond Murphy • First Conditional (Unit 37)',
    level: 'Beginner',
    en: 'If it rains tomorrow, we will cancel the outdoor picnic.',
    target: 'If it rains tomorrow, we will cancel the outdoor picnic.',
    missingWord: 'will cancel',
    prompt_en: 'Murphy Grammar: "If it rains tomorrow, we ________ (cancel) the outdoor picnic."',
    prompt_id: 'Murphy Grammar: "Jika besok hujan, kami akan membatalkan (________) piknik luar ruangan."',
    options: ['will cancel', 'would cancel', 'cancelled', 'cancel'],
    correctIndex: 0,
    phonetic: '/ɪf ɪt reɪnz təˈmɒr.əʊ wiː wɪl ˈkæn.səl/',
    id_translation: 'Jika besok hujan, kita akan membatalkan piknik di luar ruangan.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Jika besok hujan, kita akan membatalkan piknik di luar ruangan."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "If it rains tomorrow, we will cancel the outdoor picnic."',
    notes: 'First Conditional untuk kemungkinan masa depan yang nyata: If + Present Simple, will + V1.'
  },
  {
    id: 'gm_04',
    mode: 'grammar',
    category: 'Raymond Murphy • Second Conditional (Unit 38)',
    level: 'Intermediate',
    en: 'If I had a million dollars, I would travel around the world.',
    target: 'If I had a million dollars, I would travel around the world.',
    missingWord: 'would travel',
    prompt_en: 'Murphy Grammar: "If I had a million dollars, I ________ (travel) around the world."',
    prompt_id: 'Murphy Grammar: "Seandainya saya punya satu juta dolar, saya pasti akan bepergian (________) keliling dunia."',
    options: ['would travel', 'will travel', 'travelled', 'have travelled'],
    correctIndex: 0,
    phonetic: '/ɪf aɪ hæd ə ˈmɪl.jən ˈdɒl.əz aɪ wʊd ˈtræv.əl/',
    id_translation: 'Seandainya saya memiliki satu juta dolar, saya akan berkeliling dunia.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Seandainya saya memiliki satu juta dolar, saya akan berkeliling dunia."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "If I had a million dollars, I would travel around the world."',
    notes: 'Second Conditional untuk situasi imajinatif masa sekarang: If + Past Simple, would + V1.'
  },
  {
    id: 'gm_05',
    mode: 'grammar',
    category: 'Raymond Murphy • Modal Perfects (Unit 33)',
    level: 'Intermediate',
    en: 'You should have informed me about the delay beforehand.',
    target: 'You should have informed me about the delay beforehand.',
    missingWord: 'should have informed',
    prompt_en: 'Murphy Grammar: "You ________ (inform) me about the delay beforehand."',
    prompt_id: 'Murphy Grammar: "Seharusnya kamu memberitahuku (________) tentang penundaan itu sebelumnya."',
    options: ['should have informed', 'should inform', 'must inform', 'could inform'],
    correctIndex: 0,
    phonetic: '/juː ʃʊd hæv ɪnˈfɔːmd miː əˈbaʊt ðə dɪˈleɪ/',
    id_translation: 'Seharusnya Anda memberi tahu saya tentang penundaan tersebut sebelumnya.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Seharusnya Anda memberi tahu saya tentang penundaan tersebut sebelumnya."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "You should have informed me about the delay beforehand."',
    notes: '"Should have + V3" digunakan untuk menyatakan kritik atau penyesalan atas peristiwa masa lalu.'
  },
  {
    id: 'gm_06',
    mode: 'grammar',
    category: 'Raymond Murphy • Passive Voice (Unit 42)',
    level: 'Advanced',
    en: 'The bridge was built in nineteen eighty-five by local engineers.',
    target: 'The bridge was built in nineteen eighty-five by local engineers.',
    missingWord: 'was built',
    prompt_en: 'Murphy Grammar: "The bridge ________ (build) in nineteen eighty-five by local engineers."',
    prompt_id: 'Murphy Grammar: "Jembatan itu dibangun (________) pada tahun 1985 oleh para insinyur lokal."',
    options: ['was built', 'is built', 'built', 'has built'],
    correctIndex: 0,
    phonetic: '/ðə brɪdʒ wɒz bɪlt ɪn ˌnaɪnˈtiːn ˈeɪ.ti faɪv/',
    id_translation: 'Jembatan itu dibangun pada tahun 1985 oleh insinyur-insinyur lokal.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Jembatan itu dibangun pada tahun 1985 oleh insinyur-insinyur lokal."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The bridge was built in nineteen eighty-five by local engineers."',
    notes: 'Past Passive: was/were + V3 (Past Participle).'
  },
  {
    id: 'gm_07',
    mode: 'grammar',
    category: 'Raymond Murphy • Present Perfect Continuous (Unit 9)',
    level: 'Intermediate',
    en: 'He has been studying English since eight o’clock this morning.',
    target: 'He has been studying English since eight o’clock this morning.',
    missingWord: 'has been studying',
    prompt_en: 'Murphy Grammar: "He ________ (study) English since eight o’clock this morning."',
    prompt_id: 'Murphy Grammar: "Dia telah terus belajar (________) Bahasa Inggris sejak pukul delapan pagi ini."',
    options: ['has been studying', 'is studying', 'studied', 'studies'],
    correctIndex: 0,
    phonetic: '/hiː hæz biːn ˈstʌd.i.ɪŋ ˈɪŋ.ɡlɪʃ sɪns eɪt əˈklɒk/',
    id_translation: 'Dia sudah terus belajar Bahasa Inggris sejak pukul delapan pagi ini.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Dia sudah terus belajar Bahasa Inggris sejak pukul delapan pagi ini."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "He has been studying English since eight o’clock this morning."',
    notes: 'Present Perfect Continuous menekankan durasi aksi yang masih berlangsung: has/have been + V-ing.'
  },
  {
    id: 'gm_08',
    mode: 'grammar',
    category: 'Raymond Murphy • Used to (Unit 18)',
    level: 'Beginner',
    en: 'I used to play tennis every weekend when I was in high school.',
    target: 'I used to play tennis every weekend when I was in high school.',
    missingWord: 'used to play',
    prompt_en: 'Murphy Grammar: "I ________ (play) tennis every weekend when I was in high school."',
    prompt_id: 'Murphy Grammar: "Saya dulu terbiasa bermain (________) tenis setiap akhir pekan waktu SMA."',
    options: ['used to play', 'am used to play', 'use to play', 'played to'],
    correctIndex: 0,
    phonetic: '/aɪ ˈjuːst tuː pleɪ ˈten.ɪs ˈev.ri ˌwiːkˈend/',
    id_translation: 'Saya dulu biasa bermain tenis setiap akhir pekan saat masih di sekolah menengah.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Saya dulu biasa bermain tenis setiap akhir pekan saat masih di sekolah menengah."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "I used to play tennis every weekend when I was in high school."',
    notes: '"Used to + V1" untuk kebiasaan masa lalu yang sekarang sudah tidak dilakukan lagi.'
  },
  {
    id: 'gm_09',
    mode: 'grammar',
    category: 'Raymond Murphy • Wishes & Regrets (Unit 39)',
    level: 'Intermediate',
    en: 'I wish I could speak fluent Japanese like my brother.',
    target: 'I wish I could speak fluent Japanese like my brother.',
    missingWord: 'could speak',
    prompt_en: 'Murphy Grammar: "I wish I ________ (can / speak) fluent Japanese like my brother."',
    prompt_id: 'Murphy Grammar: "Saya berharap saya bisa berbicara (________) Bahasa Jepang fasih seperti kakak saya."',
    options: ['could speak', 'can speak', 'spoke able', 'will speak'],
    correctIndex: 0,
    phonetic: '/aɪ wɪʃ aɪ kʊd spiːk ˈfluː.ənt ˌdʒæp.ənˈiːz/',
    id_translation: 'Saya berharap saya bisa berbicara Bahasa Jepang dengan fasih seperti saudara saya.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Saya berharap saya bisa berbicara Bahasa Jepang dengan fasih seperti saudara saya."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "I wish I could speak fluent Japanese like my brother."',
    notes: 'Setelah "wish" untuk kemampuan masa sekarang, gunakan "could + V1".'
  },
  {
    id: 'gm_10',
    mode: 'grammar',
    category: 'Advanced Grammar • Inversion',
    level: 'Advanced',
    en: 'Hardly had the meeting started when the fire alarm rang.',
    target: 'Hardly had the meeting started when the fire alarm rang.',
    missingWord: 'had the meeting started',
    prompt_en: 'Advanced Inversion: "Hardly ________ (the meeting / start) when the fire alarm rang."',
    prompt_id: 'Inversi Tata Bahasa: "Baru saja rapat dimulai (Hardly ________), alarm kebakaran langsung berbunyi."',
    options: ['had the meeting started', 'the meeting had started', 'started the meeting', 'did the meeting start'],
    correctIndex: 0,
    phonetic: '/ˈhɑːd.li hæd ðə ˈmiː.tɪŋ ˈstɑː.tɪd wen ðə ˈfaɪər əˈlɑːm ræŋ/',
    id_translation: 'Baru saja rapat dimulai, alarm kebakaran langsung berbunyi kencang.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Baru saja rapat dimulai, alarm kebakaran langsung berbunyi."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Hardly had the meeting started when the fire alarm rang."',
    notes: 'Inversion setelah kata negatif/restriktif di awal kalimat: Hardly + had + S + V3... when...'
  },
  {
    id: 'gm_11',
    mode: 'grammar',
    category: 'Raymond Murphy • Causative (Unit 46)',
    level: 'Intermediate',
    en: 'I need to have my car repaired before our road trip.',
    target: 'I need to have my car repaired before our road trip.',
    missingWord: 'have my car repaired',
    prompt_en: 'Murphy Grammar: "I need to ________ (repair / my car) before our road trip."',
    prompt_id: 'Murphy Grammar: "Saya harus menyuruh mobil saya diperbaiki (________) sebelum perjalanan kita."',
    options: ['have my car repaired', 'have my car repair', 'repair my car myself', 'got my car repair'],
    correctIndex: 0,
    phonetic: '/aɪ niːd tuː hæv maɪ kɑː rɪˈpeəd bɪˈfɔːr ˈaʊər rəʊd trɪp/',
    id_translation: 'Saya perlu membawa mobil saya ke bengkel untuk diperbaiki sebelum perjalanan darat kita.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Saya perlu memeriksakan mobil saya agar diperbaiki sebelum perjalanan darat kita."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "I need to have my car repaired before our road trip."',
    notes: 'Causative structure: have/get + something + V3 (Past Participle).'
  },
  {
    id: 'gm_12',
    mode: 'grammar',
    category: 'Raymond Murphy • Past Continuous vs Simple (Unit 6)',
    level: 'Beginner',
    en: 'While I was cooking dinner, the phone rang suddenly.',
    target: 'While I was cooking dinner, the phone rang suddenly.',
    missingWord: 'was cooking',
    prompt_en: 'Murphy Grammar: "While I ________ (cook) dinner, the phone rang suddenly."',
    prompt_id: 'Murphy Grammar: "Ketika saya sedang memasak (________) makan malam, telepon berdering tiba-tiba."',
    options: ['was cooking', 'cooked', 'have cooked', 'am cooking'],
    correctIndex: 0,
    phonetic: '/waɪl aɪ wɒz ˈkʊk.ɪŋ ˈdɪn.ər ðə fəʊn ræŋ ˈsʌd.ən.li/',
    id_translation: 'Saat saya sedang memasak makan malam, telepon tiba-tiba berdering.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Saat saya sedang memasak makan malam, telepon tiba-tiba berdering."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "While I was cooking dinner, the phone rang suddenly."',
    notes: 'Past Continuous (was cooking) terinterupsi oleh aksi Past Simple (rang).'
  },
  {
    id: 'gm_13',
    mode: 'grammar',
    category: 'Raymond Murphy • Relative Clauses (Unit 92)',
    level: 'Intermediate',
    en: 'The woman who lives next door is an architect.',
    target: 'The woman who lives next door is an architect.',
    missingWord: 'who',
    prompt_en: 'Murphy Grammar: "The woman ________ lives next door is an architect."',
    prompt_id: 'Murphy Grammar: "Wanita yang (________) tinggal di sebelah rumah adalah seorang arsitek."',
    options: ['who', 'which', 'whom', 'whose'],
    correctIndex: 0,
    phonetic: '/ðə ˈwʊm.ən huː lɪvz nekst dɔːr ɪz ən ˈɑː.kɪ.tekt/',
    id_translation: 'Wanita yang tinggal di sebelah rumah saya adalah seorang arsitek.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Wanita yang tinggal di sebelah rumah saya adalah seorang arsitek."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The woman who lives next door is an architect."',
    notes: '"Who" merujuk pada subjek orang (person), sedangkan "which" untuk benda/binatang.'
  },
  {
    id: 'gm_14',
    mode: 'grammar',
    category: 'Raymond Murphy • Mixed Conditionals (Unit 40)',
    level: 'Advanced',
    en: 'If I had studied harder in college, I would be working in London now.',
    target: 'If I had studied harder in college, I would be working in London now.',
    missingWord: 'would be working',
    prompt_en: 'Mixed Conditional: "If I had studied harder in college, I ________ (work) in London now."',
    prompt_id: 'Mixed Conditional: "Seandainya saya belajar lebih giat waktu kuliah, saya pasti sedang bekerja (________) di London sekarang."',
    options: ['would be working', 'would have worked', 'will work', 'am working'],
    correctIndex: 0,
    phonetic: '/ɪf aɪ hæd ˈstʌd.id ˈhɑː.dər ɪn ˈkɒl.ɪdʒ aɪ wʊd biː ˈwɜː.kɪŋ/',
    id_translation: 'Seandainya saya belajar lebih rajin waktu kuliah dulu, saya pasti sedang bekerja di London sekarang.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Seandainya saya belajar lebih rajin waktu kuliah dulu, saya pasti sedang bekerja di London sekarang."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "If I had studied harder in college, I would be working in London now."',
    notes: 'Mixed Conditional: Kondisi masa lalu (had studied) berakibat pada situasi masa kini (would be working now).'
  },
  {
    id: 'gm_15',
    mode: 'grammar',
    category: 'Raymond Murphy • Prepositions of Time (Unit 121)',
    level: 'Beginner',
    en: 'The concert begins at eight PM on Friday night.',
    target: 'The concert begins at eight PM on Friday night.',
    missingWord: 'at',
    prompt_en: 'Murphy Grammar: "The concert begins ________ eight PM on Friday night."',
    prompt_id: 'Murphy Grammar: "Konser dimulai pada (________) pukul delapan malam di hari Jumat."',
    options: ['at', 'in', 'on', 'by'],
    correctIndex: 0,
    phonetic: '/ðə ˈkɒn.sət bɪˈɡɪnz æt eɪt piː em ɒn ˈfraɪ.deɪ naɪt/',
    id_translation: 'Konser dimulai pada pukul delapan malam pada hari Jumat.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Konser dimulai pada pukul delapan malam pada hari Jumat."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The concert begins at eight PM on Friday night."',
    notes: 'Gunakan preposisi "at" untuk jam/waktu tepat, dan "on" untuk hari/tanggal.'
  },
  {
    id: 'gm_16',
    mode: 'grammar',
    category: 'Raymond Murphy • Contrast Clauses (Unit 113)',
    level: 'Intermediate',
    en: 'Despite the heavy rain, they continued the marathon.',
    target: 'Despite the heavy rain, they continued the marathon.',
    missingWord: 'Despite',
    prompt_en: 'Murphy Grammar: "________ the heavy rain, they continued the marathon."',
    prompt_id: 'Murphy Grammar: "Meskipun (________) hujan lebat, mereka tetap melanjutkan lari maraton."',
    options: ['Despite', 'Although', 'Even though', 'In spite'],
    correctIndex: 0,
    phonetic: '/dɪˈspaɪt ðə ˈhev.i reɪn ðeɪ kənˈtɪn.juːd ðə ˈmær.ə.θən/',
    id_translation: 'Meskipun hujan turun dengan sangat lebat, mereka tetap melanjutkan lomba maraton.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Meskipun hujan turun dengan sangat lebat, mereka tetap melanjutkan lomba maraton."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "Despite the heavy rain, they continued the marathon."',
    notes: '"Despite" diikuti kata benda (noun phrase), sedangkan "Although" harus diikuti klausa (S + V).'
  },
  {
    id: 'gm_17',
    mode: 'grammar',
    category: 'Advanced Grammar • Subjunctive',
    level: 'Advanced',
    en: 'The doctor recommended that he take a few days of complete rest.',
    target: 'The doctor recommended that he take a few days of complete rest.',
    missingWord: 'take',
    prompt_en: 'Subjunctive Mood: "The doctor recommended that he ________ (take) a few days of rest."',
    prompt_id: 'Subjunctive Mood: "Dokter menyarankan agar dia beristirahat (________) total selama beberapa hari."',
    options: ['take', 'takes', 'took', 'will take'],
    correctIndex: 0,
    phonetic: '/ðə ˈdɒk.tər ˌrek.əˈmen.dɪd ðæt hiː teɪk ə fjuː deɪz/',
    id_translation: 'Dokter menyarankan agar dia beristirahat total selama beberapa hari.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Dokter menyarankan agar dia beristirahat total selama beberapa hari."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The doctor recommended that he take a few days of complete rest."',
    notes: 'Subjunctive setelah kata kerja saran (recommend, demand, suggest) menggunakan bentuk kata kerja dasar ("take", bukan "takes").'
  },
  {
    id: 'gm_18',
    mode: 'grammar',
    category: 'Raymond Murphy • Comparatives (Unit 105)',
    level: 'Beginner',
    en: 'This laptop is much faster than my previous computer.',
    target: 'This laptop is much faster than my previous computer.',
    missingWord: 'faster than',
    prompt_en: 'Murphy Grammar: "This laptop is much ________ (fast) my previous computer."',
    prompt_id: 'Murphy Grammar: "Laptop ini jauh lebih cepat daripada (________) komputer saya sebelumnya."',
    options: ['faster than', 'more fast than', 'fast than', 'fastest of'],
    correctIndex: 0,
    phonetic: '/ðɪs ˈlæp.tɒp ɪz mʌtʃ ˈfɑː.stər ðæn maɪ ˈpriː.vi.əs kəmˈpjuː.tər/',
    id_translation: 'Laptop ini jauh lebih cepat daripada komputer saya yang sebelumnya.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Laptop ini jauh lebih cepat daripada komputer saya yang sebelumnya."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "This laptop is much faster than my previous computer."',
    notes: 'Gunakan "much" untuk memperkuat tingkat perbandingan komparatif ("much faster than").'
  },
  {
    id: 'gm_19',
    mode: 'grammar',
    category: 'Raymond Murphy • Reported Speech (Unit 47)',
    level: 'Intermediate',
    en: 'She told me that she had already seen that movie twice.',
    target: 'She told me that she had already seen that movie twice.',
    missingWord: 'had already seen',
    prompt_en: 'Reported Speech: "She told me that she ________ (already / see) that movie twice."',
    prompt_id: 'Reported Speech: "Dia memberitahuku bahwa dia sudah pernah menonton (________) film itu dua kali."',
    options: ['had already seen', 'has already seen', 'already saw', 'is already seeing'],
    correctIndex: 0,
    phonetic: '/ʃiː təʊld miː ðæt ʃiː hæd ɔːlˈred.i siːn ðæt ˈmuː.vi twaɪs/',
    id_translation: 'Dia memberi tahu saya bahwa dia sudah menonton film itu dua kali sebelumnya.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Dia memberi tahu saya bahwa dia sudah menonton film itu dua kali sebelumnya."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "She told me that she had already seen that movie twice."',
    notes: 'Dalam Reported Speech, Present Perfect ("has seen") mundur menjadi Past Perfect ("had seen").'
  },
  {
    id: 'gm_20',
    mode: 'grammar',
    category: 'Advanced Grammar • Passive with Reporting (Unit 45)',
    level: 'Advanced',
    en: 'The company is rumored to be launching a new product next month.',
    target: 'The company is rumored to be launching a new product next month.',
    missingWord: 'is rumored to be',
    prompt_en: 'Passive Reporting: "The company ________ (rumor) launching a new product next month."',
    prompt_id: 'Passive Reporting: "Perusahaan itu dirumorkan sedang bersiap (________) meluncurkan produk baru bulan depan."',
    options: ['is rumored to be', 'rumors to be', 'is rumored that', 'has rumored to'],
    correctIndex: 0,
    phonetic: '/ðə ˈkʌm.pə.ni ɪz ˈruː.məd tuː biː ˈlɔːn.tʃɪŋ ə njuː ˈprɒd.ʌkt/',
    id_translation: 'Perusahaan tersebut dirumorkan akan meluncurkan produk baru pada bulan depan.',
    id_prompt: 'Ucapkan dalam Bahasa Inggris: "Perusahaan tersebut dirumorkan akan meluncurkan produk baru pada bulan depan."',
    en_prompt: 'Terjemahkan ke Bahasa Indonesia: "The company is rumored to be launching a new product next month."',
    notes: 'Struktur pasif impersonal: Subject + is rumored/believed/thought + to be + V-ing.'
  }
];

// Save to data/questions.json
const dataset = {
  version: '2.0.0',
  updated_at: new Date().toISOString().split('T')[0],
  source: 'Awesome English Curated Community Resources (Raymond Murphy, Anki, Refold, BBC, NPR, Hard Fork NYT)',
  total_questions: questions.length,
  summary: {
    shadowing: questions.filter(q => q.mode === 'shadowing').length,
    listening: questions.filter(q => q.mode === 'listening').length,
    vocabulary: questions.filter(q => q.mode === 'vocabulary').length,
    grammar: questions.filter(q => q.mode === 'grammar').length
  },
  questions: questions
};

// Ensure data/ directories exist
const gameDataDir = path.join(__dirname, 'data');
if (!fs.existsSync(gameDataDir)) fs.mkdirSync(gameDataDir, { recursive: true });

const repoDataDir = path.join(__dirname, '..', 'leaderboard-repo', 'data');
if (!fs.existsSync(repoDataDir)) fs.mkdirSync(repoDataDir, { recursive: true });

fs.writeFileSync(path.join(gameDataDir, 'questions.json'), JSON.stringify(dataset, null, 2), 'utf8');
fs.writeFileSync(path.join(repoDataDir, 'questions.json'), JSON.stringify(dataset, null, 2), 'utf8');

console.log(`Generated ${questions.length} questions successfully!`);
console.log(`- Shadowing: ${dataset.summary.shadowing}`);
console.log(`- Listening: ${dataset.summary.listening}`);
console.log(`- Vocabulary: ${dataset.summary.vocabulary}`);
console.log(`- Grammar: ${dataset.summary.grammar}`);
