import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../services/api';

/** Keeps the picker usable if the battle bank has not been seeded yet. */
const FALLBACK_TOPICS = [
  { id: 'mixed', title: 'Mixed Challenge', tamil_title: 'கலப்பு சவால்', icon: 'shuffle', question_count: 0 }
];

/**
 * Grid of battle topics. `value` is the selected topic object (or null) and
 * `onChange` receives the newly picked topic.
 */
export default function BattleTopicPicker({ value, onChange, compact = false }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.getBattleTopics();
        if (active) setTopics(res?.data?.length ? res.data : FALLBACK_TOPICS);
      } catch {
        if (active) setTopics(FALLBACK_TOPICS);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Default to the first topic so a room can always be created in one click.
  useEffect(() => {
    if (!value && topics.length && compact) onChange(topics[0]);
  }, [topics, value, compact, onChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-on-surface-variant">
        <Loader2 className="animate-spin" size={20} /> Loading topics…
      </div>
    );
  }

  return (
    <div className={`grid gap-2.5 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}>
      {topics.map((t) => {
        const selected = value?.id === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t)}
            className={`group text-left rounded-2xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg ${compact ? 'p-3' : 'p-4'} ${
              selected
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                : t.id === 'mixed'
                  ? 'bg-primary/10 border-primary/40 hover:border-primary'
                  : 'bg-surface border-surface-variant hover:border-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] mb-1 block ${selected ? 'text-white' : 'text-primary'}`}>
              {t.icon || 'quiz'}
            </span>
            <span className={`block font-bold text-sm leading-tight ${selected ? 'text-white' : 'text-on-surface'}`}>
              {t.title}
            </span>
            {t.tamil_title && !compact && (
              <span className={`block text-[11px] font-tamil mt-0.5 leading-tight ${selected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                {t.tamil_title}
              </span>
            )}
            <span className={`block text-[11px] font-semibold mt-2 ${selected ? 'text-white/80' : 'text-on-surface-variant'}`}>
              {Number(t.question_count || 0).toLocaleString()} questions
            </span>
          </button>
        );
      })}
    </div>
  );
}
