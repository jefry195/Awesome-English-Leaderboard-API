const fs = require('fs');
const path = require('path');

const gameDir = __dirname;

// 1. UPDATE index.html
let html = fs.readFileSync(path.join(gameDir, 'index.html'), 'utf8');

// A. Add Credit by Jefri to Navbar
if (!html.includes('btn-credit-jefri')) {
  html = html.replace(
    '<button id="btn-login-nav" class="btn btn-primary btn-sm"',
    `<a href="https://jefri-orcin.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn btn-credit-jefri" title="Kunjungi Portofolio Developer Jefri">
          👨‍💻 Credit by Jefri ↗
        </a>
        <button id="btn-login-nav" class="btn btn-primary btn-sm"`
  );
}

// B. Replace Language Direction Selector (English -> Indonesia default & only)
const oldLangWrapperRegex = /<!-- Language Direction Switcher [\s\S]*?<\/div>\s*<\/div>/;
const newLangWrapper = `<!-- Active English to Indonesia Direction -->
        <div class="lang-direction-wrapper">
          <div class="lang-direction-title">Metode Latihan Default:</div>
          <div class="lang-direction-group">
            <div class="btn-lang-dir active" id="btn-dir-active">
              <span class="flag-icon">🇬🇧</span> English ➔ <span class="flag-icon">🇮🇩</span> Indonesia (Listening, Speaking & Comprehension)
            </div>
          </div>
        </div>`;
html = html.replace(oldLangWrapperRegex, newLangWrapper);

// C. Add IELTS & TOEFL Cards to modes-grid
if (!html.includes('data-mode="ielts"')) {
  const ieltsToeflCards = `
          <!-- Mode 5: IELTS Academic Simulation -->
          <div class="mode-card" data-mode="ielts" id="mode-ielts-card">
            <div class="mode-header">
              <span class="mode-icon">🎯</span>
              <span class="mode-tag tag-popular">Band 7.5 - 9.0</span>
            </div>
            <h3 class="mode-title">IELTS Academic Simulation</h3>
            <p class="mode-desc">Speaking Part 1 & Part 2 Cue Cards with official Band 0-9 lexical evaluation. Train academic vocabulary and high-band fluency!</p>
            <div class="mode-footer">
              <span class="mode-source">From: Cambridge IELTS Official</span>
              <button class="btn btn-primary btn-sm btn-play-mode" data-mode="ielts">Play Arena →</button>
            </div>
          </div>

          <!-- Mode 6: TOEFL iBT Simulation -->
          <div class="mode-card" data-mode="toefl" id="mode-toefl-card">
            <div class="mode-header">
              <span class="mode-icon">🏛️</span>
              <span class="mode-tag">Score 26 - 30</span>
            </div>
            <h3 class="mode-title">TOEFL iBT Test Quest</h3>
            <p class="mode-desc">Integrated Academic Speaking & Listening passages inspired by university lectures across Science, Arts, and Economics.</p>
            <div class="mode-footer">
              <span class="mode-source">From: ETS TOEFL Official Guide</span>
              <button class="btn btn-primary btn-sm btn-play-mode" data-mode="toefl">Play Arena →</button>
            </div>
          </div>
        </div>`;

  html = html.replace('</div>\n        </div>\n      </div>\n    </section>\n\n    <!-- VIEW 2: GAME ARENA SCREEN -->', `${ieltsToeflCards}\n      </div>\n    </section>\n\n    <!-- VIEW 2: GAME ARENA SCREEN -->`);
}

// D. Remove Demo Account Hints on Login Modal
const oldAuthHintsRegex = /<div class="auth-hints">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- MODAL: LEADERBOARD/;
const newAuthModalEnd = `</div>\n    </div>\n  </div>\n\n  <!-- MODAL: LEADERBOARD`;
html = html.replace(oldAuthHintsRegex, newAuthModalEnd);

fs.writeFileSync(path.join(gameDir, 'index.html'), html, 'utf8');
console.log('Updated game/index.html successfully.');

// 2. UPDATE styles.css for Credit Badge & Grid expansion
let css = fs.readFileSync(path.join(gameDir, 'styles.css'), 'utf8');
if (!css.includes('.btn-credit-jefri')) {
  const creditCss = `
/* Credit by Jefri Button Badge */
.btn-credit-jefri {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.25));
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #e2e8f0;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all var(--trans-fast);
}
.btn-credit-jefri:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  border-color: #8b5cf6;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
  transform: translateY(-1px);
}
`;
  css += creditCss;
  fs.writeFileSync(path.join(gameDir, 'styles.css'), css, 'utf8');
  console.log('Updated game/styles.css with credit styling.');
}

// 3. UPDATE app.js
let js = fs.readFileSync(path.join(gameDir, 'app.js'), 'utf8');

// A. Language Direction default: en-to-id
js = js.replace("this.languageDirection = 'id-to-en';", "this.languageDirection = 'en-to-id';");

// B. Remove auto-login in AuthManager.init
const oldAuthInit = `      } else {
        // Auto-login default admin for smooth initial experience
        this.currentUser = {
          email: 'jefri@admin.com',
          name: 'Jefri (Owner)',
          totalScore: 1500,
          level: 4,
          status: 'ACTIVE'
        };
        this.save();
      }`;
const newAuthInit = `      } else {
        this.currentUser = null;
      }`;
js = js.replace(oldAuthInit, newAuthInit);

// C. Show Login Modal immediately on load if not logged in
if (!js.includes('// Show login modal at start if not logged in')) {
  js = js.replace(
    'this.loadQuestionsFromGitHub();',
    `this.loadQuestionsFromGitHub();

      // Show login modal at start if not logged in
      if (!AuthManager.isLoggedIn()) {
        setTimeout(() => {
          this.openAuthModal('Selamat datang! Silakan masuk dengan akun Anda untuk mulai bermain.');
        }, 300);
      }`
  );
}

// D. Add ielts and toefl to modeTitles in startArena
if (!js.includes("'ielts': 'IELTS Academic Simulation'")) {
  js = js.replace(
    "grammar: 'Murphy Grammar Quest'",
    `grammar: 'Murphy Grammar Quest',
        ielts: 'IELTS Academic Simulation (Band 0-9)',
        toefl: 'TOEFL iBT Simulation (Scale 0-30)'`
  );
}

// E. Randomize Multiple Choice Options in renderQuestion so it is NEVER always A
const oldMcRender = `        if (q.options && q.options.length > 0) {
          this.dom.challenge.optionsContainer.innerHTML = '';
          this.dom.challenge.optionsContainer.classList.remove('hidden');

          q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = \`\${String.fromCharCode(65 + idx)}. \${opt}\`;
            btn.addEventListener('click', () => {
              this.evaluateMultipleChoice(idx, btn);
            });
            this.dom.challenge.optionsContainer.appendChild(btn);
          });
        } else {`;

const newMcRender = `        if (q.options && q.options.length > 0) {
          this.dom.challenge.optionsContainer.innerHTML = '';
          this.dom.challenge.optionsContainer.classList.remove('hidden');

          // Dynamically shuffle options for display so answers are never always A
          const displayList = q.options.map((opt, origIdx) => ({
            text: opt,
            isCorrect: (origIdx === q.correctIndex)
          }));
          
          for (let i = displayList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [displayList[i], displayList[j]] = [displayList[j], displayList[i]];
          }

          displayList.forEach((item, displayIdx) => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = \`\${String.fromCharCode(65 + displayIdx)}. \${item.text}\`;
            btn.addEventListener('click', () => {
              this.evaluateMultipleChoiceRandomized(displayIdx, btn, displayList);
            });
            this.dom.challenge.optionsContainer.appendChild(btn);
          });
        } else {`;

js = js.replace(oldMcRender, newMcRender);

// F. Add evaluateMultipleChoiceRandomized method
if (!js.includes('evaluateMultipleChoiceRandomized(')) {
  const newEvalMethod = `    evaluateMultipleChoiceRandomized(selectedDisplayIdx, btnElement, displayList) {
      const selectedItem = displayList[selectedDisplayIdx];
      const isCorrect = selectedItem.isCorrect;
      const chosenWord = selectedItem.text;

      const allButtons = this.dom.challenge.optionsContainer.querySelectorAll('.btn-option');
      allButtons.forEach((b, idx) => {
        b.disabled = true;
        if (displayList[idx].isCorrect) {
          b.classList.add('correct');
        } else if (idx === selectedDisplayIdx && !isCorrect) {
          b.classList.add('wrong');
        }
      });

      this.evaluateAnswer(chosenWord, isCorrect);
    }

`;
  js = js.replace('evaluateMultipleChoice(selectedIdx, btnElement) {', newEvalMethod + '    evaluateMultipleChoice(selectedIdx, btnElement) {');
}

// G. Support IELTS and TOEFL in renderQuestion
if (!js.includes("this.currentMode === 'ielts'")) {
  js = js.replace(
    "} else if (this.currentMode === 'vocabulary' || this.currentMode === 'grammar') {",
    "} else if (this.currentMode === 'vocabulary' || this.currentMode === 'grammar' || this.currentMode === 'ielts' || this.currentMode === 'toefl') {"
  );
}

fs.writeFileSync(path.join(gameDir, 'app.js'), js, 'utf8');
console.log('Updated game/app.js successfully.');
