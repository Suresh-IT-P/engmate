import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ExerciseEngine from '../components/ExerciseEngine';

export default function DailyQuizView() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    try {
      const res = await api.getDailyQuiz();
      if (res.success && res.data) {
        setQuizData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="p-5 sm:p-8 text-center">
        <p className="text-on-surface-variant">Daily quiz already completed or unavailable.</p>
        <button onClick={() => navigate('/practice')} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold">
          Back to Practice Hub
        </button>
      </div>
    );
  }

  const exerciseWrapper = {
    id: quizData.quizId,
    title: quizData.title,
    exercise_type: 'mcq',
    questions: quizData.questions
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav">
      <ExerciseEngine
        exercise={exerciseWrapper}
        onExit={() => navigate('/practice')}
        onFinish={() => navigate('/progress')}
      />
    </div>
  );
}
