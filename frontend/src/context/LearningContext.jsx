import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const LearningContext = createContext(null);

export function LearningProvider({ children }) {
  const [tamilEnabled, setTamilEnabled] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);

  const currentTextRef = useRef('');
  const sentencesRef = useRef([]);
  const sentenceIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const isPlayingRef = useRef(false);

  // Stop speech completely
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isPausedRef.current = false;
    isPlayingRef.current = false;
    sentenceIndexRef.current = 0;
    currentTextRef.current = '';
    sentencesRef.current = [];
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(0);
  };

  // Pause speech mid-sentence
  const pauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isPausedRef.current = true;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(true);
  };

  // Speak a specific sentence index in the sentence queue
  const playSentenceIndex = (index, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    if (index >= sentencesRef.current.length) {
      // Completed all sentences
      stopSpeech();
      return;
    }

    if (isPausedRef.current) return;

    window.speechSynthesis.cancel();
    const sentence = sentencesRef.current[index];
    sentenceIndexRef.current = index;
    setActiveSentenceIndex(index);

    const utterance = new SpeechSynthesisUtterance(sentence.trim());
    utterance.lang = lang;
    utterance.rate = voiceSpeed;

    utterance.onstart = () => {
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      // Next sentence if not manually paused or stopped
      if (!isPausedRef.current && isPlayingRef.current) {
        playSentenceIndex(index + 1, lang);
      }
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      if (!isPausedRef.current && isPlayingRef.current && index + 1 < sentencesRef.current.length) {
        playSentenceIndex(index + 1, lang);
      } else {
        stopSpeech();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Universal Speech Handler with Guaranteed Sentence Queue Pause & Resume:
   * - If currently playing the SAME text: PAUSES mid-dialogue at the current sentence.
   * - If currently paused for the SAME text: RESUMES from the exact sentence where paused.
   * - If new text or stopped: splits text into sentences and starts speaking from sentence 0.
   */
  const speakText = (text, lang = 'en-US') => {
    if (!('speechSynthesis' in window) || !text) return;

    // Case 1: Currently Playing same text -> PAUSE it!
    if (isPlayingRef.current && currentTextRef.current === text) {
      pauseSpeech();
      return;
    }

    // Case 2: Currently Paused for same text -> RESUME from paused sentence index!
    if (isPausedRef.current && currentTextRef.current === text) {
      isPausedRef.current = false;
      isPlayingRef.current = true;
      setIsPaused(false);
      setIsPlaying(true);
      playSentenceIndex(sentenceIndexRef.current, lang);
      return;
    }

    // Case 3: Fresh start (or new text) -> Parse sentences and play sentence 0
    stopSpeech();
    currentTextRef.current = text;
    
    // Split into sentences by line breaks or punctuation
    const splitSentences = text
      .split('\n')
      .flatMap(line => line.match(/[^.!?]+[.!?]*/g) || [line])
      .map(s => s.trim())
      .filter(Boolean);

    sentencesRef.current = splitSentences.length > 0 ? splitSentences : [text];
    sentenceIndexRef.current = 0;
    isPausedRef.current = false;
    isPlayingRef.current = true;

    setIsPlaying(true);
    setIsPaused(false);
    playSentenceIndex(0, lang);
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <LearningContext.Provider
      value={{
        tamilEnabled,
        setTamilEnabled,
        searchOpen,
        setSearchOpen,
        voiceSpeed,
        setVoiceSpeed,
        speakText,
        stopSpeech,
        pauseSpeech,
        isPlaying,
        isPaused,
        activeSentenceIndex,
        activeAudioPlaying: isPlaying,
        triggerCelebration
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  return useContext(LearningContext);
}
