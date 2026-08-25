const fs = require('fs');

const rawText = fs.readFileSync('d:/self/namma_kalvi_-_11th_wts_english_guide_2019.md', 'utf8');
const lines = rawText.split('\n');

const START_LINE = 7037;
const END_LINE = lines.length;

let lesson_paragraphs = "## 📝 41-43. Paragraph Answers\n\n";
let lesson_note_making = "## 🔍 44-45. Note-Making & Comprehension\n\n";
let lesson_writing = "## ✍️ 46-47. Letter Writing & Dialogue Construction\n\n";

let currentSection = 'paragraphs';
let inPictureBlock = false;

function cleanHTML(str) {
  return str.replace(/<\/?mark>/g, '')
            .replace(/<\/?u>/g, '')
            .replace(/<\/?i>/g, '')
            .replace(/<\/?b>/g, '')
            .replace(/<\/?sup>/g, '')
            .replace(/<\/?sub>/g, '')
            .replace(/<br>/g, ' ')
            .replace(/_/g, '')
            .replace(/\*\*/g, '')
            .replace(/###### /g, '')
            .replace(/^[-\s\*]+/, '')
            .trim();
}

function isBamini(line) {
  const gibberishMatches = line.match(/[f;\[\]\{\}]+|thf;fpak|Nfl;bUe|tpdh|gpd;du/g);
  if (gibberishMatches && gibberishMatches.length > 1) return true;
  if (line.match(/^[a-z;,\s]+$/) && !line.match(/\b(the|is|and|to|in|of|for|a|with|it|as|by|on|or)\b/i)) {
    return true;
  }
  return false;
}

let inQuestion = false;

for (let i = START_LINE; i < END_LINE; i++) {
  let line = lines[i].trim();
  if (!line) continue;
  
  if (line.includes('<!-- Start of picture text -->')) {
    inPictureBlock = true;
    continue;
  }
  if (line.includes('<!-- End of picture text -->')) {
    inPictureBlock = false;
    continue;
  }
  
  if (inPictureBlock) continue;
  if (isBamini(line)) continue;
  
  // Ignore page headers/footers
  if (line.includes('wtsteam100@gmail.com') || line.includes('www.nammakalvi.org') || line.includes('Way to success')) continue;
  
  let cleaned = cleanHTML(line);
  if (!cleaned) continue;

  // Section transitions
  if (cleaned.includes('44') && (cleaned.includes('Summary') || cleaned.includes('Note'))) {
    currentSection = 'note_making';
    continue;
  }
  if (cleaned.includes('46') && cleaned.includes('Letter')) {
    currentSection = 'writing';
    continue;
  }

  // Common Question Matching
  let matchQuestion = cleaned.match(/^[a-eA-E]\)\s+/) || cleaned.match(/^\d+\.\s+/) || cleaned.match(/^Q\d*\.\s*/i) || cleaned.match(/^Question:\s*/i) || cleaned.match(/^Write a letter/i) || cleaned.match(/^Draft a/i);
  let isChapterHeader = cleaned.match(/^Prose – /) || cleaned.match(/^Poem – /) || cleaned.match(/^Supplementary – /);
  
  if (currentSection === 'paragraphs') {
    if (isChapterHeader) {
      lesson_paragraphs += `\n### 📚 ${cleaned}\n\n`;
      inQuestion = false;
    } else if (cleaned.includes('Paragraph questions from prose') || cleaned.includes('Paragraph questions from poetry') || cleaned.includes('Paragraph questions from Supplementary')) {
      lesson_paragraphs += `\n### 📖 ${cleaned}\n\n`;
      inQuestion = false;
    } else if (matchQuestion) {
      lesson_paragraphs += `\n**Q:** ${cleaned}\n`;
      inQuestion = true;
    } else if (cleaned.match(/^[A-Z\s]+$/) && cleaned.length > 5 && cleaned.length < 50) {
       // Probably a sub-title like "Introduction"
       lesson_paragraphs += `\n**A:** *${cleaned}*\n`;
    } else if (inQuestion && cleaned.length > 0) {
      if (lesson_paragraphs.endsWith('\n') && !lesson_paragraphs.endsWith('\n\n')) {
         lesson_paragraphs += `**A:** *${cleaned}*\n`;
      } else {
         lesson_paragraphs += `${cleaned}\n\n`;
      }
    }
  } 
  else if (currentSection === 'note_making') {
    if (cleaned.includes('45. Prose comprehension')) {
      lesson_note_making += `\n### 📝 ${cleaned}\n\n`;
    } else if (matchQuestion) {
      lesson_note_making += `\n**Q:** ${cleaned}\n`;
      inQuestion = true;
    } else if (cleaned.match(/^Answer/i) || cleaned.match(/^Ans:/i)) {
      lesson_note_making += `**A:** *${cleaned.replace(/^Answers?\s*:?/i, '').trim()}*\n`;
      inQuestion = false;
    } else if (inQuestion) {
       lesson_note_making += `**A:** *${cleaned}*\n`;
    } else {
       // It's probably the reading comprehension paragraph
       lesson_note_making += `\n> ${cleaned}\n`;
    }
  }
  else if (currentSection === 'writing') {
    if (cleaned.match(/^Answer/i) || cleaned.match(/^Ans:/i)) {
      lesson_writing += `**A:** *${cleaned.replace(/^Answers?\s*:?/i, '').trim()}*\n`;
      inQuestion = false;
    } else if (matchQuestion) {
      lesson_writing += `\n**Q:** ${cleaned}\n`;
      inQuestion = true;
    } else if (inQuestion) {
       if (lesson_writing.endsWith('\n') && !lesson_writing.endsWith('\n\n')) {
         lesson_writing += `**A:** *${cleaned}*\n`;
       } else {
         lesson_writing += `${cleaned}\n\n`;
       }
    } else {
       // Context / Hints
       lesson_writing += `> ${cleaned}\n`;
    }
  }
}

fs.writeFileSync(__dirname + '/database/data/part4_content.json', JSON.stringify({ 
  lesson_paragraphs, 
  lesson_note_making, 
  lesson_writing 
}));

console.log('Successfully generated Part 4 JSON.');
