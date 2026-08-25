import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Users } from 'lucide-react';

/**
 * Entry screen for the Live Grammar Battle. Each mode is a real route, so a
 * room can be linked to and the browser's back button behaves sensibly.
 */
export default function LiveGrammarBattle() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12 pb-nav min-h-[70vh] flex flex-col justify-center animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-on-surface mb-4">Choose Your Battle Mode</h1>
        <p className="text-lg text-on-surface-variant font-medium">Test your grammar skills against an AI bot or challenge your friends!</p>
        <p className="text-sm text-on-surface-variant font-tamil mt-1">
          உங்கள் இலக்கண திறனை சோதிக்க ஒரு முறையைத் தேர்ந்தெடுக்கவும்.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto w-full">
        <button
          onClick={() => navigate('/battle/ai')}
          className="group relative overflow-hidden bg-surface rounded-3xl p-5 sm:p-8 border-2 border-surface-variant hover:border-primary transition-all text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 p-5 sm:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Bot size={120} />
          </div>
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Play with AI</h2>
          <p className="text-on-surface-variant font-medium text-sm">A fast-paced 1v1 duel against our intelligent Kavitha Bot. Quick matches, immediate results.</p>
        </button>

        <button
          onClick={() => navigate('/battle/room')}
          className="group relative overflow-hidden bg-surface rounded-3xl p-5 sm:p-8 border-2 border-surface-variant hover:border-emerald-500 transition-all text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 p-5 sm:p-8 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-500">
            <Users size={120} />
          </div>
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Play with Friends</h2>
          <p className="text-on-surface-variant font-medium text-sm">Create a room, set your own timer, share the link, and battle with live chat and emotes.</p>
        </button>
      </div>
    </div>
  );
}
