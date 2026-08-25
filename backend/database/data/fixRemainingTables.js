const fs = require('fs');

const inputFile = 'd:/self/backend/database/data/seedExhaustiveBeautifulPart1.js';
let content = fs.readFileSync(inputFile, 'utf-8');

// 1. Idioms to Table
content = content.replace(/#### Book Back Idioms & Meanings \(19\):\n((?:\d{2}\. \*\*.*?\n)+)/, (match, wordsList) => {
  let table = `#### Book Back Idioms & Meanings (19)\n\n| # | Idiom | Meaning |\n| :---: | :--- | :--- |\n`;
  const lines = wordsList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    // 01. **throw in the towel**: to give up
    const m = l.match(/^(\d{2})\. \*\*(.*?)\*\*: (.*)/);
    if (m) {
      table += `| **${m[1]}** | **${m[2]}** | ${m[3]} |\n`;
    } else {
      table += l + '\n';
    }
  });
  return table;
});

// 2. Foreign Words to Table
content = content.replace(/#### Book Back Foreign Words \(24\):\n((?:\d+\. \*\*.*?\n)+)/, (match, wordsList) => {
  let table = `#### Book Back Foreign Words (24)\n\n| # | Foreign Word / Phrase | Meaning |\n| :---: | :--- | :--- |\n`;
  const lines = wordsList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    // 1. **viva voce**: a spoken examination
    const m = l.match(/^(\d+)\. \*\*(.*?)\*\*: (.*)/);
    if (m) {
      table += `| **${m[1].padStart(2, '0')}** | **${m[2]}** | ${m[3]} |\n`;
    } else {
      table += l + '\n';
    }
  });
  return table;
});

// 3. Euphemisms to Table
content = content.replace(/- \*\*blind\*\*: visually challenged \|(.*?)\n/, (match) => {
  let text = match.trim();
  let table = `| Direct / Taboo Word | Polite Euphemism |\n| :--- | :--- |\n`;
  text = text.substring(2); // remove "- "
  const items = text.split(' | ');
  items.forEach(item => {
    const m = item.match(/\*\*(.*?)\*\*: (.*)/);
    if (m) {
      table += `| **${m[1].trim()}** | ${m[2].replace('.', '').trim()} |\n`;
    }
  });
  return table + '\n';
});

fs.writeFileSync(inputFile, content);
console.log('Fixed the rest of the tables!');
