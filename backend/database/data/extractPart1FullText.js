const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractPart1() {
  const dataBuffer = fs.readFileSync('d:/self/namma_kalvi_-_11th_wts_english_guide_2019.pdf');
  const uint8 = new Uint8Array(dataBuffer);
  const parser = new PDFParse(uint8);
  const textResult = await parser.getText();
  const fullText = textResult.text || textResult;
  console.log('Successfully extracted text! Length:', fullText.length);
  fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity-ide/brain/00320288-1044-4188-a920-25b6c3196cef/scratch/part1_extracted.txt', String(fullText));
  console.log('Saved extracted text to scratch/part1_extracted.txt');
}

extractPart1().catch(err => {
  console.error('Error during extraction:', err);
});
