const fs = require('fs');

const inputFile = 'd:/self/backend/database/data/seedExhaustiveExtractedPart1.js';
let content = fs.readFileSync(inputFile, 'utf-8');

// 1. Convert Synonyms Glossaries to Tables
const proseRegex = /#### Prose (\d): (.*?)\n((?:- \*\*.*?\n)+)/g;
content = content.replace(proseRegex, (match, p1, p2, wordsList) => {
  let table = `#### Prose ${p1}: ${p2}\n\n| English Word | English Meaning | தமிழ் விளக்கம் |\n| :--- | :--- | :--- |\n`;
  const lines = wordsList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    const m = l.match(/- \*\*(.*?)\*\*: (.*?) \((.*?)\)/);
    if (m) {
      table += `| **${m[1].trim()}** | ${m[2].trim()} | ${m[3].trim()} |\n`;
    } else {
      table += l + '\n';
    }
  });
  return table;
});

// 2. Convert Practice Questions to Numbered cards
// For 20 Practice Questions (with Answers):
content = content.replace(/##### 20 Practice Questions \(with Answers\):\n((?:\d{2}\. .*?\n)+)/g, (match, qList) => {
  let res = '##### ✏️ 20 Practice Questions (with Answers):\n';
  const lines = qList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    const m = l.match(/^(\d{2})\. (.*?): (.*)/);
    if (m) {
      res += `${m[1]}. ${m[2]}\n   > 💡 **Answer**: ${m[3]}\n\n`;
    } else {
      res += l + '\n';
    }
  });
  return res;
});

// 3. Convert Antonyms to Tables
content = content.replace(/#### Prose 1 to 6 Antonyms Table:\n((?:- \*\*.*?\n)+)/, (match, wordsList) => {
  let table = `#### 🔄 Prose 1 to 6 Antonyms Master Table\n\n| English Word | தமிழ் விளக்கம் | Antonym / Opposite | தமிழ் எதிர்ச்சொல் |\n| :--- | :--- | :--- | :--- |\n`;
  const lines = wordsList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    // format: - **wrinkled** (சுருக்கம் விழுந்த) X **smooth, unwrinkled** (மென்மையான)
    // or: - **amateur** X **professional**
    const m = l.match(/- \*\*(.*?)\*\*(?: \((.*?)\))? X \*\*(.*?)\*\*(?: \((.*?)\))?/);
    if (m) {
      table += `| **${m[1] || ''}** | ${m[2] || '-'} | **${m[3] || ''}** | ${m[4] || '-'} |\n`;
    } else {
      table += l + '\n';
    }
  });
  return table;
});

// 4. Prefix/Suffix table
content = content.replace(/##### 10 Practice Questions \(with Answers\):\n((?:\d{2}\. .*?\n)+)/g, (match, qList) => {
  let res = '##### ✏️ 10 Practice Questions (with Answers):\n';
  const lines = qList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    const m = l.match(/^(\d{2})\. (.*?): (.*)/);
    if (m) {
      res += `${m[1]}. ${m[2]}\n   > 💡 **Answer**: ${m[3]}\n\n`;
    } else {
      res += l + '\n';
    }
  });
  return res;
});

// 5. Abbreviations Table
content = content.replace(/#### Book Back Abbreviations \(28\):\n((?:\d+\. \*\*.*?\n)+)/, (match, wordsList) => {
  let table = `#### Book Back Abbreviations (28)\n\n| # | Abbreviation | Full Form Expansion |\n| :---: | :--- | :--- |\n`;
  const lines = wordsList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    // 1. **RSC**: Referee Stopped Contest
    const m = l.match(/^(\d+)\. \*\*(.*?)\*\*: (.*)/);
    if (m) {
      table += `| **${m[1].padStart(2, '0')}** | **${m[2]}** | ${m[3]} |\n`;
    } else {
      table += l + '\n';
    }
  });
  return table;
});

// 6. Clipped Words
content = content.replace(/##### 18 Practice Exercises \(with Answers\):\n((?:\d{2}\. .*?\n)+)/, (match, wordsList) => {
  let table = `#### ✂️ 18 Clipped Words Practice\n\n| # | Original Word | Clipped Form |\n| :---: | :--- | :--- |\n`;
  const lines = wordsList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    // 01. **Chimpanzee** -> **chimp**
    const m = l.match(/^(\d{2})\. \*\*(.*?)\*\* -> \*\*(.*?)\*\*/);
    if (m) {
      table += `| **${m[1]}** | **${m[2]}** | **${m[3]}** |\n`;
    } else {
      table += l + '\n';
    }
  });
  return table;
});

// 7. Definitions
content = content.replace(/#### Book Back 22 Words & Meanings:\n((?:\d+\. \*\*.*?\n)+)/, (match, wordsList) => {
  let table = `#### Book Back 22 Words & Meanings\n\n| # | Word | Definition |\n| :---: | :--- | :--- |\n`;
  const lines = wordsList.split('\n').filter(l => l.trim() !== '');
  lines.forEach(l => {
    // 1. **patriotism**: love of country...
    const m = l.match(/^(\d+)\. \*\*(.*?)\*\*: (.*)/);
    if (m) {
      table += `| **${m[1].padStart(2, '0')}** | **${m[2]}** | ${m[3]} |\n`;
    } else {
      table += l + '\n';
    }
  });
  return table;
});

content = content.replace(/##### Govt Exam Questions \(MDL-18\):\n((?:\d\. .*?\n(?:   - .*?\n)+)+)/g, (match, text) => {
  let res = '##### 🏛️ Government Exam Questions (MDL-18):\n';
  const questions = text.split(/(?=\d\. )/);
  questions.forEach(q => {
    if (!q.trim()) return;
    const lines = q.split('\n');
    res += `> **Question ${lines[0]}**\n`;
    res += `> ${lines[1].trim()}\n\n`;
  });
  return res;
});

content = content.replace(/seedExhaustiveExtractedPart1/g, 'seedExhaustiveBeautifulPart1');

fs.writeFileSync('d:/self/backend/database/data/seedExhaustiveBeautifulPart1.js', content);
console.log('Done converting to tables! Run seedExhaustiveBeautifulPart1.js');
