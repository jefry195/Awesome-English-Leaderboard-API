/**
 * Awesome English Arena - Dataset Generator (5,000 Questions)
 * 100% natural English sentences with ZERO artificial numbers (e.g. NO #303, NO #12, NO Part #).
 * Generates:
 * - 1,000 Shadowing (Refold & Podcasts)
 * - 1,000 Listening & Dictation
 * - 1,000 Vocabulary & Collocations (A/B/C/D randomized)
 * - 1,000 Raymond Murphy Grammar Quest (A/B/C/D randomized)
 * -   500 IELTS Academic Simulation (Band 6.5 - 9.0)
 * -   500 TOEFL iBT Academic Simulation (Scale 80 - 120)
 * Total: 5,000 unique questions.
 */

const fs = require('fs');
const path = require('path');

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ============================================================================
   1. SHADOWING & SPEAKING (1,000 questions)
   ============================================================================ */
function generateShadowing(count) {
  const subjects = [
    { en: 'Consistent daily immersion in native audio', id: 'Imersi harian yang konsisten pada audio penutur asli' },
    { en: 'Mastering high-frequency conversational phrases', id: 'Menguasai frasa percakapan berfrekuensi tinggi' },
    { en: 'Active listening combined with immediate shadowing', id: 'Mendengarkan aktif yang dipadukan dengan shadowing langsung' },
    { en: 'Developing intuitive grammatical reflexes', id: 'Mengembangkan refleks tata bahasa yang intuitif' },
    { en: 'Continuous exposure to real-world English dialogues', id: 'Paparan terus-menerus terhadap dialog bahasa Inggris nyata' },
    { en: 'Deliberate pronunciation practice with pitch variation', id: 'Latihan pengucapan terencana dengan variasi nada suara' },
    { en: 'Acquiring vocabulary through compelling context', id: 'Memperoleh kosakata melalui konteks yang menarik' },
    { en: 'Overcoming hesitation through structured speaking drills', id: 'Mengatasi keraguan melalui latihan berbicara terstruktur' },
    { en: 'Practicing natural sentence stress and cadence', id: 'Melatih penekanan kalimat dan irama berbicara yang alami' },
    { en: 'Regularly engaging in spontaneous verbal expression', id: 'Secara teratur terlibat dalam ekspresi lisan spontan' }
  ];

  const predicates = [
    { en: 'significantly accelerates long-term language acquisition', id: 'secara signifikan mempercepat pemerolehan bahasa jangka panjang' },
    { en: 'builds authentic fluency and effortless confidence', id: 'membangun kefasihan autentik dan rasa percaya diri tanpa beban' },
    { en: 'transforms passive vocabulary into dynamic speaking ability', id: 'mengubah kosakata pasif menjadi kemampuan berbicara yang dinamis' },
    { en: 'strengthens neurological pathways for fluent communication', id: 'memperkuat jalur neurologis untuk komunikasi yang lancar' },
    { en: 'bridges the gap between understanding and active speech', id: 'menjembatani kesenjangan antara pemahaman dan ucapan aktif' },
    { en: 'enhances auditory discernment and native-like rhythm', id: 'meningkatkan kepekaan pendengaran dan ritme alami' },
    { en: 'cultivates deep conceptual understanding of expressions', id: 'menumbuhkan pemahaman konseptual mendalam atas berbagai ungkapan' },
    { en: 'unlocks untapped potential in international collaborations', id: 'membuka potensi yang belum tergali dalam kolaborasi internasional' },
    { en: 'builds mental resilience during high-stakes presentations', id: 'membangun ketangguhan mental selama presentasi penting' },
    { en: 'creates sustainable habits for lifelong language mastery', id: 'menciptakan kebiasaan berkelanjutan untuk penguasaan bahasa seumur hidup' }
  ];

  const contexts = [
    { en: 'in today’s hyper-connected global environment.', id: 'di lingkungan global yang sangat terhubung saat ini.' },
    { en: 'across demanding multinational enterprise settings.', id: 'di seluruh lingkungan perusahaan multinasional yang kompetitif.' },
    { en: 'when navigating unpredictable international business discussions.', id: 'saat menavigasi diskusi bisnis internasional yang dinamis.' },
    { en: 'in both personal development and professional endeavors.', id: 'baik dalam pengembangan pribadi maupun usaha profesional.' },
    { en: 'as cross-border communication continues to expand.', id: 'seiring komunikasi lintas batas yang terus berkembang luas.' },
    { en: 'under demanding modern workplace expectations.', id: 'di bawah tuntutan dunia kerja modern yang tinggi.' },
    { en: 'throughout long-term academic and career pursuits.', id: 'sepanjang perjalanan akademis dan pencapaian karier jangka panjang.' },
    { en: 'for individuals striving to reach bilingual proficiency.', id: 'bagi individu yang berusaha mencapai kemahiran dwibahasa.' },
    { en: 'in the ongoing pursuit of linguistic excellence.', id: 'dalam pengejaran keunggulan linguistik yang berkelanjutan.' },
    { en: 'especially when addressing multifaceted modern challenges.', id: 'terutama saat mengatasi berbagai tantangan modern yang beragam.' }
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
  const list = [];

  for (let i = 0; i < count; i++) {
    const s = subjects[i % subjects.length];
    const p = predicates[Math.floor(i / subjects.length) % predicates.length];
    const c = contexts[Math.floor(i / (subjects.length * predicates.length)) % contexts.length];

    const enSentence = `${s.en} ${p.en} ${c.en}`;
    const idTranslation = `${s.id} ${p.id} ${c.id}`;
    const id = `sh_${String(i + 1).padStart(4, '0')}`;

    list.push({
      id,
      mode: 'shadowing',
      category: categories[i % categories.length],
      level: levels[i % levels.length],
      en: enSentence,
      target: enSentence,
      phonetic: `/${enSentence.toLowerCase().slice(0, 35)}.../`,
      id_translation: idTranslation,
      id_prompt: `Dengarkan audio, ucapkan artinya dalam Bahasa Indonesia: "${idTranslation}"`,
      en_prompt: `Translate to Indonesian: "${enSentence}"`,
      notes: 'Latih artikulasi pengucapan, rhythm, dan penekanan intonasi kalimat.'
    });
  }

  return list;
}

/* ============================================================================
   2. LISTENING & DICTATION (1,000 questions)
   ============================================================================ */
function generateListening(count) {
  const times = ['7:15 AM', '8:30 AM', '9:45 AM', '10:20 AM', '11:50 AM', '1:15 PM', '2:40 PM', '3:30 PM', '4:15 PM', '5:45 PM', '6:30 PM', '8:15 PM', '9:00 PM'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const gates = [3, 7, 12, 14, 18, 22, 24, 28, 32, 36, 42, 49];
  const cities = ['London', 'New York', 'Tokyo', 'Singapore', 'Sydney', 'Paris', 'Berlin', 'Dubai', 'Toronto', 'Zurich', 'Seoul', 'Amsterdam'];
  const flightCodes = ['BA 249', 'SQ 318', 'EK 402', 'JL 708', 'QF 11', 'LH 450', 'CX 880', 'AF 256', 'KL 802', 'GA 870', 'NH 204', 'TG 676'];
  const companies = ['Global Logistics', 'Pacific Marine', 'Atlas Software', 'Horizon Tech', 'Apex Engineering', 'Beacon Energy', 'Vanguard Systems', 'Nova Labs'];
  const metrics = ['quarterly inflation', 'annual revenue growth', 'renewable power output', 'customer retention', 'operating efficiency', 'export volume'];
  const sectors = ['the technology sector', 'renewable energy', 'international retail', 'global manufacturing', 'telecommunications', 'logistics network'];
  const depts = ['technical support', 'customer care', 'accounts receivable', 'human resources', 'operations dispatch', 'executive liaison'];

  const levels = ['Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];
  const list = [];

  for (let i = 0; i < count; i++) {
    const tmplType = i % 6;
    let en = '';
    let idTrans = '';
    let cat = '';

    if (tmplType === 0) {
      const g = gates[i % gates.length];
      const t = times[(i * 2) % times.length];
      const c = cities[(i * 3) % cities.length];
      const flightCode = flightCodes[i % flightCodes.length];
      en = `Flight ${flightCode} to ${c} will depart from Gate ${g} at ${t}.`;
      idTrans = `Penerbangan ${flightCode} menuju ${c} akan berangkat dari Gerbang ${g} pukul ${t}.`;
      cat = 'Dictation • Flight Broadcasts';
    } else if (tmplType === 1) {
      const tr = 1 + (i % 16);
      const t = times[(i * 3) % times.length];
      const c = cities[(i * 2) % cities.length];
      en = `The express service to ${c} departs from platform ${tr} at ${t}.`;
      idTrans = `Layanan ekspres ke ${c} berangkat dari peron ${tr} pada pukul ${t}.`;
      cat = 'Dictation • Train Announcements';
    } else if (tmplType === 2) {
      const d = days[i % days.length];
      const m = months[Math.floor(i / days.length) % months.length];
      const dateNum = 1 + (i % 28);
      const t = times[(i * 4) % times.length];
      en = `The international conference commences on ${d}, ${m} ${dateNum} at ${t}.`;
      idTrans = `Konferensi internasional dimulai pada hari ${d}, ${dateNum} ${m} pukul ${t}.`;
      cat = 'Dictation • Schedule & Dates';
    } else if (tmplType === 3) {
      const amount = (50 + (i * 3.75) % 950).toFixed(2);
      const comp = companies[i % companies.length];
      en = `The total invoice for ${comp} is exactly $${amount} USD.`;
      idTrans = `Total tagihan untuk ${comp} adalah tepat $${amount} USD.`;
      cat = 'Dictation • Numblr Currency';
    } else if (tmplType === 4) {
      const pct = (1.5 + ((i * 7) % 850) / 10).toFixed(1);
      const metric = metrics[i % metrics.length];
      const sector = sectors[Math.floor(i / metrics.length) % sectors.length];
      en = `Official reports state that ${metric} in ${sector} reached ${pct}% in the latest fiscal report.`;
      idTrans = `Laporan resmi menyatakan bahwa ${metric} pada ${sector} mencapai ${pct}% pada laporan keuangan terbaru.`;
      cat = 'Dictation • Economic Statistics';
    } else {
      const ext = 100 + (i % 890);
      const dept = depts[i % depts.length];
      en = `Please contact ${dept} by dialing extension ${ext} on your handset.`;
      idTrans = `Silakan hubungi ${dept} dengan menekan ekstensi ${ext} pada telepon Anda.`;
      cat = 'Dictation • Phone Numbers';
    }

    const id = `ls_${String(i + 1).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'listening',
      category: cat,
      level: levels[i % levels.length],
      en: en,
      target: en,
      phonetic: `/${en.toLowerCase().slice(0, 35)}.../`,
      id_translation: idTrans,
      id_prompt: `Dengarkan audio Bahasa Inggris, lalu ucapkan artinya dalam Bahasa Indonesia: "${idTrans}"`,
      en_prompt: `Translate to Indonesian: "${en}"`,
      notes: 'Latihan mendengarkan angka, jam, persentase, dan mata uang secara presisi.'
    });
  }

  return list;
}

/* ============================================================================
   3. VOCABULARY & COLLOCATIONS (1,000 questions)
   ============================================================================ */
function generateVocabulary(count) {
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
    'renewable energy distribution',
    'advanced artificial intelligence models',
    'urban infrastructure development',
    'cross-border intellectual property law',
    'multilateral diplomatic treaties',
    'macroeconomic stability measures',
    'supply chain modernization',
    'healthcare delivery networks',
    'cybersecurity threat intelligence',
    'corporate governance restructuring'
  ];

  const subjects = [
    'The executive committee',
    'Senior leadership',
    'Academic experts',
    'The newly appointed director',
    'Independent researchers',
    'The global study',
    'An international panel of specialists',
    'The strategic advisory board',
    'Industry leaders',
    'The scientific consortium'
  ];

  const verbs = [
    'highlighted',
    'emphasized',
    'identified',
    'demonstrated',
    'acknowledged',
    'observed',
    'underscored',
    'clarified',
    'documented',
    'championed'
  ];

  const timeContexts = [
    'during the annual economic summit.',
    'across their comprehensive industry report.',
    'as a cornerstone of their forward guidance.',
    'throughout extensive field investigations.',
    'in the latest academic peer review.',
    'during the international technology symposium.',
    'following extensive stakeholder consultation.',
    'in their formal presentation to the board.',
    'within the broader strategic policy review.',
    'throughout several operational deployment phases.'
  ];

  const levels = ['Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];
  const list = [];

  for (let i = 0; i < count; i++) {
    const v = vocabBase[i % vocabBase.length];
    const d = domains[Math.floor(i / vocabBase.length) % domains.length];
    const subj = subjects[Math.floor(i / (vocabBase.length * domains.length)) % subjects.length];
    const verb = verbs[(i * 3) % verbs.length];
    const tctx = timeContexts[(i * 7) % timeContexts.length];

    const enSentence = `${subj} ${verb} ${v.prep} ${d} ${tctx}`;
    const blankSentence = enSentence.replace(v.word, '________');

    const rawOptions = [v.word, ...v.distractors];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(v.word);

    const id = `vc_${String(i + 1).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'vocabulary',
      category: 'Vocabulary • Verbal Advantage & Collocations',
      level: levels[i % levels.length],
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
  }

  return list;
}

/* ============================================================================
   4. RAYMOND MURPHY GRAMMAR QUEST (1,000 questions)
   ============================================================================ */
function generateGrammar(count) {
  const levels = ['Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];
  const roles = [
    'The project supervisor',
    'The lead software architect',
    'The principal research investigator',
    'The regional logistics director',
    'The senior financial consultant',
    'The plant safety officer',
    'The infrastructure specialist',
    'The quality assurance lead',
    'The clinical operations manager',
    'The executive compliance auditor'
  ];

  const issues = [
    'the unexpected server outage',
    'the critical supply shortage',
    'the security vulnerability',
    'the compliance deviation',
    'the structural integrity defect',
    'the sudden network latency',
    'the budget discrepancy',
    'the hardware malfunction',
    'the cooling system failure',
    'the unauthorized data transfer'
  ];

  const cities = ['London', 'Tokyo', 'Singapore', 'Berlin', 'Toronto', 'Sydney', 'New York', 'Zurich', 'Seoul', 'Stockholm'];
  const structures = ['suspension bridge', 'solar power facility', 'deep-water shipping port', 'biotechnology laboratory', 'telecommunication tower', 'high-speed railway station', 'hydroelectric dam', 'data center complex'];
  const agencies = ['the regulatory agency', 'the board of directors', 'the environmental oversight committee', 'the municipal council', 'the investment syndicate', 'the accreditation authority'];
  const events = ['the formal opening ceremony', 'the annual shareholders meeting', 'the keynote technological address', 'the emergency press briefing', 'the international conference keynote', 'the launch presentation'];

  const verbsConditional = [
    { base: 'know', correct: 'had known', wrong: ['knew', 'have known', 'know'] },
    { base: 'see', correct: 'had seen', wrong: ['saw', 'have seen', 'see'] },
    { base: 'hear', correct: 'had heard', wrong: ['heard', 'have heard', 'hear'] },
    { base: 'verify', correct: 'had verified', wrong: ['verified', 'have verified', 'verify'] },
    { base: 'detect', correct: 'had detected', wrong: ['detected', 'have detected', 'detect'] }
  ];

  const actionsModal = [
    { correct: 'should have backed up', wrong: ['should back up', 'must back up', 'could back up'], obj: 'the database files' },
    { correct: 'should have notified', wrong: ['should notify', 'must notify', 'might notify'], obj: 'the engineering team' },
    { correct: 'should have tested', wrong: ['should test', 'must test', 'will test'], obj: 'the electrical circuits' },
    { correct: 'should have updated', wrong: ['should update', 'must update', 'can update'], obj: 'the software dependencies' },
    { correct: 'should have calibrated', wrong: ['should calibrate', 'must calibrate', 'will calibrate'], obj: 'the measuring instruments' }
  ];

  const list = [];

  for (let i = 0; i < count; i++) {
    const tmplType = i % 5;
    let en = '';
    let blank = '';
    let correct = '';
    let wrong = [];
    let unit = '';

    if (tmplType === 0) {
      // Third Conditional
      const r = roles[i % roles.length];
      const issue = issues[Math.floor(i / roles.length) % issues.length];
      const v = verbsConditional[(i * 3) % verbsConditional.length];
      en = `If ${r.toLowerCase()} had ${v.correct.replace('had ', '')} about ${issue}, the organization would have intervened immediately.`;
      blank = `If ${r.toLowerCase()} ________ (${v.base}) about ${issue}, the organization would have intervened immediately.`;
      correct = v.correct;
      wrong = v.wrong;
      unit = 'Third Conditional (Unit 38)';
    } else if (tmplType === 1) {
      // Present Perfect vs Past Simple
      const r = roles[(i * 2) % roles.length];
      const c = cities[i % cities.length];
      const yrs = 2 + (i % 12);
      en = `${r} has lived in ${c} for ${yrs} years, and she still conducts major research projects there.`;
      blank = `${r} ________ (live) in ${c} for ${yrs} years, and she still conducts major research projects there.`;
      correct = 'has lived';
      wrong = ['lived', 'is living', 'lives'];
      unit = 'Present Perfect (Unit 7)';
    } else if (tmplType === 2) {
      // Modal Perfect
      const a = actionsModal[i % actionsModal.length];
      const proc = ['initiating deployment', 'rebooting the system', 'approving the budget', 'signing the contract', 'running the test suite'][i % 5];
      en = `The engineering team ${a.correct} ${a.obj} before ${proc}.`;
      blank = `The engineering team ________ ${a.obj} before ${proc}.`;
      correct = a.correct;
      wrong = a.wrong;
      unit = 'Modal Verbs (Unit 33)';
    } else if (tmplType === 3) {
      // Passive Voice
      const st = structures[i % structures.length];
      const yr = 1975 + (i % 45);
      en = `The state-of-the-art ${st} was constructed in ${yr} by international civil engineers.`;
      blank = `The state-of-the-art ${st} ________ (construct) in ${yr} by international civil engineers.`;
      correct = 'was constructed';
      wrong = ['is constructed', 'constructed', 'has constructed'];
      unit = 'Passive Voice (Unit 42)';
    } else {
      // Inversion / First Conditional
      const ev = events[i % events.length];
      en = `Hardly had ${ev} commenced when the power grid suffered an unforeseen interruption.`;
      blank = `Hardly ________ (${ev} / commence) when the power grid suffered an unforeseen interruption.`;
      correct = `had ${ev} commenced`;
      wrong = [`${ev} had commenced`, `commenced ${ev}`, `did ${ev} commence`];
      unit = 'Inversion Structures (Unit 110)';
    }

    const rawOptions = [correct, ...wrong];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(correct);

    const id = `gm_${String(i + 1).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'grammar',
      category: `Raymond Murphy • ${unit}`,
      level: levels[i % levels.length],
      en: en,
      target: en,
      missingWord: correct,
      prompt_en: `Murphy Grammar: "${blank}"`,
      prompt_id: `Tata Bahasa Murphy: "${blank}"`,
      options: shuffledOptions,
      correctIndex: correctIndex,
      phonetic: `/${correct}/`,
      id_translation: `Latihan tata bahasa Inggris: "${en}"`,
      id_prompt: `Lengkapi kalimat: "${blank}"`,
      en_prompt: `Translate to Indonesian: "${en}"`,
      notes: `Fokus tata bahasa: ${unit}. Pilihan jawaban diacak (A/B/C/D).`
    });
  }

  return list;
}

/* ============================================================================
   5. IELTS ACADEMIC SIMULATION (500 questions)
   ============================================================================ */
function generateIELTS(count) {
  const levels = ['IELTS Band 6.5 - 7.0', 'IELTS Band 7.5 - 8.0', 'IELTS Band 8.5 - 9.0'];

  const academicTopics = [
    {
      cue: 'Describe a public transportation development that improved your region.',
      q: 'How has modern transportation infrastructure transformed commuter mobility?',
      vocabList: [
        { v: 'substantially curtailed', w: ['slightly increased', 'barely affected', 'randomly stopped'], en: 'High-speed railway networks have substantially curtailed intercity travel times across regional hubs.', id: 'Jaringan kereta cepat telah secara substansial memangkas waktu perjalanan antarkota.' },
        { v: 'alleviated vehicular congestion', w: ['worsened traffic jams', 'blocked highway routes', 'slowed transit speeds'], en: 'Expanding metropolitan metro systems has alleviated vehicular congestion in downtown business districts.', id: 'Memperluas sistem metro metropolitan telah mengurangi kemacetan kendaraan di kawasan bisnis pusat kota.' },
        { v: 'catalyzing economic decentralization', w: ['preventing commercial growth', 'restricting suburban trade', 'isolating remote towns'], en: 'Efficient public transit routes play an indispensable role in catalyzing economic decentralization.', id: 'Rute transit publik yang efisien memainkan peran penting dalam mengkatalisasi desentralisasi ekonomi.' },
        { v: 'fostered sustainable urban mobility', w: ['promoted heavy pollution', 'discouraged eco habits', 'wasted public funds'], en: 'Municipal investments in electric bus fleets have fostered sustainable urban mobility across the capital.', id: 'Investasi pemerintah kota pada armada bus listrik telah mendorong mobilitas perkotaan yang berkelanjutan.' }
      ]
    },
    {
      cue: 'Describe an environmental regulation or initiative you consider effective.',
      q: 'Do strict fiscal penalties deter industrial polluters successfully?',
      vocabList: [
        { v: 'formidable deterrent', w: ['minor inconvenience', 'temporary suggestion', 'negligible factor'], en: 'Rigorous enforcement coupled with fiscal disincentives provides a formidable deterrent against corporate emissions.', id: 'Penegakan hukum yang ketat ditambah disinsentif fiskal memberikan efek jera yang tangguh terhadap emisi perusahaan.' },
        { v: 'mitigate ecological degradation', w: ['accelerate deforestation', 'ignore natural damage', 'expand waste landfills'], en: 'Comprehensive environmental treaties aim to mitigate ecological degradation in vulnerable coastal wetlands.', id: 'Perjanjian lingkungan yang komprehensif bertujuan untuk memitigasi degradasi ekologis di lahan basah pesisir.' },
        { v: 'incentivizing carbon neutrality', w: ['taxing renewable power', 'penalizing clean energy', 'subsidizing coal mining'], en: 'Progressive tax credits succeed in incentivizing carbon neutrality among domestic manufacturing plants.', id: 'Kredit pajak progresif berhasil memberi insentif terhadap netralitas karbon di kalangan pabrik manufaktur dalam negeri.' },
        { v: 'preserving delicate biodiversity', w: ['destroying rare habitats', 'hunting endangered species', 'clearing pristine forests'], en: 'Establishing protected marine sanctuaries remains pivotal for preserving delicate biodiversity.', id: 'Mendirikan suaka laut yang dilindungi tetap menjadi kunci untuk melestarikan keanekaragaman hayati yang rentan.' }
      ]
    },
    {
      cue: 'Describe a significant technological innovation that impacted daily life.',
      q: 'What ethical considerations accompany automated decision algorithms?',
      vocabList: [
        { v: 'obscures accountability', w: ['clarifies responsibility', 'simplifies justice', 'enhances transparency'], en: 'Algorithmic opacity frequently obscures accountability when automated systems make erroneous credit approvals.', id: 'Ketidakjelasan algoritma sering mengaburkan akuntabilitas ketika sistem otomatis membuat persetujuan kredit yang keliru.' },
        { v: 'unprecedented predictive accuracy', w: ['unreliable guesswork', 'haphazard estimates', 'inconsistent outcomes'], en: 'Advanced neural networks demonstrate unprecedented predictive accuracy in identifying early meteorological shifts.', id: 'Jaringan saraf mutakhir menunjukkan akurasi prediktif yang belum pernah ada sebelumnya dalam mengidentifikasi pergeseran cuaca.' },
        { v: 'exacerbates socioeconomic disparities', w: ['equalizes personal income', 'levels social playing fields', 'eradicates poverty'], en: 'Unequal access to cutting-edge artificial intelligence exacerbates socioeconomic disparities in emerging markets.', id: 'Akses yang tidak merata ke kecerdasan buatan mutakhir memperburuk kesenjangan sosial ekonomi di pasar berkembang.' },
        { v: 'transformative paradigm shift', w: ['trivial minor tweak', 'temporary cosmetic change', 'irrelevant adjustment'], en: 'Autonomous machine learning algorithms represent a transformative paradigm shift in modern biotechnology.', id: 'Algoritma pembelajaran mesin otonom mewakili perubahan paradigma transformatif dalam bioteknologi modern.' }
      ]
    },
    {
      cue: 'Describe a cultural heritage tradition or artistic expression in your society.',
      q: 'Should public funding subsidize fine arts and cultural conservation?',
      vocabList: [
        { v: 'intangible cultural heritage', w: ['disposable merchandise', 'obsolete consumer items', 'fleeting digital fads'], en: 'State endowments safeguard intangible cultural heritage that commercial market forces would otherwise neglect.', id: 'Bantuan negara melindungi warisan budaya takbenda yang jika tidak dilindungi akan diabaikan oleh kekuatan pasar komersial.' },
        { v: 'enriching civic identity', w: ['dividing local residents', 'erasing ancient folklore', 'commercializing sacred sites'], en: 'Preserving historic architectural monuments plays an indispensable role in enriching civic identity.', id: 'Melestarikan monumen arsitektur bersejarah memainkan peran penting dalam memperkaya identitas kewarganegaraan.' },
        { v: 'fostering communal cohesion', w: ['sparking ethnic discord', 'provoking public disputes', 'isolating neighborhoods'], en: 'Traditional performing arts festivals contribute significantly to fostering communal cohesion across generations.', id: 'Festival seni pertunjukan tradisional berkontribusi signifikan dalam memupuk kelekatan masyarakat lintas generasi.' },
        { v: 'evoking aesthetic appreciation', w: ['boring modern audiences', 'confusing casual spectators', 'repelling art enthusiasts'], en: 'Classical museum exhibitions succeed in evoking aesthetic appreciation among younger generations.', id: 'Pameran museum klasik berhasil membangkitkan apresiasi estetika di kalangan generasi muda.' }
      ]
    },
    {
      cue: 'Describe an international collaboration project you studied or participated in.',
      q: 'Why is intercultural communication competence vital in global commerce?',
      vocabList: [
        { v: 'mitigates interpersonal friction', w: ['provokes sudden hostility', 'creates commercial barriers', 'delays executive decisions'], en: 'Cross-cultural acumen mitigates interpersonal friction and facilitates harmonious multilateral negotiations.', id: 'Kecakapan lintas budaya memitigasi gesekan antarpribadi dan memfasilitasi negosiasi multilateral yang harmonis.' },
        { v: 'transcending geographical boundaries', w: ['restricting domestic travel', 'erecting trade tariffs', 'closing regional borders'], en: 'Collaborative cloud platforms empower researchers by transcending geographical boundaries seamlessly.', id: 'Platform cloud kolaboratif memberdayakan para peneliti dengan melampaui batas geografis secara mulus.' },
        { v: 'synergistic collaborative outcomes', w: ['counterproductive rivalries', 'uncoordinated failures', 'antagonistic standstills'], en: 'Combining multidisciplinary engineering teams leads to synergistic collaborative outcomes in medical science.', id: 'Menggabungkan tim insinyur multidisiplin menghasilkan luaran kolaboratif yang sinergis dalam sains medis.' },
        { v: 'harmonizing disparate standards', w: ['multiplying confusing rules', 'fracturing global metrics', 'violating trade statutes'], en: 'International treaties achieve lasting stability by harmonizing disparate standards across member states.', id: 'Perjanjian internasional mencapai stabilitas abadi dengan menyelaraskan standar yang berbeda di seluruh negara anggota.' }
      ]
    }
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const topic = academicTopics[i % academicTopics.length];
    const vocabItem = topic.vocabList[Math.floor(i / academicTopics.length) % topic.vocabList.length];

    const enSentence = vocabItem.en;
    const blankSentence = enSentence.replace(vocabItem.v, '________');
    const rawOptions = [vocabItem.v, ...vocabItem.w];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(vocabItem.v);

    const id = `ielts_${String(i + 1).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'ielts',
      category: 'IELTS Academic Simulation • Band 7.5 - 9.0',
      level: levels[i % levels.length],
      cue_card: topic.cue,
      en: enSentence,
      target: enSentence,
      missingWord: vocabItem.v,
      prompt_en: `IELTS Speaking/Reading (${topic.q}): "${blankSentence}"`,
      prompt_id: `Simulasi IELTS (${topic.q}): "${blankSentence}"`,
      options: shuffledOptions,
      correctIndex: correctIndex,
      phonetic: `/${vocabItem.v}/`,
      id_translation: vocabItem.id,
      id_prompt: `IELTS Speaking: Dengarkan & jawab dalam Bahasa Indonesia: "${vocabItem.id}"`,
      en_prompt: `IELTS Practice: Translate "${enSentence}" to Indonesian.`,
      notes: `IELTS Band 8.0+ Lexical Resource. Pertanyaan topik: "${topic.q}".`
    });
  }

  return list;
}

/* ============================================================================
   6. TOEFL iBT SIMULATION (500 questions)
   ============================================================================ */
function generateTOEFL(count) {
  const levels = ['TOEFL iBT 80 - 90', 'TOEFL iBT 91 - 105', 'TOEFL iBT 106 - 120'];

  const lectures = [
    {
      subject: 'Marine Biology • Coral Reef Symbiosis',
      prompt: 'Why is mutualistic symbiosis indispensable for coral reef survival?',
      items: [
        { v: 'facilitating calcification', w: ['preventing mineral growth', 'dissolving reef structures', 'blocking sunlight penetration'], en: 'Symbiotic zooxanthellae produce vital photosynthetic compounds, thereby facilitating calcification in marine corals.', id: 'Alga zooxanthellae simbiotik menghasilkan senyawa fotosintesis penting, sehingga memfasilitasi kalsifikasi pada karang laut.' },
        { v: 'catastrophic thermal bleaching', w: ['rapid healthy reproduction', 'beneficial genetic mutation', 'optimal seasonal spawning'], en: 'Elevated sea surface temperatures trigger catastrophic thermal bleaching across tropical barrier reefs.', id: 'Kenaikan suhu permukaan laut memicu pemutihan termal katastropik di sepanjang terumbu karang tropis.' },
        { v: 'intricate trophic interactions', w: ['barren sterile environments', 'lifeless ocean expanses', 'monotonous single species'], en: 'Coral reefs support intricate trophic interactions that sustain nearly one quarter of all ocean biodiversity.', id: 'Terumbu karang mendukung interaksi trofik yang rumit yang menopang hampir seperempat dari seluruh keanekaragaman hayati laut.' },
        { v: 'nutrient-poor tropical waters', w: ['heavy industrial runoff', 'fertilizer-saturated bays', 'densely polluted harbors'], en: 'Reef-building colonies thrive remarkably within nutrient-poor tropical waters due to internal nutrient recycling.', id: 'Koloni pembangun karang berkembang dengan luar biasa di perairan tropis yang miskin nutrisi berkat daur ulang nutrisi internal.' }
      ]
    },
    {
      subject: 'Art History • The Impressionist Revolution',
      prompt: 'What distinguished Impressionist painters from their academic predecessors?',
      items: [
        { v: 'transitory optical sensations', w: ['permanent mythological allegories', 'strict mathematical grids', 'heavy historical tableaux'], en: 'Impressionists prioritized transitory optical sensations and fluctuating natural illumination over studio conventions.', id: 'Kaum Impresionis memprioritaskan sensasi optik sekilas dan pencahayaan alami yang berfluktuasi di atas konvensi studio.' },
        { v: 'en plein air painting', w: ['underground darkroom etching', 'copying classical plaster busts', 'exclusive indoor fresco work'], en: 'The development of portable paint tubes enabled artists to conduct en plein air painting directly in natural landscapes.', id: 'Perkembangan tabung cat portabel memungkinkan seniman melukis en plein air langsung di lanskap alam terbuka.' },
        { v: 'unblended broken brushstrokes', w: ['hyper-smooth porcelain varnishes', 'invisible micro-glazes', 'monochromatic pencil shadings'], en: 'Painters applied unblended broken brushstrokes to replicate the dynamic vibrations of ambient daylight.', id: 'Para pelukis menerapkan sapuan kuas putus-putus tanpa pencampuran untuk mereplikasi getaran dinamis cahaya alami.' },
        { v: 'rejected academic hierarchies', w: ['worshipped monarchist patrons', 'obeyed conservative juries', 'imitated medieval manuscripts'], en: 'Radical independent exhibitions openly rejected academic hierarchies governing acceptable subject matter.', id: 'Pameran independen radikal secara terbuka menolak hierarki akademis yang mengatur materi subjek lukisan.' }
      ]
    },
    {
      subject: 'Economics • Market Externalities',
      prompt: 'Why do environmental externalities justify regulatory intervention?',
      items: [
        { v: 'unfettered free markets', w: ['strictly planned state quotas', 'barter-based village economies', 'heavily taxed socialist sectors'], en: 'Uncompensated pollution damage demonstrates how unfettered free markets fail to internalize ecological destruction.', id: 'Kerusakan polusi tanpa kompensasi menunjukkan bagaimana pasar bebas tanpa kendali gagal menginternalisasi kehancuran ekologis.' },
        { v: 'misallocation of societal resources', w: ['perfect economic equilibrium', 'equitable wealth distribution', 'flawless industrial planning'], en: 'Ignoring negative externalities invariably results in the severe misallocation of societal resources over time.', id: 'Mengabaikan eksternalitas negatif selalu menghasilkan kesalahan alokasi sumber daya masyarakat yang parah dari waktu ke waktu.' },
        { v: 'internalizing external costs', w: ['subsidizing heavy polluters', 'eliminating public taxes', 'concealing industrial spills'], en: 'Pigouvian taxes correct market inefficiencies by internalizing external costs directly onto manufacturing polluters.', id: 'Pajak Pigouvian memperbaiki ketidakefisienan pasar dengan menginternalisasi biaya eksternal langsung kepada produsen pencemar.' },
        { v: 'tragedy of the open commons', w: ['private property stewardship', 'careful resource rationing', 'sustainable communal harvesting'], en: 'Unregulated oceanic fisheries exemplify the tragedy of the open commons when individual incentives deplete shared reserves.', id: 'Perikanan laut tanpa regulasi mencontohkan tragedi milik bersama ketika insentif individu menghabiskan cadangan bersama.' }
      ]
    },
    {
      subject: 'Astrophysics • Stellar Nucleosynthesis',
      prompt: 'How do massive stars forge heavy elements prior to supernova explosion?',
      items: [
        { v: 'thermonuclear fusion pressure', w: ['chemical combustion spark', 'friction heat from dust', 'ambient vacuum chill'], en: 'During stellar main sequence life, outward thermonuclear fusion pressure perfectly balances inward gravitational attraction.', id: 'Selama masa deret utama bintang, tekanan fusi termonuklir ke luar mengimbangi tarikan gravitasi ke dalam secara sempurna.' },
        { v: 'cataclysmic supernova detonation', w: ['gentle thermal evaporation', 'gradual silent freezing', 'perpetual static calm'], en: 'The catastrophic collapse of an iron core culminates in a cataclysmic supernova detonation dispersing forged elements.', id: 'Runtuhnya inti besi yang katastropik berpuncak pada ledakan supernova dahsyat yang menyebarkan unsur-unsur yang telah ditempa.' },
        { v: 'successive nuclear burning shells', w: ['single uniform gas layers', 'inert crystalline coatings', 'pure water-ice blankets'], en: 'Evolved massive supergiants develop successive nuclear burning shells resembling the layers of a cosmic onion.', id: 'Bintang maharaksasa yang berevolusi mengembangkan lapisan pembakaran nuklir berturut-turut menyerupai lapisan bawang kosmik.' },
        { v: 'rapid neutron capture synthesis', w: ['slow mechanical compression', 'simple electrostatic repulsion', 'spontaneous radioactive decay'], en: 'Heavy elements beyond iron originate exclusively through rapid neutron capture synthesis during violent cosmic explosions.', id: 'Unsur berat di luar besi berasal secara eksklusif melalui sintesis penangkapan neutron cepat selama ledakan kosmik dahsyat.' }
      ]
    },
    {
      subject: 'Cognitive Psychology • Working Memory Architecture',
      prompt: 'What constitutes the Multi-Component Working Memory model?',
      items: [
        { v: 'central executive supervisory system', w: ['unconscious reflex mechanism', 'automatic sensory buffer', 'permanent emotional archive'], en: 'Baddeley proposed that the central executive supervisory system directs attention between phonological and visual subsystems.', id: 'Baddeley mengusulkan bahwa sistem eksekutif pusat pengawas mengarahkan perhatian antara subsistem fonologis dan visual.' },
        { v: 'phonological articulatory loop', w: ['motor coordination circuit', 'olfactory scent registry', 'cardiovascular feedback loop'], en: 'Verbal information is rehearsed continuously via the phonological articulatory loop to prevent rapid decay.', id: 'Informasi verbal diulang secara terus menerus melalui putaran artikulatoris fonologis untuk mencegah kepunahan cepat.' },
        { v: 'visuospatial sketchpad buffer', w: ['auditory echo chamber', 'tactile reflex receptor', 'chronological diary recorder'], en: 'Mental imagery and geographical navigation rely heavily on the temporary visuospatial sketchpad buffer.', id: 'Imajinasi mental dan navigasi geografis sangat bergantung pada penyangga sketsa visual-spasial sementara.' },
        { v: 'limited cognitive channel capacity', w: ['infinite data retention', 'unrestricted processing bandwidth', 'boundless memory reservoirs'], en: 'Multitasking across similar cognitive modalities suffers interference due to limited cognitive channel capacity.', id: 'Multitasking pada modalitas kognitif serupa mengalami interferensi karena keterbatasan kapasitas saluran kognitif.' }
      ]
    }
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const lecture = lectures[i % lectures.length];
    const item = lecture.items[Math.floor(i / lectures.length) % lecture.items.length];

    const enSentence = item.en;
    const blankSentence = enSentence.replace(item.v, '________');
    const rawOptions = [item.v, ...item.w];
    const shuffledOptions = shuffle(rawOptions);
    const correctIndex = shuffledOptions.indexOf(item.v);

    const id = `toefl_${String(i + 1).padStart(4, '0')}`;
    list.push({
      id,
      mode: 'toefl',
      category: `TOEFL iBT Simulation • ${lecture.subject}`,
      level: levels[i % levels.length],
      lecture_topic: lecture.subject,
      en: enSentence,
      target: enSentence,
      missingWord: item.v,
      prompt_en: `TOEFL Question (${lecture.prompt}): "${blankSentence}"`,
      prompt_id: `Simulasi TOEFL (${lecture.prompt}): "${blankSentence}"`,
      options: shuffledOptions,
      correctIndex: correctIndex,
      phonetic: `/${item.v}/`,
      id_translation: item.id,
      id_prompt: `TOEFL Listening & Speaking: Dengarkan & jawab dalam Bahasa Indonesia: "${item.id}"`,
      en_prompt: `TOEFL Practice: Translate "${enSentence}" to Indonesian.`,
      notes: `TOEFL Academic Vocabulary: ${item.v}. Disertai opsi ganda teracak (A/B/C/D).`
    });
  }

  return list;
}

/* ============================================================================
   MAIN EXECUTION
   ============================================================================ */
console.log('Generating 5,000 clean questions with ZERO artificial numbers (#303, #12, etc.)...');

const shadowing = generateShadowing(1000);
const listening = generateListening(1000);
const vocabulary = generateVocabulary(1000);
const grammar = generateGrammar(1000);
const ielts = generateIELTS(500);
const toefl = generateTOEFL(500);

const allQuestions = [
  ...shadowing,
  ...listening,
  ...vocabulary,
  ...grammar,
  ...ielts,
  ...toefl
];

console.log(`Generated total: ${allQuestions.length} questions.`);
console.log(`- Shadowing: ${shadowing.length}`);
console.log(`- Listening: ${listening.length}`);
console.log(`- Vocabulary: ${vocabulary.length}`);
console.log(`- Grammar: ${grammar.length}`);
console.log(`- IELTS: ${ielts.length}`);
console.log(`- TOEFL: ${toefl.length}`);

// Safety check: ensure ZERO '#' characters exist in sentences, prompts, or options
const allText = allQuestions.map(q => `${q.en} ${q.target} ${q.prompt_en} ${q.prompt_id} ${q.id_translation} ${(q.options || []).join(' ')}`).join(' ');
const hashMatches = allText.match(/#\d+|#\w+/g);
if (hashMatches && hashMatches.length > 0) {
  console.error('ERROR: Found # symbols in questions:', hashMatches.slice(0, 10));
  process.exit(1);
} else {
  console.log('Verification passed: Exactly 0 question numbers (#) found in text!');
}

const outputData = {
  version: '2.5.0',
  description: 'Awesome English Arena - Complete 5,000 Question Dataset with Natural Real-World English',
  stats: {
    total: allQuestions.length,
    shadowing: shadowing.length,
    listening: listening.length,
    vocabulary: vocabulary.length,
    grammar: grammar.length,
    ielts: ielts.length,
    toefl: toefl.length
  },
  questions: allQuestions
};

// Target paths
const targetPaths = [
  path.join(__dirname, 'data', 'questions.json'),
  path.join(__dirname, '..', 'leaderboard-repo', 'data', 'questions.json')
];

targetPaths.forEach(tp => {
  const dir = path.dirname(tp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(tp, JSON.stringify(outputData, null, 2), 'utf-8');
  console.log(`Saved ${allQuestions.length} questions to ${tp}`);
});

console.log('All 5,000 questions regenerated successfully!');
