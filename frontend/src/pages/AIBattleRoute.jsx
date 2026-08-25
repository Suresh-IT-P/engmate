import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BattleTopicPicker from '../components/BattleTopicPicker';
import AIBattle from './AIBattle';

/** Topic selection for the solo duel, then the match itself. */
export default function AIBattleRoute() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);

  if (topic) {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setTopic(null)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full text-on-surface hover:bg-surface-variant transition-all font-bold text-sm"
          >
            <ArrowLeft size={16} /> Change Topic
          </button>
        </div>
        <AIBattle topic={topic} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 pb-nav animate-fade-in">
      <button
        onClick={() => navigate('/battle')}
        className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full text-on-surface hover:bg-surface-variant transition-all font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to Modes
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black font-display text-on-surface mb-2">Choose Your Topic</h1>
        <p className="text-on-surface-variant font-medium">Pick a topic to duel the Kavitha Bot on.</p>
        <p className="text-sm text-on-surface-variant font-tamil mt-1">
          விளையாட விரும்பும் தலைப்பைத் தேர்ந்தெடுக்கவும்.
        </p>
      </div>

      <BattleTopicPicker value={topic} onChange={setTopic} />
    </div>
  );
}
