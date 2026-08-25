const fs = require('fs');
const path = require('path');

const inputPath = path.join('d:/self', 'extracted_11th_study_newlines.txt');
const lines = fs.readFileSync(inputPath, 'utf8').split('\n');

let paragraphs = '';
let writing = '';
let noteMaking = '';

let currentSection = 'paragraphs';
let inKeyWords = false;
let currentQuestion = '';

for (let i = 0; i < lines.length; i++) {
  const rawLine = lines[i];
  let line = rawLine.trim();
  if (!line) continue;

  // Section transitions
  if (line === 'Notice writing') {
    currentSection = 'writing';
    writing += '## ✍️ Notice, Email & Dialogue Writing\n\n';
    continue;
  }
  if (line === 'Note making') {
    currentSection = 'noteMaking';
    noteMaking += '## 🔍 Note Making & Comprehension\n\n';
    continue;
  }
  
  if (currentSection === 'paragraphs') {
    if (line === 'Poem') {
      paragraphs += '\n## 📝 Poem Paragraphs\n\n';
      continue;
    }
    
    // Title
    if (line.match(/^\d+\.\s/)) {
      paragraphs += `\n### ${line}\n\n`;
      inKeyWords = false;
      continue;
    }
    
    // Key words
    if (line.includes('📖 Key Words')) {
      inKeyWords = true;
      paragraphs += '\n#### 📖 Key Words\n| English | Tamil |\n|---|---|\n';
      continue;
    }
    
    if (inKeyWords) {
      if (line.includes('–')) {
        const [eng, tam] = line.split('–').map(s => s.trim());
        paragraphs += `| ${eng} | ${tam || ''} |\n`;
      } else {
        paragraphs += `| ${line} | |\n`;
      }
      continue;
    }
    
    // Standard headings like "Introduction", "Plan of the Paragraph"
    // Heuristics: If short line without periods, it's a heading
    if (line.length < 25 && !line.includes('.') && !line.includes(',') && !line.match(/^[a-z]/)) {
      paragraphs += `\n**${line}**\n`;
      continue;
    }
    
    // Standard sentence
    paragraphs += `${line}\n`;
  }
  
  else if (currentSection === 'writing' || currentSection === 'noteMaking') {
    // For sections with Question: / Answer:
    
    if (line.startsWith('Question:')) {
      const target = currentSection === 'writing' ? writing : noteMaking;
      if (currentSection === 'writing') {
        writing += `\n**Q:** ${line.replace('Question:', '').trim()}\n`;
      } else {
        noteMaking += `\n**Q:** ${line.replace('Question:', '').trim()}\n`;
      }
      continue;
    }
    
    if (line.startsWith('Answer:')) {
      if (currentSection === 'writing') {
        writing += `\n**A:** ${line.replace('Answer:', '').trim()}\n`;
      } else {
        noteMaking += `\n**A:** ${line.replace('Answer:', '').trim()}\n`;
      }
      continue;
    }
    
    if (line.match(/^Example \d+:/) || line.match(/^\d+\. Topic:/) || line.match(/^[a-zA-Z\s]+ writing$/i) || line === 'Proverbs' || line === 'Slogan writing' || line === 'News line' || line === 'Reading comprehension Exam Passage: The Life of Honeybees' || line === 'Questions and Answers' || line === 'Summarize content') {
      const formatted = `\n### ${line}\n\n`;
      if (currentSection === 'writing') {
        writing += formatted;
      } else {
        noteMaking += formatted;
      }
      continue;
    }
    
    if (line.includes('=')) {
      line = '---'; // Convert equals border to hr
    }
    
    if (currentSection === 'writing') {
      writing += `${line}\n`;
    } else {
      noteMaking += `${line}\n`;
    }
  }
}

const outputPath = path.join(__dirname, 'database', 'data', 'new_part4_content.json');
fs.writeFileSync(outputPath, JSON.stringify({
  lesson_paragraphs: paragraphs.trim(),
  lesson_writing: writing.trim(),
  lesson_note_making: noteMaking.trim()
}, null, 2));

console.log('Successfully generated new_part4_content.json');
