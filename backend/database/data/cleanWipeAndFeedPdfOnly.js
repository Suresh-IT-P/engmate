/**
 * MASTER CLEAN WIPE AND SEED TRIGGER
 * Calls seedMasterPdfDataset to wipe SQLite and seed full 139-page +1 WTS PDF material
 */

const seedMasterPdfDataset = require('./seedMasterPdfDataset');

async function cleanWipeAndFeedPdfOnly() {
  await seedMasterPdfDataset();
}

if (require.main === module) {
  cleanWipeAndFeedPdfOnly()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = cleanWipeAndFeedPdfOnly;
