const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

/**
 * Reference rows that everything else has a foreign key to.
 *
 * These MUST exist before any content seeding or user registration. They did
 * not: the boot path only ran `seedMasterPdfDataset`, which inserts courses
 * with `level_id = 'B1'` and profiles default to `current_level = 'A1'`, but
 * nothing ever populated `learning_levels`. On a fresh database that produced
 *
 *   Cannot add or update a child row: a foreign key constraint fails
 *   (`user_profiles`, CONSTRAINT `user_profiles_ibfk_2`
 *    FOREIGN KEY (`current_level`) REFERENCES `learning_levels` (`id`))
 *
 * on every attempt to register, and the same class of failure on content
 * seeding. `seedCourses` did seed levels, but it only runs under
 * `npm run db:seed`, which is not part of a deploy.
 *
 * Idempotent and cheap, so it runs on every boot rather than behind a flag —
 * a deploy against a wiped or half-seeded database self-heals.
 */

const readJson = (name) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/', name), 'utf8'));

/**
 * The six CEFR levels. Falls back to a built-in list if levels.json is
 * missing, because an empty learning_levels table breaks registration and
 * that is too important to depend on a file being present.
 */
function levelRows() {
  try {
    const rows = readJson('levels.json');
    if (Array.isArray(rows) && rows.length) return rows;
  } catch (_) {
    /* fall through to the built-in list */
  }
  return [
    { id: 'A1', name: 'Beginner', title: 'A1 — Beginner Foundation', description: 'Essential words and simple sentences.', order_index: 1, min_xp: 0, badge_icon: 'eco' },
    { id: 'A2', name: 'Elementary', title: 'A2 — Elementary', description: 'Everyday phrases and routine exchanges.', order_index: 2, min_xp: 500, badge_icon: 'potted_plant' },
    { id: 'B1', name: 'Intermediate', title: 'B1 — Intermediate', description: 'Clear speech on familiar matters.', order_index: 3, min_xp: 1500, badge_icon: 'psychiatry' },
    { id: 'B2', name: 'Upper Intermediate', title: 'B2 — Upper Intermediate', description: 'Fluent, spontaneous conversation.', order_index: 4, min_xp: 3000, badge_icon: 'forest' },
    { id: 'C1', name: 'Advanced', title: 'C1 — Advanced', description: 'Flexible, effective language use.', order_index: 5, min_xp: 5000, badge_icon: 'workspace_premium' },
    { id: 'C2', name: 'Proficient', title: 'C2 — Proficient', description: 'Near-native mastery.', order_index: 6, min_xp: 8000, badge_icon: 'military_tech' }
  ];
}

function categoryRows() {
  try {
    const rows = readJson('categories.json');
    if (Array.isArray(rows) && rows.length) return rows;
  } catch (_) {
    /* categories are not FK-critical for registration */
  }
  return [];
}

async function seedFoundations() {
  let levels = 0;
  let categories = 0;

  for (const lvl of levelRows()) {
    // INSERT ... ON DUPLICATE KEY UPDATE, so a re-run repairs a partially
    // seeded table instead of skipping it.
    await db.execute(
      `INSERT INTO learning_levels (id, name, title, description, order_index, min_xp, badge_icon)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), title = VALUES(title), description = VALUES(description),
         order_index = VALUES(order_index), min_xp = VALUES(min_xp), badge_icon = VALUES(badge_icon)`,
      [lvl.id, lvl.name, lvl.title, lvl.description || '', lvl.order_index || 1, lvl.min_xp || 0, lvl.badge_icon || 'workspace_premium']
    );
    levels++;
  }

  for (const cat of categoryRows()) {
    await db.execute(
      `INSERT INTO content_categories (id, name, tamil_name, description, icon, color_code, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), tamil_name = VALUES(tamil_name), description = VALUES(description),
         icon = VALUES(icon), color_code = VALUES(color_code), order_index = VALUES(order_index)`,
      [cat.id, cat.name, cat.tamil_name || cat.name, cat.description || '', cat.icon || 'category', cat.color_code || '#3525cd', cat.order_index || 1]
    );
    categories++;
  }

  return { levels, categories };
}

/**
 * Repair accounts left half-created by the bug above.
 *
 * Registration was not transactional: the `users` row was inserted first, then
 * the profile insert hit the foreign key and threw. The user row survived, so
 * the phone number was taken by an account that could never be logged into —
 * and retrying returned "an account with this phone number already exists".
 *
 * Rather than delete those rows (they may be someone's intended account), give
 * them the profile, settings and streak the failed registration owed them.
 */
async function repairOrphanedUsers() {
  const orphans = await db.query(
    `SELECT u.id, u.email, u.username, u.phone_number
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE p.user_id IS NULL`
  );

  for (const u of orphans) {
    const name = u.username || (u.phone_number ? `Learner ${String(u.phone_number).slice(-4)}` : 'Learner');
    await db.execute(
      `INSERT INTO user_profiles (user_id, full_name, username, phone_number, native_language, target_level, current_level, xp, coins, daily_goal_minutes, primary_goal)
       VALUES (?, ?, ?, ?, 'Tamil', 'B1', 'A1', 50, 100, 20, 'Daily conversation')`,
      [u.id, name, u.username, u.phone_number]
    );
    await db.execute(
      `INSERT INTO user_settings (user_id, theme, sound_effects, tamil_translation_enabled, voice_speed)
       VALUES (?, 'light', 1, 1, 1.0)
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [u.id]
    );
    await db.execute(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date)
       VALUES (?, 1, 1, CURDATE())`,
      [u.id]
    ).catch(() => { /* a streak row may already exist */ });
  }

  return orphans.length;
}

module.exports = { seedFoundations, repairOrphanedUsers };

if (require.main === module) {
  (async () => {
    await db.initMySQL();
    const counts = await seedFoundations();
    const repaired = await repairOrphanedUsers();
    console.log(`✓ levels: ${counts.levels}, categories: ${counts.categories}, repaired users: ${repaired}`);
    process.exit(0);
  })().catch((err) => {
    console.error('❌ seedFoundations failed:', err.message);
    process.exit(1);
  });
}
