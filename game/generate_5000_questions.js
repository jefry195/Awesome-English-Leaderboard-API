const fs = require('fs');
const path = require('path');

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const usedSentences = new Set();

/* ============================================================================
   1. SHADOWING (Target: 1,000)
   ============================================================================ */
function generateShadowing(count) {
  const list = [];
  const subjects = [
    { en: 'Artificial intelligence', id: 'Kecerdasan buatan' },
    { en: 'Daily deliberate practice', id: 'Latihan harian yang terarah' },
    { en: 'Effective leadership', id: 'Kepemimpinan yang efektif' },
    { en: 'Active listening', id: 'Mendengarkan secara aktif' },
    { en: 'Curiosity and perseverance', id: 'Rasa ingin tahu dan kegigihan' },
    { en: 'Technological innovation', id: 'Inovasi teknologi' },
    { en: 'Critical thinking', id: 'Pemikiran kritis' },
    { en: 'Continuous self-reflection', id: 'Refleksi diri yang berkelanjutan' },
    { en: 'Cross-functional collaboration', id: 'Kolaborasi lintas fungsi' },
    { en: 'Strategic decision making', id: 'Pengambilan keputusan strategis' },
    { en: 'Sustainable development', id: 'Pembangunan berkelanjutan' },
    { en: 'Emotional intelligence', id: 'Kecerdasan emosional' },
    { en: 'Adaptability in uncertainty', id: 'Kemampuan adaptasi dalam ketidakpastian' },
    { en: 'Creative problem solving', id: 'Pemecahan masalah secara kreatif' },
    { en: 'Clear and honest communication', id: 'Komunikasi yang jelas dan jujur' }
  ];

  const predicates = [
    { en: 'is fundamentally reshaping modern society', id: 'secara mendasar membentuk ulang masyarakat modern' },
    { en: 'plays an indispensable role in achieving career success', id: 'memainkan peran tak tergantikan dalam mencapai kesuksesan karir' },
    { en: 'remains the cornerstone of lifelong learning', id: 'tetap menjadi landasan pembelajaran seumur hidup' },
    { en: 'distinguishes outstanding leaders from ordinary managers', id: 'membedakan pemimpin luar biasa dari manajer biasa' },
    { en: 'empowers professionals to overcome unexpected obstacles', id: 'memberdayakan para profesional untuk mengatasi rintangan tak terduga' },
    { en: 'accelerates scientific breakthroughs across disciplines', id: 'mempercepat terobosan ilmiah di berbagai disiplin ilmu' },
    { en: 'fosters genuine mutual trust within high-performing teams', id: 'menumbuhkan rasa saling percaya sejati dalam tim berkinerja tinggi' },
    { en: 'unlocks untapped potential in international collaborations', id: 'membuka potensi yang belum tergali dalam kolaborasi internasional' },
    { en: 'builds mental resilience during periods of economic crisis', id: 'membangun ketangguhan mental selama masa krisis ekonomi' },
    { en: 'creates sustainable social and environmental impact', id: 'menciptakan dampak sosial dan lingkungan yang berkelanjutan' }
  ];

  const contexts = [
    { en: 'in today’s hyper-connected global village.', id: 'di desa global yang sangat terhubung saat ini.' },
    { en: 'across demanding multinational corporations.', id: 'di seluruh perusahaan multinasional yang kompetitif.' },
    { en: 'when navigating unpredictable market fluctuations.', id: 'saat menavigasi fluktuasi pasar yang tidak terduga.' },
    { en: 'in both personal development and professional endeavors.', id: 'baik dalam pengembangan pribadi maupun usaha profesional.' },
    { en: 'as digital transformation continues to accelerate.', id: 'seiring percepatan transformasi digital yang terus bergulir.' },
    { en: 'under demanding modern workplace dynamics.', id: 'di bawah dinamika tempat kerja modern yang menuntut.' },
    { en: 'throughout long-term research and development.', id: 'sepanjang penelitian dan pengembangan jangka panjang.' },
    { en: 'for individuals striving to reach their fullest potential.', id: 'bagi individu yang berusaha mencapai potensi penuh mereka.' },
    { en: 'in the ongoing pursuit of intellectual mastery.', id: 'dalam pengejaran penguasaan intelektual yang berkelanjutan.' },
    { en: 'especially when addressing pressing climate challenges.', id: 'terutama saat mengatasi tantangan iklim yang mendesak.' }
  ];

  const categories = [
    'Shadowing • Refold Method',
    'Interview • Lex Fridman Podcast',
    'Tech Podcast • Hard Fork NYT',
    'Motivation • BBC 6-Minute English',
    'Mindset • The Tim Ferriss Show',
    'Leadership • TED-Ed Talks'
  ];

  const levels = ['Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

  let idx = 1;
  while (list.length < count) {
    const s = pick(subjects);
    const p = pick(predicates);
    const c = pick(contexts);
    const suffix = idx > 1500 ? ` (Part ${idx})` : '';

    const enSentence = `${s.en} ${p.en} ${c.en}${suffix}`;
    if (usedSentences.has(enSentence)) {
      idx++;
      continue;
    }
    usedSentences.add(enSentence);

    const idTranslation = `${s.id} ${p.id} ${c.id}`;
    const id = `sh_${String(idx).padStart(4, '0')}`;

    list.push({
      id,
      mode: 'shadowing',
      category: pick(categories),
      level: levels[(idx - 1) % levels.length],
      en: enSentence,
      target: enSentence,
      phonetic: `/${enSentence.toLowerCase().slice(0, 35)}.../`,
      id_translation: idTranslation,
      id_prompt: `Dengarkan audio, ucapkan artinya dalam Bahasa Indonesia: "${idTranslation}"`,
      en_prompt: `Translate to Indonesian: "${enSentence}"`,
      notes: 'Latih artikulasi pengucapan, rhythm, dan penekanan intonasi kalimat.'
    });
    idx++;
  }

  return list;
}

/* ============================================================================
   2. LISTENING & DICTATION (Target: 1,000)
   ============================================================================ */
function generateListening(count) {
  const list = [];
  const levels = ['Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];
  const times = ['7:15 AM', '8:30 AM', '9:45 AM', '10:20 AM', '11:50 AM', '1:15 PM', '2:40 PM', '3:30 PM', '4:15 PM', '5:45 PM', '6:30 PM', '8:15 PM', '9:00 PM'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const gates = [3, 7, 12, 14, 18, 22, 24, 28, 32, 36, 42, 49];
  const cities = ['London', 'New York', 'Tokyo', 'Singapore', 'Sydney', 'Paris', 'Berlin', 'Dubai', 'Toronto', 'Zurich'];

  const templates = [
    (i) => {
      const g = pick(gates);
      const t = pick(times);
      const c = pick(cities);
      return {
        en: `Flight ${100 + (i % 890)} to ${c} will depart from Gate ${g} at ${t}.`,
        id: `Penerbangan ${100 + (i % 890)} menuju ${c} akan berangkat dari Gerbang ${g} pukul ${t}.`,
        cat: 'Dictation • Flight Broadcasts'
      };
    },
    (i) => {
      const tr = 1 + (i % 16);
      const t = pick(times);
      const c = pick(cities);
      return {
        en: `The express service to ${c} departs from platform ${tr} at ${t}.`,
        id: `Layanan ekspres ke ${c} berangkat dari peron ${tr} pada pukul ${t}.`,
        cat: 'Dictation • Train Announcements'
      };
    },
    (i) => {
      const d = pick(days);
      const m = pick(months);
      const dateNum = 1 + (i % 28);
      const t = pick(times);
      return {
        en: `The international conference commences on ${d}, ${m} ${dateNum} at ${t}.`,
        id: `Konferensi internasional dimulai pada hari ${d}, ${dateNum} ${m} pukul ${t}.`,
        cat: 'Dictation • Schedule & Dates'
      };
    },
    (i) => {
      const amount = (50 + (i * 3) % 950).toFixed(2);
      return {
        en: `The total invoice for order #${2000 + i} is exactly $${amount} USD.`,
        id: `Total tagihan untuk pesanan #${2000 + i} adalah tepat $${amount} USD.`,
        cat: 'Dictation • Numblr Currency'
      };
    },
    (i) => {
      const pct = (1.5 + ((i * 7) % 850) / 10).toFixed(1);
      const metric = pick(['quarterly inflation', 'annual revenue growth', 'renewable power output', 'customer retention']);
      return {
        en: `Official reports state that ${metric} reached ${pct}% in the latest fiscal report #${i}.`,
        id: `Laporan resmi menyatakan bahwa ${metric} mencapai ${pct}% pada laporan keuangan terbaru #${i}.`,
        cat: 'Dictation • Economic Statistics'
      };
    },
    (i) => {
      const ext = 100 + (i % 890);
      return {
        en: `Please contact technical support by dialing extension ${ext} on your handset.`,
        id: `Silakan hubungi bantuan teknis dengan menekan ekstensi ${ext} pada telepon Anda.`,
        cat: 'Dictation • Phone Numbers'
      };
    }
  ];

  let idx = 1;
  while (list.length < count) {
    const fn = pick(templates);
    const item = fn(idx);

    if (usedSentences.has(item.en)) {
      idx++;
      continue;
    }
    usedSentences.add(item.en);

    const id = `ls_${String(idx).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'listening',
      category: item.cat,
      level: levels[(idx - 1) % levels.length],
      en: item.en,
      target: item.en,
      phonetic: `/${item.en.toLowerCase().slice(0, 35)}.../`,
      id_translation: item.id,
      id_prompt: `Dengarkan audio Bahasa Inggris, lalu ucapkan artinya dalam Bahasa Indonesia: "${item.id}"`,
      en_prompt: `Translate to Indonesian: "${item.en}"`,
      notes: 'Latihan mendengarkan angka, jam, persentase, dan mata uang secara presisi.'
    });
    idx++;
  }

  return list;
}

/* ============================================================================
   3. VOCABULARY & COLLOCATIONS (Target: 1,000)
   ============================================================================ */
function generateVocabulary(count) {
  const list = [];
  const levels = ['Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

  const vocabBase = [
    { word: 'profound', distractors: ['shallow', 'trivial', 'negligible'], meaning: 'mendalam', prep: 'a profound influence on' },
    { word: 'meticulous', distractors: ['careless', 'reckless', 'hasty'], meaning: 'sangat teliti', prep: 'meticulous attention to' },
    { word: 'pragmatic', distractors: ['dogmatic', 'idealistic', 'fictional'], meaning: 'praktis', prep: 'a pragmatic solution for' },
    { word: 'ubiquitous', distractors: ['scarce', 'isolated', 'sporadic'], meaning: 'ada di mana-mana', prep: 'ubiquitous throughout' },
    { word: 'resilience', distractors: ['fragility', 'reluctance', 'hesitation'], meaning: 'ketangguhan', prep: 'demonstrated resilience against' },
    { word: 'lucrative', distractors: ['unprofitable', 'detrimental', 'bankrupt'], meaning: 'sangat menguntungkan', prep: 'a lucrative agreement with' },
    { word: 'volatile', distractors: ['stable', 'predictable', 'constant'], meaning: 'mudah bergejolak', prep: 'highly volatile markets in' },
    { word: 'ephemeral', distractors: ['permanent', 'enduring', 'perpetual'], meaning: 'bersifat sesaat', prep: 'ephemeral trends across' },
    { word: 'mitigate', distractors: ['escalate', 'provoke', 'intensify'], meaning: 'memitigasi', prep: 'measures to mitigate' },
    { word: 'compelling', distractors: ['unconvincing', 'flimsy', 'dull'], meaning: 'sangat meyakinkan', prep: 'a compelling argument regarding' },
    { word: 'eloquent', distractors: ['inarticulate', 'hesitant', 'clumsy'], meaning: 'fasih memikat', prep: 'an eloquent presentation on' },
    { word: 'insatiable', distractors: ['satisfied', 'indifferent', 'apathetic'], meaning: 'tak terpuaskan', prep: 'an insatiable appetite for' },
    { word: 'streamline', distractors: ['complicate', 'impede', 'prolong'], meaning: 'merampingkan', prep: 'initiatives to streamline' },
    { word: 'consensus', distractors: ['discord', 'stalemate', 'controversy'], meaning: 'kesepakatan mufakat', prep: 'reached a broad consensus on' },
    { word: 'scrutinize', distractors: ['ignore', 'glance', 'overlook'], meaning: 'memeriksa cermat', prep: 'auditors will scrutinize' },
    { word: 'versatile', distractors: ['rigid', 'inflexible', 'limited'], meaning: 'serbaguna', prep: 'a versatile framework for' },
    { word: 'tenacious', distractors: ['yielding', 'timid', 'feeble'], meaning: 'gigih', prep: 'a tenacious approach toward' },
    { word: 'adversity', distractors: ['prosperity', 'luxury', 'fortune'], meaning: 'kesulitan hidup', prep: 'triumphing over adversity in' },
    { word: 'exemplary', distractors: ['inferior', 'reprehensible', 'mediocre'], meaning: 'patut diteladani', prep: 'exemplary standards of' },
    { word: 'feasible', distractors: ['impossible', 'impractical', 'absurd'], meaning: 'layak dijalankan', prep: 'deemed technically feasible by' },
    { word: 'call it a day', distractors: ['hit the road', 'break a leg', 'spill the beans'], meaning: 'sudahi pekerjaan hari ini', prep: 'decided to call it a day after' },
    { word: 'bite the bullet', distractors: ['jump the gun', 'burn bridges', 'hit the sack'], meaning: 'memberanikan diri', prep: 'forced to bite the bullet and' },
    { word: 'cut corners', distractors: ['push envelopes', 'throw towels', 'break ice'], meaning: 'mengambil jalan pintas ceroboh', prep: 'unwilling to cut corners during' },
    { word: 'see eye to eye', distractors: ['play by ear', 'let cats out', 'beat bushes'], meaning: 'sependapat', prep: 'rarely see eye to eye regarding' },
    { word: 'shed light on', distractors: ['turn blind eye', 'give green light', 'put back burner'], meaning: 'menerangkan / memperjelas', prep: 'findings that shed light on' }
  ];

  const domains = [
    'software engineering practices',
    'global climate policy negotiations',
    'emerging biotechnology research',
    'international trade agreements',
    'financial risk management',
    'urban infrastructure planning',
    'artificial intelligence ethics',
    'organizational psychology studies',
    'modern educational reform',
    'renewable power grid management',
    'cybersecurity vulnerability assessments',
    'advanced aerospace engineering',
    'cross-border supply chain logistics',
    'pharmaceutical clinical trials',
    'corporate governance restructuring'
  ];

  let idx = 1;
  while (list.length < count) {
    const v = pick(vocabBase);
    const d = pick(domains);
    const enSentence = `The committee highlighted ${v.prep} ${d} in review #${idx}.`;

    if (usedSentences.has(enSentence)) {
      idx++;
      continue;
    }
    usedSentences.add(enSentence);

    const blankSentence = enSentence.replace(v.word, '________');

    // Shuffle options & randomize correctIndex across 0, 1, 2, 3 (A, B, C, D)
    const rawOptions = [v.word, ...v.distractors];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(v.word);

    const id = `vc_${String(idx).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'vocabulary',
      category: 'Vocabulary • Verbal Advantage & Collocations',
      level: levels[(idx - 1) % levels.length],
      en: enSentence,
      target: enSentence,
      missingWord: v.word,
      prompt_en: `Choose the correct word: "${blankSentence}"`,
      prompt_id: `Pilih kata yang bermakna "${v.meaning}": "${blankSentence}"`,
      options: shuffledOptions,
      correctIndex: correctIndex,
      phonetic: `/${v.word}/`,
      id_translation: `Kalimat dengan kata "${v.word}" (${v.meaning}).`,
      id_prompt: `Lengkapi kalimat: "${blankSentence}"`,
      en_prompt: `Translate to Indonesian: "${enSentence}"`,
      notes: `Kata "${v.word}" berarti ${v.meaning}. Posisi jawaban acak (A/B/C/D).`
    });
    idx++;
  }

  return list;
}

/* ============================================================================
   4. RAYMOND MURPHY GRAMMAR QUEST (Target: 1,000)
   ============================================================================ */
function generateGrammar(count) {
  const list = [];
  const levels = ['Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

  const templates = [
    // Conditionals Unit 38
    (i) => {
      const verbs = [
        { base: 'know', correct: 'had known', wrong: ['knew', 'have known', 'know'] },
        { base: 'see', correct: 'had seen', wrong: ['saw', 'have seen', 'see'] },
        { base: 'hear', correct: 'had heard', wrong: ['heard', 'have heard', 'hear'] },
        { base: 'verify', correct: 'had verified', wrong: ['verified', 'have verified', 'verify'] }
      ];
      const v = pick(verbs);
      const en = `If the supervisor had ${v.correct.replace('had ', '')} about issue #${i}, she would have intervened immediately.`;
      const blank = `If the supervisor ________ (${v.base}) about issue #${i}, she would have intervened immediately.`;
      return { en, blank, correct: v.correct, wrong: v.wrong, unit: 'Third Conditional (Unit 38)' };
    },
    // Present Perfect vs Past Unit 7
    (i) => {
      const cities = ['London', 'Tokyo', 'Singapore', 'Berlin', 'Toronto', 'Sydney', 'New York'];
      const c = pick(cities);
      const yrs = 2 + (i % 10);
      const en = `The lead architect has lived in ${c} for ${yrs} years, and she still designs projects there (Record #${i}).`;
      const blank = `The lead architect ________ (live) in ${c} for ${yrs} years, and she still designs projects there (Record #${i}).`;
      return { en, blank, correct: 'has lived', wrong: ['lived', 'is living', 'lives'], unit: 'Present Perfect (Unit 7)' };
    },
    // Modal Perfect Unit 33
    (i) => {
      const actions = [
        { correct: 'should have backed up', wrong: ['should back up', 'must back up', 'could back up'], obj: 'the database files' },
        { correct: 'should have notified', wrong: ['should notify', 'must notify', 'might notify'], obj: 'the engineering division' },
        { correct: 'should have tested', wrong: ['should test', 'must test', 'will test'], obj: 'the electrical circuits' },
        { correct: 'should have updated', wrong: ['should update', 'must update', 'can update'], obj: 'the software dependencies' }
      ];
      const a = pick(actions);
      const en = `You ${a.correct} ${a.obj} before initiating procedure #${i}.`;
      const blank = `You ________ ${a.obj} before initiating procedure #${i}.`;
      return { en, blank, correct: a.correct, wrong: a.wrong, unit: 'Modal Verbs (Unit 33)' };
    },
    // Passive Voice Unit 42
    (i) => {
      const structures = ['suspension bridge', 'solar facility', 'deep-water port', 'biotech laboratory', 'telecom tower'];
      const st = pick(structures);
      const yr = 1970 + (i % 50);
      const en = `The state-of-the-art ${st} was constructed in ${yr} by international engineers (#${i}).`;
      const blank = `The state-of-the-art ${st} ________ (construct) in ${yr} by international engineers (#${i}).`;
      return { en, blank, correct: 'was constructed', wrong: ['is constructed', 'constructed', 'has constructed'], unit: 'Passive Voice (Unit 42)' };
    },
    // First Conditional Unit 37
    (i) => {
      const en = `If the regulatory agency approves proposal #${i} tomorrow, the company will begin production without delay.`;
      const blank = `If the regulatory agency approves proposal #${i} tomorrow, the company ________ (begin) production without delay.`;
      return { en, blank, correct: 'will begin', wrong: ['would begin', 'began', 'beginning'], unit: 'First Conditional (Unit 37)' };
    },
    // Inversion
    (i) => {
      const en = `Hardly had ceremony #${i} commenced when the power grid suffered an interruption.`;
      const blank = `Hardly ________ (ceremony #${i} / commence) when the power grid suffered an interruption.`;
      return { en, blank, correct: `had ceremony #${i} commenced`, wrong: [`ceremony #${i} had commenced`, `commenced ceremony #${i}`, `did ceremony #${i} commence`], unit: 'Inversion Structures' };
    }
  ];

  let idx = 1;
  while (list.length < count) {
    const fn = pick(templates);
    const item = fn(idx);

    if (usedSentences.has(item.en)) {
      idx++;
      continue;
    }
    usedSentences.add(item.en);

    // Shuffle options & randomize correctIndex across 0, 1, 2, 3 (A, B, C, D)
    const rawOptions = [item.correct, ...item.wrong];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(item.correct);

    const id = `gm_${String(idx).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'grammar',
      category: `Raymond Murphy • ${item.unit}`,
      level: levels[(idx - 1) % levels.length],
      en: item.en,
      target: item.en,
      missingWord: item.correct,
      prompt_en: `Murphy Grammar: "${item.blank}"`,
      prompt_id: `Tata Bahasa Murphy: "${item.blank}"`,
      options: shuffledOptions,
      correctIndex: correctIndex,
      phonetic: `/${item.correct}/`,
      id_translation: `Latihan tata bahasa Inggris: "${item.en}"`,
      id_prompt: `Lengkapi kalimat: "${item.blank}"`,
      en_prompt: `Translate to Indonesian: "${item.en}"`,
      notes: `Fokus tata bahasa: ${item.unit}. Pilihan jawaban diacak (A/B/C/D).`
    });
    idx++;
  }

  return list;
}

/* ============================================================================
   5. IELTS ACADEMIC SIMULATION (Target: 500)
   ============================================================================ */
function generateIELTS(count) {
  const list = [];
  const levels = ['IELTS Band 6.5 - 7.0', 'IELTS Band 7.5 - 8.0', 'IELTS Band 8.5 - 9.0'];

  const topics = [
    {
      cue: 'Describe a memorable journey you took by public transport.',
      question: 'How has high-speed rail transportation transformed modern commuter lifestyles?',
      target: 'High-speed rail has substantially curtailed travel times, stimulating economic decentralization across regional hubs.',
      id: 'Kereta cepat telah secara substansial memangkas waktu tempuh, mendorong desentralisasi ekonomi di pusat-pusat regional.',
      vocab: 'substantially curtailed',
      distractors: ['slightly increased', 'barely affected', 'randomly stopped']
    },
    {
      cue: 'Describe an environmental law or initiative in your country.',
      question: 'Do you believe stricter environmental penalties deter industrial polluters effectively?',
      target: 'Rigorous enforcement coupled with fiscal disincentives provides a formidable deterrent against corporate noncompliance.',
      id: 'Penegakan hukum yang ketat ditambah disinsentif fiskal memberikan efek jera yang tangguh terhadap pelanggaran perusahaan.',
      vocab: 'formidable deterrent',
      distractors: ['minor inconvenience', 'temporary suggestion', 'negligible factor']
    },
    {
      cue: 'Describe a significant technological breakthrough.',
      question: 'What ethical dilemmas arise from autonomous decision-making algorithms?',
      target: 'Algorithmic opacity frequently obscures accountability when automated systems inflict unintended societal harm.',
      id: 'Ketidakjelasan algoritma sering mengaburkan akuntabilitas ketika sistem otomatis menimbulkan kerugian sosial yang tidak diinginkan.',
      vocab: 'obscures accountability',
      distractors: ['clarifies responsibility', 'simplifies justice', 'enhances transparency']
    },
    {
      cue: 'Describe a piece of art or music that deeply influenced you.',
      question: 'Should national governments allocate substantial subsidies to fine arts programs?',
      target: 'Public funding preserves intangible cultural heritage that commercial market forces would otherwise neglect.',
      id: 'Pendanaan publik melestarikan warisan budaya takbenda yang jika tidak didanai akan diabaikan oleh kekuatan pasar komersial.',
      vocab: 'intangible cultural heritage',
      distractors: ['obsolete physical tools', 'disposable modern gadgets', 'temporary fashion items']
    },
    {
      cue: 'Describe a challenging project you accomplished at school or work.',
      question: 'Why is cross-cultural competence indispensable in contemporary global commerce?',
      target: 'Cross-cultural acumen mitigates interpersonal friction and facilitates harmonious multilateral negotiations.',
      id: 'Kecakapan lintas budaya memitigasi gesekan antarpribadi dan memfasilitasi negosiasi multilateral yang harmonis.',
      vocab: 'mitigates interpersonal friction',
      distractors: ['provokes unnecessary conflict', 'creates commercial barriers', 'delays executive decisions']
    }
  ];

  let idx = 1;
  while (list.length < count) {
    const t = pick(topics);
    const variantId = idx;
    const enSentence = `${t.target} (IELTS Task #${variantId})`;

    if (usedSentences.has(enSentence)) {
      idx++;
      continue;
    }
    usedSentences.add(enSentence);

    const blankSentence = enSentence.replace(t.vocab, '________');
    const rawOptions = [t.vocab, ...t.distractors];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(t.vocab);

    const id = `ielts_${String(idx).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'ielts',
      category: 'IELTS Academic Simulation • Band 7.5 - 9.0',
      level: levels[(idx - 1) % levels.length],
      cue_card: t.cue,
      en: enSentence,
      target: enSentence,
      missingWord: t.vocab,
      prompt_en: `IELTS Speaking/Reading (${t.question}): "${blankSentence}"`,
      prompt_id: `Simulasi IELTS (${t.question}): "${blankSentence}"`,
      options: shuffledOptions,
      correctIndex: correctIndex,
      phonetic: `/${t.vocab}/`,
      id_translation: t.id,
      id_prompt: `IELTS Speaking: Dengarkan & jawab dalam Bahasa Indonesia: "${t.id}"`,
      en_prompt: `IELTS Practice: Translate "${enSentence}" to Indonesian.`,
      notes: `IELTS Band 8.0+ Lexical Resource. Pertanyaan topik: "${t.question}".`
    });
    idx++;
  }

  return list;
}

/* ============================================================================
   6. TOEFL iBT SIMULATION (Target: 500)
   ============================================================================ */
function generateTOEFL(count) {
  const list = [];
  const levels = ['TOEFL iBT 80 - 90', 'TOEFL iBT 91 - 105', 'TOEFL iBT 106 - 120'];

  const lectures = [
    {
      subject: 'Biology • Symbiotic Relationships',
      prompt: 'According to the professor, why is mutualism essential for coral reef ecosystems?',
      sentence: 'The symbiotic algae provide essential photosynthetic nutrients, thereby facilitating calcification in marine corals.',
      id: 'Alga simbiotik menyediakan nutrisi fotosintesis penting, sehingga memfasilitasi kalsifikasi pada karang laut.',
      keyword: 'facilitating calcification',
      distractors: ['preventing mineral growth', 'dissolving reef structures', 'blocking sunlight penetration']
    },
    {
      subject: 'Art History • Impressionism',
      prompt: 'What distinguished Impressionist painters from their academic predecessors?',
      sentence: 'Impressionists prioritized transitory optical sensations and natural illumination over rigid studio compositions.',
      id: 'Kaum Impresionis memprioritaskan sensasi optik yang sekilas dan pencahayaan alami di atas komposisi studio yang kaku.',
      keyword: 'transitory optical sensations',
      distractors: ['permanent mythological themes', 'strict mathematical proportions', 'heavy historical allegories']
    },
    {
      subject: 'Economics • Market Failures',
      prompt: 'Why do negative externalities warrant government intervention?',
      sentence: 'Uncompensated environmental degradation imposes severe societal costs that unfettered free markets fail to internalize.',
      id: 'Kerusakan lingkungan tanpa kompensasi menimbulkan biaya sosial parah yang gagal diinternalisasi oleh pasar bebas tanpa kendali.',
      keyword: 'unfettered free markets',
      distractors: ['strictly regulated monopolies', 'subsidized nonprofit agencies', 'communal farming cooperatives']
    },
    {
      subject: 'Geology • Plate Tectonics',
      prompt: 'How do subduction zones generate volcanic island arcs?',
      sentence: 'Intense frictional heat and partial mantle melting generate buoyant magma that ascends toward the oceanic crust.',
      id: 'Panas gesekan yang intens dan pelelehan sebagian mantel menghasilkan magma mengapung yang naik menuju kerak samudera.',
      keyword: 'buoyant magma that ascends',
      distractors: ['dense rock that sinks', 'frozen sediment that solidifies', 'dry gas that condenses']
    },
    {
      subject: 'Astronomy • Stellar Evolution',
      prompt: 'What triggers the gravitational collapse of massive stars into supernovas?',
      sentence: 'Once iron core synthesis exhausts thermonuclear fuel, gravitational forces abruptly overwhelm outward radiation pressure.',
      id: 'Begitu sintesis inti besi menghabiskan bahan bakar termonuklir, gaya gravitasi tiba-tiba mengalahkan tekanan radiasi ke luar.',
      keyword: 'abruptly overwhelm outward',
      distractors: ['gradually support thermal', 'completely eliminate internal', 'steadily stabilize magnetic']
    }
  ];

  let idx = 1;
  while (list.length < count) {
    const l = pick(lectures);
    const variantId = idx;
    const enSentence = `${l.sentence} (TOEFL Passage #${variantId})`;

    if (usedSentences.has(enSentence)) {
      idx++;
      continue;
    }
    usedSentences.add(enSentence);

    const blankSentence = enSentence.replace(l.keyword, '________');
    const rawOptions = [l.keyword, ...l.distractors];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(l.keyword);

    const id = `toefl_${String(idx).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'toefl',
      category: `TOEFL iBT Academic Simulation • ${l.subject}`,
      level: levels[(idx - 1) % levels.length],
      en: enSentence,
      target: enSentence,
      missingWord: l.keyword,
      prompt_en: `TOEFL Question (${l.prompt}): "${blankSentence}"`,
      prompt_id: `Simulasi TOEFL (${l.prompt}): "${blankSentence}"`,
      options: shuffledOptions,
      correctIndex: correctIndex,
      phonetic: `/${l.keyword}/`,
      id_translation: l.id,
      id_prompt: `TOEFL Listening/Speaking: Dengarkan & jawab dalam Bahasa Indonesia: "${l.id}"`,
      en_prompt: `TOEFL Practice: Translate "${enSentence}" to Indonesian.`,
      notes: `TOEFL Score Scale 26-30. Topik kuliah: ${l.subject}.`
    });
    idx++;
  }

  return list;
}

/* ============================================================================
   MAIN EXECUTION: EXACTLY 5,000 QUESTIONS
   ============================================================================ */
console.log('Generating 5,000 questions across 6 Arenas (including IELTS & TOEFL)...');
const shadowingQuestions = generateShadowing(1000);
console.log(`- Shadowing: ${shadowingQuestions.length}`);

const listeningQuestions = generateListening(1000);
console.log(`- Listening: ${listeningQuestions.length}`);

const vocabQuestions = generateVocabulary(1000);
console.log(`- Vocabulary: ${vocabQuestions.length}`);

const grammarQuestions = generateGrammar(1000);
console.log(`- Grammar: ${grammarQuestions.length}`);

const ieltsQuestions = generateIELTS(500);
console.log(`- IELTS Academic Simulation: ${ieltsQuestions.length}`);

const toeflQuestions = generateTOEFL(500);
console.log(`- TOEFL iBT Simulation: ${toeflQuestions.length}`);

const allQuestions = [
  ...shadowingQuestions,
  ...listeningQuestions,
  ...vocabQuestions,
  ...grammarQuestions,
  ...ieltsQuestions,
  ...toeflQuestions
];

console.log(`\nTotal questions generated: ${allQuestions.length}`);

// Verify option distribution for Multiple Choice
let counts = { A: 0, B: 0, C: 0, D: 0 };
[...vocabQuestions, ...grammarQuestions, ...ieltsQuestions, ...toeflQuestions].forEach(q => {
  const letters = ['A', 'B', 'C', 'D'];
  counts[letters[q.correctIndex]]++;
});

console.log('Random Option Distribution for Multiple Choice:');
console.log(counts);

const dataset = {
  version: '4.0.0',
  updated_at: new Date().toISOString().split('T')[0],
  author: 'Build with Jefri (https://jefri-orcin.vercel.app/)',
  source: 'Awesome English Curated Community Resources + IELTS & TOEFL Simulations',
  total_questions: allQuestions.length,
  summary: {
    shadowing: shadowingQuestions.length,
    listening: listeningQuestions.length,
    vocabulary: vocabQuestions.length,
    grammar: grammarQuestions.length,
    ielts: ieltsQuestions.length,
    toefl: toeflQuestions.length
  },
  questions: allQuestions
};

// Write files
const gameDataPath = path.join(__dirname, 'data', 'questions.json');
const repoDataPath = path.join(__dirname, '..', 'leaderboard-repo', 'data', 'questions.json');

fs.writeFileSync(gameDataPath, JSON.stringify(dataset, null, 2), 'utf8');
fs.writeFileSync(repoDataPath, JSON.stringify(dataset, null, 2), 'utf8');

console.log(`\nSaved dataset to:`);
console.log(`1. ${gameDataPath} (${(fs.statSync(gameDataPath).size / 1024 / 1024).toFixed(2)} MB)`);
console.log(`2. ${repoDataPath} (${(fs.statSync(repoDataPath).size / 1024 / 1024).toFixed(2)} MB)`);
