import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function CourseDetailView() {
  const { id } = useParams();
  const { tamilEnabled } = useLearning();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      const res = await api.getCourseById(id);
      if (res.success && res.data) {
        setCourse(res.data);
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

  if (!course) {
    return (
      <div className="p-5 sm:p-8 text-center">
        <p className="text-on-surface-variant">Course not found.</p>
        <Link to="/learn" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold">
          Back to Learn Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/learn')}
        className="self-start flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Learning Paths
      </button>

      {/* Course Hero Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-tr from-primary to-primary-container text-white shadow-lg shadow-primary/20 flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
            Level {course.level_id}
          </span>
          <span className="text-xs font-medium text-white/80">~{course.estimated_hours} Hours Total</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">{course.title}</h1>
        {tamilEnabled && course.tamil_title && (
          <p className="text-sm font-tamil text-white/90 font-medium">{course.tamil_title}</p>
        )}

        <p className="text-xs text-white/80 mt-1">{course.description}</p>
      </div>

      {/* Modules and Lessons Tree */}
      <div className="flex flex-col gap-6">
        {course.modules?.map((mod, modIdx) => (
          <div key={mod.id} className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-3">
            
            {/* Module Title */}
            <div className="border-b border-surface-variant/40 pb-2.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Module {modIdx + 1}
              </span>
              <h2 className="text-base font-bold text-on-surface font-display">{mod.title}</h2>
              {tamilEnabled && mod.tamil_title && (
                <p className="text-xs font-tamil text-on-surface-variant">{mod.tamil_title}</p>
              )}
            </div>

            {/* Lessons List in Module */}
            <div className="flex flex-col gap-2 pt-1">
              {mod.lessons?.map((les, lesIdx) => (
                <Link
                  key={les.id}
                  to={`/lessons/${les.id}`}
                  className="p-3.5 rounded-2xl bg-surface-container-high hover:bg-surface-variant flex items-center justify-between transition-all group active:scale-[0.99] gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        les.is_completed
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-primary-fixed text-primary'
                      }`}
                    >
                      {les.is_completed ? (
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      ) : (
                        lesIdx + 1
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {les.title}
                      </h4>
                      {tamilEnabled && les.tamil_title && (
                        <p className="text-xs font-tamil text-on-surface-variant">{les.tamil_title}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-tertiary flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                      +{les.xp_reward}
                    </span>
                    <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform text-[18px]">
                      chevron_right
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
