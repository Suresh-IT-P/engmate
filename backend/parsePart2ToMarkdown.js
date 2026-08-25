const fs = require('fs');

function isBamini(line) {
  const gibberishMatches = line.match(/[f;\[\]\{\}]+|thf;fpak|Nfl;bUe|tpdh|gpd;du/g);
  if (gibberishMatches && gibberishMatches.length > 1) return true;
  if (line.match(/^[a-z;,\s]+$/) && !line.match(/\b(the|is|and|to|in|of|for|a|with|it|as|by|on|or)\b/i)) {
    return true;
  }
  return false;
}

const rawText = fs.readFileSync(__dirname + '/database/data/part2_clean.txt', 'utf8');
const lines = rawText.split('\n');

let poemSection = "## 📖 21-26. Poem Appreciation Questions\n\n";
let grammarSection = "## ✍️ 27-30. Grammar Sections\n\n";

let currentMode = 'poem';
let grammarTableOpen = false;
let isAnswerMode = false;
let currentPoemNum = 1;

let pendingQuestions = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();
  if (!line) continue;
  
  if (line.includes('27. Reporting a dialogue')) currentMode = 'grammar';
  
  if (isBamini(line)) continue;
  line = line.replace(/\s*/, '🔹 ').replace(/||/, '🔸');
  
  if (currentMode === 'poem') {
    let matchPoem = line.match(/^Poem – (\d)/i);
    if(matchPoem) {
      currentPoemNum = parseInt(matchPoem[1]);
      poemSection += "\n### 📝 " + line + "\n\n";
    } else if (line.match(/FIGURES OF SPEECH/i)) {
       poemSection += "\n### 🔍 Figures of Speech Summary\n\n";
    } else if (line.match(/^No\s+Poetic Line/i)) {
       poemSection += "| No | Poetic Line | Figure of Speech |\n|---|---|---|\n";
    } else if (line.match(/^\d+\s+.*?(Simile|Metaphor|Personification|Alliteration|Aphorism|Interrogation|Rhetorical|Onomatopoeia|Sarcasm|Repetition|Oxymoron)/i)) {
       let m = line.match(/^(\d+)\s+(.*?)\s+(Simile|Metaphor|Personification|Alliteration|Aphorism|Interrogation|Rhetorical.*?|Onomatopoeia|Sarcasm|Repetition|Oxymoron)$/i);
       if (m) poemSection += `| ${m[1]} | ${m[2]} | ${m[3]} |\n`;
       else {
         const parts = line.split(/\t| {2,}/);
         if (parts.length >= 2) poemSection += `| ${parts.join(' | ')} |\n`;
         else poemSection += `| - | ${line} | - |\n`;
       }
    } else if (line.match(/^Stanza No/)) {
       poemSection += "| Stanza No | Rhyming Scheme | Rhyming words |\n|---|---|---|\n";
    } else if (line.match(/^Stanza \d/)) {
       const parts = line.split(/\t| {2,}/);
       if (parts.length >= 2) poemSection += `| ${parts.join(' | ')} |\n`;
       else poemSection += `| ${line} | - | - |\n`;
    } else {
       let isQuote = false;
       let isQuestion = false;
       
       if (currentPoemNum === 1) {
         if (line.match(/^[ivx]+\.\s*[‘'“"]/i)) isQuote = true;
         if (line.match(/^[a-e]\)/i)) isQuestion = true;
       } else if (currentPoemNum === 2) {
         if (line.match(/^[a-d]\)/i)) isQuote = true;
         if (line.match(/^\d\./)) isQuestion = true;
         if (line.match(/Identify and explain/)) isQuestion = true;
       } else if (currentPoemNum === 3) {
         if (line.match(/^\([ivx]+\)\s*/i)) isQuote = true;
         if (line.match(/^[a-e]\)/i)) isQuestion = true;
       } else if (currentPoemNum === 4) {
         if (line.match(/^[ivx]+\.\s*/i)) isQuote = true;
         if (line.match(/^[a-e]\)/i)) isQuestion = true;
       } else if (currentPoemNum === 5) {
         if (line.match(/^\d\.\s*/i)) isQuote = true;
         if (line.match(/^[ivx]+\.\s*/i)) isQuestion = true;
       } else if (currentPoemNum === 6) {
         if (line.match(/^[ivx]+\)\s*/i)) isQuote = true;
         if (line.match(/^[a-e]\)/i)) isQuestion = true;
       }

       if (isQuote) {
         poemSection += "\n> **" + line + "**\n";
       } else if (isQuestion) {
         poemSection += "\n**Q:** " + line + "  \n";
       } else if (line.length > 0 && !line.includes('L.No') && !line.includes('www.') && !line.includes('Poems and their')) {
         poemSection += "**A:** *" + line + "*\n";
       }
    }
  } else {
    // Grammar mode
    if (line.match(/^\d+\.\s+.*?Speech:/) || line.match(/^\d+\.\s+.*?Voice:/) || line.match(/^\d+\.\s+.*?Clause:/) || line.match(/^\d+\.\s+.*?Sentences:/) || line.match(/^\d+\.\s+.*?Sentences/)) {
       grammarSection += "\n### " + line + "\n\n";
       grammarTableOpen = false;
       isAnswerMode = false;
       
       if (pendingQuestions.length > 0) {
           for (let q of pendingQuestions) {
               grammarSection += `| ${q} | (Answer missing in PDF) |\n`;
           }
           pendingQuestions = [];
       }
       
    } else if (line.includes('Change into other speech') || 
               line.includes('Change into passive voice') || 
               line.includes('Change into Active voice') || 
               line.includes('Make sentences using the passive forms') || 
               line.includes('Combine the following') || 
               line.includes('Rewrite the following') || 
               line.includes('Form a single sentence')) {
       
       if (pendingQuestions.length > 0) {
           for (let q of pendingQuestions) {
               grammarSection += `| ${q} | (Answer missing in PDF) |\n`;
           }
           pendingQuestions = [];
       }
               
       grammarSection += "\n**" + line + "**\n\n| Question | Answer |\n|---|---|\n";
       grammarTableOpen = true;
       isAnswerMode = false;
    } else if (grammarTableOpen) {
       if (line === 'Answer' || line.match(/^Answers?\b/)) {
           isAnswerMode = true;
       } else if (line.match(/^Practice Questions/)) {
           // Ignore
       } else if (line.match(/^\d+\./)) {
           if (!isAnswerMode) {
               pendingQuestions.push(line);
           } else {
               // We are in answer mode, pop a question and print the row!
               if (pendingQuestions.length > 0) {
                   const q = pendingQuestions.shift();
                   grammarSection += `| ${q} | ${line} |\n`;
               } else {
                   // Fallback
                   grammarSection += `| - | ${line} |\n`;
               }
           }
       } else if (line.match(/^[A-Z]/)) {
           // Not starting with a number.
           if (!isAnswerMode) {
               if (pendingQuestions.length > 0) pendingQuestions[pendingQuestions.length - 1] += " " + line;
               else pendingQuestions.push(line);
           } else {
               // If there's an answer that spans multiple lines
               grammarSection += `(cont.) ${line} |\n`;
           }
       }
    } else {
       grammarSection += line + "\n";
    }
  }
}

if (pendingQuestions.length > 0) {
   for (let q of pendingQuestions) {
       grammarSection += `| ${q} | (Answer missing in PDF) |\n`;
   }
}

fs.writeFileSync(__dirname + '/database/data/part2_content.json', JSON.stringify({ poetry: poemSection, grammar: grammarSection }));
console.log('Successfully generated completely exhaustive Markdown JSON.');
