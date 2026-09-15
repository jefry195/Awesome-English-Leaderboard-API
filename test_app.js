const fs = require('fs');
const assert = require('assert');

console.log('Testing Awesome English Game components...');

// 1. Check game/index.html elements
const html = fs.readFileSync('game/index.html', 'utf8');

const requiredIds = [
  'landing-view', 'game-view', 'result-view', 'progress-view', 'profile-view',
  'desktop-nav-tabs', 'bottom-nav-bar', 'player-dashboard-card',
  'dash-player-name', 'dash-tier-badge', 'dash-level-badge', 'dash-streak-count', 'dash-xp-fraction', 'dash-xp-progress-fill',
  'btn-dashboard-start', 'hud-hearts', 'hud-combo', 'hud-score', 'hud-streak', 'hud-progress',
  'btn-replay-audio', 'sentence-builder-container', 'builder-answer-zone', 'builder-word-bank',
  'btn-builder-undo', 'btn-builder-clear', 'btn-builder-check',
  'eval-translation-card', 'eval-example-card', 'eval-grammar-card', 'phonetic-reveal-box',
  'stat-vocab-count', 'stat-grammar-count', 'stat-listening-score', 'stat-speaking-score', 'stat-total-xp', 'stat-games-played', 'stat-accuracy-rate',
  'profile-hearts-icons', 'btn-profile-refill-hearts', 'badges-grid-container',
  'modal-hearts', 'floating-xp-container'
];

for (const id of requiredIds) {
  assert(html.includes(`id="${id}"`), `Missing HTML element with id: ${id}`);
}
console.log(`✓ [HTML] All ${requiredIds.length} required UI elements and views are present.`);

// 2. Check game/app.js syntax & Question Bank contents
const appJs = fs.readFileSync('game/app.js', 'utf8');
assert(appJs.includes('class EnglishArenaGame'), 'Missing EnglishArenaGame class');
assert(appJs.includes('sentence_builder'), 'Missing sentence_builder mode in app.js');
assert(appJs.includes('getBadgeCatalog'), 'Missing getBadgeCatalog in app.js');
assert(appJs.includes('renderSentenceBuilder'), 'Missing renderSentenceBuilder in app.js');
assert(appJs.includes('deductHeart'), 'Missing deductHeart in app.js');
assert(appJs.includes('refillHearts'), 'Missing refillHearts in app.js');
assert(appJs.includes('showFloatingXP'), 'Missing showFloatingXP in app.js');
assert(appJs.includes('updateProgressView'), 'Missing updateProgressView in app.js');
assert(appJs.includes('updateProfileView'), 'Missing updateProfileView in app.js');
assert(appJs.includes('updateDashboard'), 'Missing updateDashboard in app.js');

// 3. Check standalone canvas.html
const canvasHtml = fs.readFileSync('game/canvas.html', 'utf8');
assert(canvasHtml.length > 200000, 'canvas.html seems too small or incomplete');
assert(canvasHtml.includes('class EnglishArenaGame'), 'canvas.html missing EnglishArenaGame script');
assert(canvasHtml.includes('sentence-builder-container'), 'canvas.html missing sentence builder');
console.log(`✓ [Canvas] Standalone canvas.html verified (${(canvasHtml.length / 1024).toFixed(1)} KB).`);

// 4. Verify questions dataset
const questionsJson = JSON.parse(fs.readFileSync('game/data/questions.json', 'utf8'));
assert(Array.isArray(questionsJson.questions), 'questions.json missing questions array');
assert(questionsJson.questions.length > 50, 'questions.json has too few questions');
const modes = new Set(questionsJson.questions.map(q => q.mode));
assert(modes.has('vocabulary'), 'Missing vocabulary questions');
assert(modes.has('grammar'), 'Missing grammar questions');
assert(modes.has('listening'), 'Missing listening questions');
assert(modes.has('shadowing'), 'Missing shadowing questions');
console.log(`✓ [Data] Question dataset contains ${questionsJson.questions.length} questions across ${modes.size} modes: ${Array.from(modes).join(', ')}.`);

console.log('\n🎉 ALL AUTOMATED SELF-CHECKS PASSED SUCCESSFULLY!');
