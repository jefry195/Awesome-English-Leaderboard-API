const fs = require('fs');
const path = require('path');

const gameDir = __dirname;
const datasetPath = path.join(gameDir, 'data', 'questions.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const bank = {
  shadowing: dataset.questions.filter(q => q.mode === 'shadowing'),
  listening: dataset.questions.filter(q => q.mode === 'listening'),
  vocabulary: dataset.questions.filter(q => q.mode === 'vocabulary'),
  grammar: dataset.questions.filter(q => q.mode === 'grammar')
};

let appJs = fs.readFileSync(path.join(gameDir, 'app.js'), 'utf8');

// 1. Replace QUESTION_BANK definition
const bankJsonStr = JSON.stringify(bank, null, 2);
const regexBank = /const QUESTION_BANK = \{[\s\S]*?\n  \};\n\n  \/\* ==========================================================================\n     2\. AUDIO SYNTHESIS/;

if (regexBank.test(appJs)) {
  appJs = appJs.replace(regexBank, `const QUESTION_BANK = ${bankJsonStr};\n\n  /* ==========================================================================\n     2. AUDIO SYNTHESIS`);
  console.log('Replaced QUESTION_BANK with full 80 questions in app.js.');
} else {
  console.log('Regex for QUESTION_BANK did not match, please check pattern.');
}

// 2. Update loadQuestionsFromGitHub to loadQuestionsDataset (checking local ./data/questions.json first for Vercel, then GitHub)
const oldLoadFn = `    async loadQuestionsFromGitHub() {
      try {
        const res = await fetch(GITHUB_DATA_URL);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.questions) && data.questions.length > 0) {
            data.questions.forEach(q => {
              const item = {
                id: q.id,
                category: q.category,
                level: q.level,
                en: q.en,
                target: q.en,
                phonetic: q.phonetic,
                translation: q.id_translation,
                id_translation: q.id_translation,
                id_prompt: q.id_prompt,
                en_prompt: q.en_prompt,
                options: q.options_en || q.options_id,
                options_id: q.options_id,
                options_en: q.options_en,
                notes: q.notes
              };
              QUESTION_BANK.shadowing.push(item);
            });
            console.log('Successfully synced question dataset from GitHub:', GITHUB_DATA_URL);
          }
        }
      } catch (err) {
        console.log('Loaded offline curated question bank.');
      }
    }`;

const newLoadFn = `    async loadQuestionsFromGitHub() {
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
                
                // Avoid duplicates
                const exists = QUESTION_BANK[targetMode].some(item => item.id === q.id || item.en === q.en);
                if (!exists) {
                  QUESTION_BANK[targetMode].push({
                    id: q.id,
                    mode: targetMode,
                    category: q.category,
                    level: q.level,
                    en: q.en,
                    target: q.target || q.en,
                    phonetic: q.phonetic,
                    translation: q.id_translation || q.translation,
                    id_translation: q.id_translation || q.translation,
                    id_prompt: q.id_prompt,
                    en_prompt: q.en_prompt,
                    missingWord: q.missingWord,
                    prompt_en: q.prompt_en,
                    prompt_id: q.prompt_id,
                    options: q.options || q.options_en || q.options_id,
                    options_id: q.options_id,
                    options_en: q.options_en,
                    correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
                    notes: q.notes
                  });
                }
              });
              console.log('Successfully synced question dataset from:', url);
              break; // loaded successfully
            }
          }
        } catch (err) {
          // try next endpoint
        }
      }
    }`;

if (appJs.includes('async loadQuestionsFromGitHub()')) {
  appJs = appJs.replace(oldLoadFn, newLoadFn);
  console.log('Updated loadQuestionsFromGitHub to support multi-mode and local Vercel loading.');
}

fs.writeFileSync(path.join(gameDir, 'app.js'), appJs, 'utf8');
console.log('Successfully updated app.js!');
