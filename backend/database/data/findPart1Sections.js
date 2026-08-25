const fs = require('fs');

const raw = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity-ide/brain/00320288-1044-4188-a920-25b6c3196cef/scratch/part1_extracted.txt', 'utf8');

console.log('--- SEARCHING FOR PART - I ---');
const part1Index = raw.indexOf('PART - I');
const part2Index = raw.indexOf('PART - II');

console.log('PART - I Index:', part1Index);
console.log('PART - II Index:', part2Index);

if (part1Index !== -1 && part2Index !== -1) {
  const part1Text = raw.substring(part1Index, part2Index);
  console.log('Part 1 Text Length:', part1Text.length);
  fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity-ide/brain/00320288-1044-4188-a920-25b6c3196cef/scratch/part1_only.txt', part1Text);
  console.log('Saved Part 1 text to scratch/part1_only.txt!');
} else {
  console.log('Could not find exact PART - I / PART - II markers. Showing first 3000 chars:');
  console.log(raw.substring(0, 3000));
}
