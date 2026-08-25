const fs = require('fs');
const path = require('path');

const extractDir = 'd:/self/scratch_docx_11th';
const xmlPath = path.join(extractDir, 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

const paragraphs = [];
// Match <w:p>...</w:p>
const pRegex = /<w:p(?:\s[^>]*)?>(.*?)<\/w:p>/g;
let pMatch;

while ((pMatch = pRegex.exec(xml)) !== null) {
  const pContent = pMatch[1];
  
  // Extract text from <w:t> inside this paragraph
  const tRegex = /<w:t(?:\s[^>]*)?>(.*?)<\/w:t>/g;
  let tMatch;
  const pTextParts = [];
  while ((tMatch = tRegex.exec(pContent)) !== null) {
    pTextParts.push(tMatch[1]);
  }
  
  const line = pTextParts.join('').trim();
  if (line) {
    paragraphs.push(line);
  }
}

const fullTextWithNewlines = paragraphs.join('\n');
console.log('EXTRACTED PROPER PARAGRAPHS (First 1000 chars):');
console.log(fullTextWithNewlines.substring(0, 1000));
console.log('---');
console.log('Total characters:', fullTextWithNewlines.length);

fs.writeFileSync('d:/self/extracted_11th_study_newlines.txt', fullTextWithNewlines);
console.log('Saved to d:/self/extracted_11th_study_newlines.txt');
