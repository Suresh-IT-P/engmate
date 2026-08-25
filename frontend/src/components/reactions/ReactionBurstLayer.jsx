import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { makeBurst, makeSparkles, BURST_LIFETIME_MS, haptic, prefersReducedMotion } from './reactionKit';

/**
 * The full-screen layer every emoji burst is painted on.
 *
 * It sits above the app in a fixed, pointer-events-none overlay so a burst can
 * fly across the whole screen from wherever it was tapped, without any parent's
 * `overflow: hidden` clipping it — which is what happens if you animate the
 * emoji inside the message bubble that spawned it.
 */

/** Ceiling on simultaneously animating emoji, so a mashed button cannot
 *  drown the screen or the frame budget. */
const MAX_PARTICLES = 60;

const BurstContext = createContext(null);

export function useBurst() {
  const ctx = useContext(BurstContext);
  // Callers outside the provider (e.g. a component rendered in isolation)
  // should degrade to doing nothing rather than crashing.
  return ctx || { burst: () => {} };
}

export function ReactionBurstProvider({ children }) {
  const [particles, setParticles] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const timersRef = useRef([]);
  const calmRef = useRef(false);

  useEffect(() => {
    calmRef.current = prefersReducedMotion();
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onChange = (e) => { calmRef.current = e.matches; };
    mq?.addEventListener?.('change', onChange);
    return () => mq?.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  /**
   * Fire a burst.
   * @param {string} emoji
   * @param {object} opts { originX, originY, count, buzz }
   */
  const burst = useCallback((emoji, opts = {}) => {
    if (!emoji) return;
    const calm = calmRef.current;

    // Default the origin to just above the composer, which is where a reaction
    // reads as coming "from you" when no element position was passed.
    const originX = opts.originX ?? window.innerWidth / 2;
    const originY = opts.originY ?? window.innerHeight * 0.72;

    const next = makeBurst(emoji, { count: opts.count ?? 7, originX, originY, calm });
    const spark = makeSparkles({ originX, originY, calm });

    // Rapid tapping could otherwise queue hundreds of animating nodes.
    setParticles((prev) => [...prev, ...next].slice(-MAX_PARTICLES));
    if (spark.length) setSparkles((prev) => [...prev, ...spark]);

    if (opts.buzz !== false) haptic(calm ? 0 : 12);

    const ids = new Set(next.map((p) => p.id));
    const sids = new Set(spark.map((p) => p.id));
    const t = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      setSparkles((prev) => prev.filter((p) => !sids.has(p.id)));
    }, BURST_LIFETIME_MS);
    timersRef.current.push(t);
  }, []);

  return (
    <BurstContext.Provider value={{ burst }}>
      {children}

      <div
        className="pointer-events-none fixed inset-0 z-[85] overflow-hidden"
        aria-hidden="true"
      >
        {sparkles.map((p) => (
          <span
            key={p.id}
            className="absolute animate-reaction-sparkle select-none"
            style={{ left: p.originX, top: p.originY, ...p.style }}
          >
            ✨
          </span>
        ))}

        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute animate-reaction-float select-none drop-shadow-lg will-change-transform"
            style={{ left: p.originX, top: p.originY, ...p.style }}
          >
            {p.emoji}
          </span>
        ))}
      </div>
    </BurstContext.Provider>
  );
}
