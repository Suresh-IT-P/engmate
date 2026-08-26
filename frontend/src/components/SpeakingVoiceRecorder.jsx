import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function SpeakingVoiceRecorder({ topic, onEvaluated }) {
  const { speakText, triggerCelebration, tamilEnabled } = useLearning();
  const { refreshUserData } = useAuth();

  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [micError, setMicError] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micPermission, setMicPermission] = useState('unknown'); // 'unknown' | 'granted' | 'denied'

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isRecordingIntentRef = useRef(false); // tracks user INTENT to record (vs browser state)

  // Reset when topic changes
  useEffect(() => {
    stopRecognition();
    setFinalTranscript('');
    setInterimText('');
    setResult(null);
    setMicError('');
    finalTranscriptRef.current = '';
  }, [topic?.id]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
    // Check microphone permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then(status => {
        setMicPermission(status.state);
        status.onchange = () => setMicPermission(status.state);
      }).catch(() => {});
    }
  }, []);

  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;        // Keep listening until manually stopped
    recognition.interimResults = true;    // Show live text as the user speaks
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-IN';          // Indian English accent support

    recognition.onstart = () => {
      setIsRecording(true);
      setMicError('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let newFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinal += chunk + ' ';
        } else {
          interim += chunk;
        }
      }

      if (newFinal) {
        finalTranscriptRef.current += newFinal;
        setFinalTranscript(finalTranscriptRef.current.trim());
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);

      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        // Hard stop — user must fix permissions
        isRecordingIntentRef.current = false;
        setIsRecording(false);
        setInterimText('');
        setMicPermission('denied');
        setMicError('Microphone access denied. Click the 🔒 icon in your browser address bar → Allow microphone → Reload page.');
      } else if (event.error === 'no-speech') {
        // Silence timeout — DON'T stop, DON'T show error. onend will auto-restart.
        setInterimText('');
      } else if (event.error === 'audio-capture') {
        isRecordingIntentRef.current = false;
        setIsRecording(false);
        setMicError('No microphone found. Please connect a microphone and try again.');
      } else if (event.error === 'network') {
        isRecordingIntentRef.current = false;
        setIsRecording(false);
        setMicError('Network error with speech service. Please check your connection.');
      } else if (event.error !== 'aborted') {
        // Unknown error — show it but keep trying if user intended to record
        console.error('Speech recognition error:', event.error);
      }
      // 'aborted' is silent — triggered by our own .abort() call
    };

    recognition.onend = () => {
      setInterimText('');
      // If user still intends to record (no-speech timeout, or browser auto-stopped),
      // restart recognition automatically
      if (isRecordingIntentRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Recognition may still be active — ignore
        }
      } else {
        setIsRecording(false);
      }
    };

    return recognition;
  }, []);

  const stopRecognition = () => {
    isRecordingIntentRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimText('');
  };

  const startRecording = async () => {
    if (!speechSupported) {
      setMicError('Speech recognition is not supported. Please use Google Chrome or Microsoft Edge on desktop.');
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
    } catch (err) {
      setMicPermission('denied');
      setMicError('Microphone permission denied. Please click the 🔒 icon in your browser address bar and allow microphone access.');
      return;
    }

    // Reset transcript for fresh recording
    finalTranscriptRef.current = '';
    setFinalTranscript('');
    setInterimText('');
    setResult(null);
    setMicError('');

    const recognition = createRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;

    isRecordingIntentRef.current = true;
    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      isRecordingIntentRef.current = false;
      setMicError('Could not start recording. Please try again.');
    }
  };

  const stopAndFinish = () => {
    isRecordingIntentRef.current = false; // Tell onend NOT to restart
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop(); // Graceful stop — triggers onend
      } catch (_) {
        stopRecognition();
      }
    }
  };

  const handleEvaluate = async () => {
    const transcript = (finalTranscript || '').trim();
    if (!transcript) {
      setMicError('No speech recorded. Please record your voice first.');
      return;
    }

    setEvaluating(true);
    setMicError('');
    try {
      const payload = {
        topicId: topic.id,
        targetSentence: topic.sample_sentence || topic.prompt_text,
        spokenTranscript: transcript,
        durationSeconds: 30
      };

      const res = await api.evaluateSpeaking(payload);
      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.accuracyScore >= 80) {
          triggerCelebration();
        }
        await refreshUserData();
        if (onEvaluated) onEvaluated(res.data);
      }
    } catch (err) {
      console.error('Error evaluating speech:', err);
      setMicError('Evaluation failed. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleRetry = () => {
    setFinalTranscript('');
    setInterimText('');
    setResult(null);
    setMicError('');
    finalTranscriptRef.current = '';
  };

  const displayText = finalTranscript + (interimText ? ` ${interimText}` : '');
  const scoreColor = (score) =>
    score >= 80 ? 'text-secondary' : score >= 60 ? 'text-tertiary' : 'text-error';

  return (
    <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-variant/80 p-4 sm:p-6 flex flex-col gap-5">

      {/* Target Sentence Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">📣 Target Sentence</span>
          <button
            onClick={() => speakText(topic.sample_sentence || topic.prompt_text)}
            className="w-9 h-9 shrink-0 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25 hover:scale-105 transition-transform active:scale-95"
            title="Listen to native model pronunciation"
          >
            <span className="material-symbols-outlined text-[20px]">volume_up</span>
          </button>
        </div>

        <p className="text-base sm:text-lg font-bold text-on-surface font-display leading-snug">
          "{topic.sample_sentence || topic.prompt_text}"
        </p>

        {tamilEnabled && topic.tamil_prompt && (
          <p className="text-xs font-tamil text-on-surface-variant">{topic.tamil_prompt}</p>
        )}
      </div>

      {/* Error Banner */}
      {micError && (
        <div className="p-3 rounded-2xl bg-error-container/40 border border-error/30 flex items-start gap-2">
          <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">mic_off</span>
          <p className="text-xs text-error font-medium">{micError}</p>
        </div>
      )}

      {/* Mic Permission Warning */}
      {micPermission === 'denied' && !micError && (
        <div className="p-3 rounded-2xl bg-error-container/40 border border-error/30 flex items-start gap-2">
          <span className="material-symbols-outlined text-error text-[20px] shrink-0">lock</span>
          <div>
            <p className="text-xs font-bold text-error">Microphone Access Blocked</p>
            <p className="text-xs text-error/80 mt-0.5">Go to browser settings → Site permissions → Microphone → Allow, then reload the page.</p>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center justify-center gap-4 py-2">
        <div className="relative">
          {/* Animated rings when recording */}
          {isRecording && (
            <>
              <div className="absolute -inset-3 rounded-full bg-error/20 animate-ping" />
              <div className="absolute -inset-6 rounded-full bg-error/10 animate-pulse" />
            </>
          )}

          <button
            onClick={isRecording ? stopAndFinish : startRecording}
            disabled={micPermission === 'denied'}
            className={`w-20 h-20 shrink-0 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
              isRecording
                ? 'bg-error text-white scale-110 shadow-error/40'
                : 'bg-primary text-white hover:bg-primary-container shadow-primary/30 hover:scale-105 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[36px]">
              {isRecording ? 'stop_circle' : 'mic'}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className={`text-xs font-bold uppercase tracking-wider ${isRecording ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
            {isRecording ? '🔴 Recording... Speak now' : finalTranscript ? '✅ Recording done' : '🎙️ Tap microphone to speak'}
          </span>
          {!speechSupported && (
            <span className="text-xs text-error font-medium">Use Chrome or Edge browser for speech recognition</span>
          )}
        </div>

        {/* Live Transcript Box */}
        <div className={`w-full min-h-[60px] p-3.5 rounded-2xl text-center flex items-center justify-center border transition-all ${
          displayText
            ? 'bg-primary-fixed/20 border-primary/30'
            : 'bg-surface-container border-surface-variant/40'
        }`}>
          {displayText ? (
            <p className="text-sm font-medium text-on-surface leading-relaxed">
              <span className="text-on-surface">{finalTranscript}</span>
              {interimText && <span className="text-on-surface-variant italic"> {interimText}</span>}
            </p>
          ) : (
            <span className="text-xs text-outline-variant italic">Your spoken words will appear here in real-time...</span>
          )}
        </div>

        {/* Action Buttons */}
        {finalTranscript && !isRecording && (
          <div className="w-full flex gap-2">
            <button
              onClick={handleRetry}
              className="flex-1 min-w-0 py-2.5 rounded-2xl border-2 border-surface-variant text-on-surface-variant font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-variant transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Retry
            </button>
            <button
              onClick={handleEvaluate}
              disabled={evaluating}
              className="flex-[2] py-2.5 rounded-2xl bg-secondary text-white font-bold text-sm shadow-md shadow-secondary/25 hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {evaluating ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                  Evaluate My Pronunciation
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Scorecard */}
      {result && (
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-high border border-surface-variant/70 flex flex-col gap-4">
          <h4 className="text-sm font-bold text-on-surface font-display flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            Speaking Analysis Scorecard
          </h4>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Accuracy', value: result.accuracyScore, icon: 'target' },
              { label: 'Fluency', value: result.fluencyScore, icon: 'waves' },
              { label: 'Pronunciation', value: result.pronunciationScore, icon: 'record_voice_over' }
            ].map(m => (
              <div key={m.label} className="p-3 rounded-xl bg-surface-container-lowest flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">{m.label}</span>
                <p className={`text-2xl font-bold font-display ${scoreColor(m.value)}`}>{m.value}%</p>
                <div className="w-full h-1 rounded-full bg-surface-variant overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${m.value >= 80 ? 'bg-secondary' : m.value >= 60 ? 'bg-tertiary' : 'bg-error'}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col gap-1.5">
            <p className="text-xs text-on-surface font-medium">💬 {result.feedback}</p>
            {tamilEnabled && result.tamilFeedback && (
              <p className="text-xs text-primary font-tamil font-medium">📖 {result.tamilFeedback}</p>
            )}
          </div>

          {result.missedWords && result.missedWords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase w-full mb-0.5">Practice these words:</span>
              {result.missedWords.slice(0, 6).map(w => (
                <button
                  key={w}
                  onClick={() => speakText(w)}
                  className="px-2.5 py-1 rounded-lg bg-error-container/40 text-error text-xs font-bold flex items-center gap-1 hover:bg-error-container/60 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">volume_up</span>
                  {w}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleRetry}
            className="w-full py-2.5 rounded-2xl border-2 border-primary text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-fixed/20 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">replay</span>
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
}
