import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ExerciseEngine from '../components/ExerciseEngine';
import FormattedText from '../components/FormattedText';

export default function LessonDetailView() {
  const { id } = useParams();
  const { tamilEnabled, speakText, triggerCelebration } = useLearning();
  const { refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inExerciseMode, setInExerciseMode] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [id]);

  async function loadLesson() {
    try {
      const res = await api.getLessonById(id);
      if (res.success && res.data) {
        setLesson(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCompleteLessonDirect = async () => {
    try {
      const res = await api.completeLesson(id, { score: 100, durationSeconds: 180 });
      if (res.success) {
        setCompletedSuccess(true);
        triggerCelebration();
        await refreshUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-5 sm:p-8 text-center">
        <p className="text-on-surface-variant">Lesson not found.</p>
        <button onClick={() => navigate('/learn')} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs">
          Back to Courses
        </button>
      </div>
    );
  }

  // Active Exercise Engine Mode
  if (inExerciseMode && lesson.exercises && lesson.exercises.length > 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav">
        <ExerciseEngine
          exercise={lesson.exercises[0]}
          onExit={() => setInExerciseMode(false)}
          onFinish={async () => {
            setInExerciseMode(false);
            await handleCompleteLessonDirect();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back
      </button>

      {/* Lesson Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-high border border-surface-variant/60 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary uppercase tracking-wider">
            {lesson.lesson_type} Lesson
          </span>
          <span className="text-xs font-bold text-tertiary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
            +{lesson.xp_reward} XP
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-on-surface font-display">{lesson.title}</h1>
        {tamilEnabled && lesson.tamil_title && (
          <p className="text-sm font-tamil text-primary font-medium">{lesson.tamil_title}</p>
        )}
      </div>

      {/* Lesson Content Sections */}
      <div className="flex flex-col gap-4">
        {lesson.contents && lesson.contents.length > 0 ? (
          lesson.contents.map((sec, idx) => (
            <div
              key={sec.id || idx}
              className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-base text-on-surface font-display">{sec.title}</h3>
                </div>
                <button
                  onClick={() => speakText(sec.content_text)}
                  className="w-8 h-8 shrink-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
                  title="Listen reading"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>

              {/* English Content */}
              <div className="p-4 rounded-2xl bg-surface-container text-sm font-medium text-on-surface leading-relaxed">
                <FormattedText text={sec.content_text} highlightVariant="badge" />
              </div>

              {/* Tamil Explanation */}
              {tamilEnabled && sec.tamil_translation && (
                <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary/20 text-xs font-tamil text-on-surface font-medium leading-relaxed">
                  <div className="flex items-center gap-1 font-bold text-secondary mb-1">
                    <span>📖 தமிழில் விளக்கம்:</span>
                  </div>
                  <FormattedText text={sec.tamil_translation} highlightVariant="badge" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </span>
              <h3 className="font-bold text-base text-on-surface font-display">
                Lesson Overview & Learning Goals
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container text-sm font-medium text-on-surface leading-relaxed flex flex-col gap-2">
              <p>
                In this lesson, you will master key concepts for <strong>{lesson.title}</strong> according to the Samacheer Kalvi syllabus.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-on-surface-variant">
                <li>Understand key vocabulary and sentence structures</li>
                <li>Practice bilingual Tamil-English explanations</li>
                <li>Test your understanding with practice questions below</li>
              </ul>
            </div>

            {tamilEnabled && (
              <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary/20 text-xs font-tamil text-on-surface font-medium leading-relaxed">
                <div className="flex items-center gap-1 font-bold text-secondary mb-1">
                  <span>📖 தமிழில் விளக்கம்:</span>
                </div>
                <p>
                  இந்த பாடத்தில் நீங்கள் <strong>{lesson.tamil_title || lesson.title}</strong> தொடர்பான முக்கிய இலக்கணம் மற்றும் வினா-விடைகளை கற்றுக்கொள்வீர்கள். கீழே உள்ள பயிற்சி வினாக்களை முடித்து XP புள்ளிகளை பெறுங்கள்!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complete or Practice Action Button */}
      <div className="p-4 sm:p-5 rounded-3xl bg-surface-container-high border border-surface-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-on-surface font-display">Ready to Test Your Knowledge?</h4>
          <p className="text-xs text-on-surface-variant font-tamil">
            பயிற்சி வினாக்களை முடித்து XP புள்ளிகளைப் பெறுங்கள்.
          </p>
        </div>

        {lesson.exercises && lesson.exercises.length > 0 ? (
          <button
            onClick={() => setInExerciseMode(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-container transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">sports_esports</span>
            Start Interactive Practice
          </button>
        ) : (
          <button
            onClick={handleCompleteLessonDirect}
            disabled={completedSuccess}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {completedSuccess ? 'Completed! (+XP Awarded)' : 'Mark Lesson Complete'}
          </button>
        )}
      </div>

    </div>
  );
}
