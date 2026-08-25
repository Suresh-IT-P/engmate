const fs = require('fs');
const lines = fs.readFileSync('database/data/part2_clean.txt', 'utf8').split('\n');

const poems = [];
let currentPoem = null;
let currentLine = null;
let currentQuestion = null;

for (let i = 0; i < 285; i++) {
  let line = lines[i].trim();
  if (!line) continue;
  
  if (line.match(/^Poem – \d/i)) {
    currentPoem = { title: line, stanzas: [] };
    poems.push(currentPoem);
    continue;
  }
  
  if (!currentPoem) continue;
  
  // Stanza match
  if (line.match(/^[ivx]+\.\s*[‘'“"]/i) || line.match(/^[a-z]\)\s+[‘'“"]/i) || line.match(/^\([ivx]+\)\s+/i) || line.match(/^[ivx]+\./)) {
    currentLine = { quote: line, qna: [] };
    currentPoem.stanzas.push(currentLine);
    currentQuestion = null;
    continue;
  }
  
  // Question match: "a) Who are..." or "1. Whom does..."
  if (line.match(/^[a-e]\)/i) || line.match(/^\d\./)) {
    currentQuestion = { q: line, a: '' };
    if (currentLine) currentLine.qna.push(currentQuestion);
    continue;
  }
  
  // Answer match
  if (currentQuestion) {
    currentQuestion.a += (currentQuestion.a ? ' ' : '') + line;
    continue;
  }
  
  // Quote continuation
  if (currentLine && !currentQuestion) {
    currentLine.quote += '\n' + line;
  }
}

fs.writeFileSync('database/data/poems.json', JSON.stringify(poems, null, 2));
console.log('Saved to poems.json');
