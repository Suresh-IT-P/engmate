const fs = require('fs');

const rawText = fs.readFileSync('d:/self/namma_kalvi_-_11th_wts_english_guide_2019.md', 'utf8');
const lines = rawText.split('\n');

const START_LINE = 4417;
const END_LINE = 7037;

let lesson_poem_erc = "## 📖 31-33. Poem ERC (Explain with Reference to Context)\n\n";
let lesson_prose_short = "## 📝 34-36. Prose Short Answers\n\n";
let lesson_grammar_3m = "## ✍️ 37-40. 3-Mark Grammar & Testing Topics\n\n";

let currentSection = 'poem_erc';
let inPictureBlock = false;
let isGrammarTable = false;

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
  if (cleaned.includes('34 36') && cleaned.includes('Prose') && cleaned.includes('Short')) {
    currentSection = 'prose_short';
    continue;
  }
  if (cleaned.includes('37 40') && cleaned.includes('Dialogue')) {
    currentSection = 'grammar_3m';
  }
  
  if (currentSection === 'poem_erc') {
    if (cleaned.match(/^Poem – /)) {
      lesson_poem_erc += `\n### 📜 ${cleaned}\n\n`;
    } else if (cleaned.match(/^[ivx]+\.\s+/i) || cleaned.match(/^[a-z]\)\s+/i)) {
      lesson_poem_erc += `\n> **${cleaned}**\n`;
    } else if (cleaned.startsWith('Context :') || cleaned.startsWith('Context:')) {
      lesson_poem_erc += `\n**Q:** Context\n**A:** *${cleaned.replace(/Context\s*:/, '').trim()}*\n`;
    } else if (cleaned.startsWith('Explanation :') || cleaned.startsWith('Explanation:')) {
      lesson_poem_erc += `**Q:** Explanation\n**A:** *${cleaned.replace(/Explanation\s*:/, '').trim()}*\n`;
    } else if (cleaned.startsWith('Comment :') || cleaned.startsWith('Comment:')) {
      lesson_poem_erc += `**Q:** Comment\n**A:** *${cleaned.replace(/Comment\s*:/, '').trim()}*\n`;
    }
  } 
  else if (currentSection === 'prose_short') {
    if (cleaned.match(/^Prose – /)) {
      lesson_prose_short += `\n### 📚 ${cleaned}\n\n`;
    } else if (cleaned.match(/^\d+\.\s+/)) {
      lesson_prose_short += `\n**Q:** ${cleaned}\n`;
    } else if (cleaned.length > 5 && !cleaned.match(/^\(TB /)) {
      lesson_prose_short += `**A:** *${cleaned}*\n`;
    }
  }
  else if (currentSection === 'grammar_3m') {
    if (cleaned.match(/^[A-Z]\.\s+/) || cleaned.match(/^\d+\.\s+/) || cleaned.includes('37 40')) {
      if (cleaned.includes('Spot the error') || cleaned.includes('Fill in the blanks') || cleaned.includes('Rearrange')) {
        isGrammarTable = true;
        lesson_grammar_3m += `\n### 🧩 ${cleaned}\n\n`;
      } else {
        isGrammarTable = false;
        if (cleaned.includes('37 40')) {
          lesson_grammar_3m += `\n### 💬 ${cleaned}\n\n`;
        } else {
          lesson_grammar_3m += `\n**Q:** ${cleaned}\n`;
        }
      }
    } else if (cleaned.match(/^Answer/i) || cleaned.match(/^Ans:/i)) {
      if (isGrammarTable) {
        // Just text output
        lesson_grammar_3m += `**A:** *${cleaned.replace(/^Answers?\s*:?/i, '').trim()}*\n`;
      } else {
        lesson_grammar_3m += `**A:** *${cleaned.replace(/^Answers?\s*:?/i, '').trim()}*\n`;
      }
    } else {
      if (cleaned.match(/^\(TB /) || cleaned.match(/^Tips:/)) continue; // skip tips and TB
      if (isGrammarTable) {
         if (cleaned.match(/^[a-z]\)/i) || cleaned.match(/^\d+\)/i)) {
            // It's a blank or error spotting item
            lesson_grammar_3m += `\n**Q:** ${cleaned}\n`;
         } else if (lesson_grammar_3m.endsWith('\n\n')) {
            // It's the answer immediately following
            lesson_grammar_3m += `**A:** *${cleaned}*\n`;
         } else {
            lesson_grammar_3m += `**A:** *${cleaned}*\n`;
         }
      } else {
         if (lesson_grammar_3m.endsWith('\n') && !lesson_grammar_3m.endsWith('\n\n')) {
            lesson_grammar_3m += `**A:** *${cleaned}*\n`;
         } else {
            lesson_grammar_3m += `${cleaned}\n\n`;
         }
      }
    }
  }
}

fs.writeFileSync(__dirname + '/database/data/part3_content.json', JSON.stringify({ 
  lesson_poem_erc, 
  lesson_prose_short, 
  lesson_grammar_3m 
}));

console.log('Successfully generated Part 3 JSON with fixed section matches.');
