/**
 * Shared vocabulary and physics for emoji reactions.
 *
 * Every animated particle gets its own --dx/--dy/--s/--r1/--r2/--dur, so one
 * keyframe in tailwind.config.js produces a whole scatter of different arcs.
 * Without the per-particle randomisation a burst reads as a single column of
 * identical emoji, which is the thing that makes cheap reaction effects look
 * cheap.
 */

/** The set offered on a message. Kept to eight so the row fits one line. */
export const MESSAGE_REACTIONS = ['❤️', '😂', '😮', '🎉', '👏', '🔥', '💯', '😢'];

/** The wider palette for the picker sheet, grouped by mood. */
export const REACTION_GROUPS = [
  { label: 'Reactions', tamil: 'எதிர்வினை', emojis: ['❤️', '😂', '😮', '🎉', '👏', '🔥', '💯', '😢', '🤯', '🙌', '😍', '🥳'] },
  { label: 'Encourage', tamil: 'ஊக்கம்', emojis: ['💪', '🌟', '🚀', '🏆', '✨', '🎯', '👍', '🤝', '🧠', '📚', '🥇', '⚡'] },
  { label: 'Playful', tamil: 'விளையாட்டு', emojis: ['😎', '🤣', '🙈', '😅', '🐐', '🤔', '💀', '🫶', '🌈', '🍀', '🎈', '🎊'] }
];

/** Deterministic-enough jitter without pulling in a PRNG. */
const rand = (min, max) => min + Math.random() * (max - min);

/**
 * Burst dimensions for the current screen. Ten 46px emoji is a celebration on
 * a laptop and a faceful on a 390px phone, so narrow screens get fewer,
 * smaller particles that travel less far.
 */
function viewportScale() {
  const w = typeof window === 'undefined' ? 1024 : window.innerWidth;
  if (w < 400) return { size: [18, 30], count: 0.6, spread: 0.62, rise: 0.72 };
  if (w < 640) return { size: [20, 34], count: 0.75, spread: 0.75, rise: 0.85 };
  return { size: [26, 46], count: 1, spread: 1, rise: 1 };
}

/**
 * Build one burst of particles for a tap.
 *
 * @param {string} emoji  the emoji to scatter
 * @param {object} opts
 * @param {number} opts.count      how many particles (2–14)
 * @param {number} opts.originX    viewport px the burst springs from
 * @param {number} opts.originY    viewport px the burst springs from
 * @param {boolean} opts.calm      reduced-motion: fewer, gentler particles
 */
export function makeBurst(emoji, { count = 7, originX = 0, originY = 0, calm = false } = {}) {
  const vp = viewportScale();
  const n = calm
    ? Math.min(3, count)
    : Math.max(2, Math.min(14, Math.round(count * vp.count)));
  const spread = (calm ? 40 : 120) * vp.spread;
  const rise = (calm ? 90 : 190) * vp.rise;
  const [minSize, maxSize] = calm ? [vp.size[0], vp.size[0] + 8] : vp.size;

  // Tapped near a screen edge, half a symmetric fan flies off-screen and the
  // rest piles up against the edge. Slide the fan toward the open side.
  const width = typeof window === 'undefined' ? 1024 : window.innerWidth;
  const margin = maxSize;
  let fanCenter = 0;
  if (originX - spread < margin) fanCenter = margin - (originX - spread);
  else if (originX + spread > width - margin) fanCenter = (width - margin) - (originX + spread);

  return Array.from({ length: n }, (_, i) => ({
    id: `${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
    emoji,
    originX,
    originY,
    style: {
      // Evenly spaced across the fan, then jittered. Purely random positions
      // let several particles land on the same spot and read as one blob.
      '--dx': `${fanCenter + spread * (((i + 0.5) / n) * 2 - 1) + rand(-spread / n, spread / n)}px`,
      '--dy': `${-rand(rise * 0.6, rise)}px`,
      '--s': rand(0.5, 0.95).toFixed(2),
      '--r1': `${rand(-28, -6)}deg`,
      '--r2': `${rand(6, 28)}deg`,
      '--dur': `${rand(calm ? 1.1 : 1.8, calm ? 1.4 : 2.8).toFixed(2)}s`,
      fontSize: `${rand(minSize, maxSize).toFixed(0)}px`,
      // Centre the glyph on the origin. left/top place its top-left corner,
      // which put every burst below and to the right of the finger.
      lineHeight: 1,
      marginLeft: '-0.5em',
      marginTop: '-0.5em',
      // Random, not by index: the fan is ordered left to right, so delays by
      // index would launch it as a sweep instead of a burst.
      animationDelay: `${rand(0, Math.min(360, n * 35)).toFixed(0)}ms`,
      // Base state, not decoration. A CSS animation outranks an inline style
      // while it runs, so the keyframes still control the fade — but if the
      // animation is missing (a stale dev server that never picked up the
      // Tailwind config), the particles stay invisible instead of piling up
      // as a heap of static emoji over the UI.
      opacity: 0
    }
  }));
}

/** A few small sparkles thrown off the same tap point. */
export function makeSparkles({ originX = 0, originY = 0, calm = false } = {}) {
  if (calm) return [];
  const vp = viewportScale();
  return Array.from({ length: window.innerWidth < 640 ? 4 : 6 }, (_, i) => ({
    id: `sp_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
    originX,
    originY,
    style: {
      '--dx': `${rand(-70, 70) * vp.spread}px`,
      '--dy': `${-rand(30, 110) * vp.rise}px`,
      '--dur': `${rand(0.9, 1.5).toFixed(2)}s`,
      fontSize: `${rand(9, 15).toFixed(0)}px`,
      lineHeight: 1,
      marginLeft: '-0.5em',
      marginTop: '-0.5em',
      animationDelay: `${(i * 40).toFixed(0)}ms`,
      opacity: 0
    }
  }));
}

/** The longest a particle can live, so cleanup timers never cut one short. */
export const BURST_LIFETIME_MS = 3600;

/** A short tap buzz on devices that support it. Silently ignored elsewhere. */
export function haptic(pattern = 12) {
  try {
    navigator.vibrate?.(pattern);
  } catch (_) {
    /* vibration is a nicety, never a requirement */
  }
}

/** Honour the OS "reduce motion" setting. */
export function prefersReducedMotion() {
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  } catch (_) {
    return false;
  }
}

/** Code points that can make up one emoji: the picture plus its joiners,
 *  variation selectors, skin tones and flag letters. */
const EMOJI_PARTS = /^(\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|‍|️|⃣)+$/u;
const HAS_PICTURE = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

/**
 * The emoji in a message made of nothing but a few emoji, or null.
 * Such a message is shown big, without a bubble, the way messengers do.
 */
export function emojiOnly(text, max = 3) {
  const compact = String(text || '').replace(/\s+/g, '');
  if (!compact) return null;
  // Graphemes, so a family or a flag counts as one emoji rather than several.
  const parts = typeof Intl !== 'undefined' && Intl.Segmenter
    ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(compact)].map((s) => s.segment)
    : Array.from(compact);
  if (parts.length > max) return null;
  return parts.every((p) => EMOJI_PARTS.test(p) && HAS_PICTURE.test(p)) ? parts : null;
}

/** Collapse a raw reaction list into [{ emoji, count, mine }] for rendering. */
export function summarise(reactions = [], meId) {
  const map = new Map();
  for (const r of reactions) {
    const entry = map.get(r.emoji) || { emoji: r.emoji, count: 0, mine: false };
    entry.count += 1;
    if (Number(r.user_id) === Number(meId)) entry.mine = true;
    map.set(r.emoji, entry);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}
