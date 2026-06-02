/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardPen, Sparkles, Check, AlertCircle, ThumbsUp, HelpCircle } from 'lucide-react';
import { Teacher, Evaluation, RubricCategory } from '../types';
import { RUBRICS } from '../data/presets';

interface EvaluationFormProps {
  teachers: Teacher[];
  onSubmitEvaluation: (evaluation: Evaluation) => Promise<boolean>;
}

export default function EvaluationForm({ teachers, onSubmitEvaluation }: EvaluationFormProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [evaluatorName, setEvaluatorName] = useState('');
  const [role, setRole] = useState<'Coordinador' | 'Director' | 'Autoevaluación' | 'Colega'>('Coordinador');
  const [comments, setComments] = useState('');
  const [academicYear, setAcademicYear] = useState('2026');
  
  // Rubric Scores
  const [scores, setScores] = useState<Record<RubricCategory, number>>({
    planeacion: 3,
    pedagogia: 3,
    controlGrupo: 3,
    evaluacion: 3,
    profesionalismo: 3
  });

  // Success Banner States
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Find info about the selected teacher dynamically
  const activeTeacher = teachers.find(t => t.id === selectedTeacherId);

  // Categories list
  const categoriesList: { key: RubricCategory; label: string }[] = [
    { key: 'planeacion', label: 'Planeación Didáctica' },
    { key: 'pedagogia', label: 'Práctica y Didáctica' },
    { key: 'controlGrupo', label: 'Liderazgo y Gestión del Aula' },
    { key: 'evaluacion', label: 'Evaluación y Retroalimentación' },
    { key: 'profesionalismo', label: 'Profesionalismo y Colegialidad' }
  ];

  const handleScoreChange = (category: RubricCategory, newVal: number) => {
    setScores(prev => ({ ...prev, [category]: newVal }));
  };

  const handleReset = () => {
    setEvaluatorName('');
    setComments('');
    setScores({
      planeacion: 3,
      pedagogia: 3,
      controlGrupo: 3,
      evaluacion: 3,
      profesionalismo: 3
    });
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !evaluatorName.trim() || !comments.trim() || !activeTeacher) return;

    setSubmitStatus('loading');

    const newEvaluation: Evaluation = {
      id: `eval-${Date.now()}`,
      teacherId: selectedTeacherId,
      date: new Date().toISOString(),
      evaluatorName: evaluatorName.trim(),
      role,
      scores,
      comments: comments.trim(),
      level: activeTeacher.level,
      grade: activeTeacher.grade,
      subject: activeTeacher.subject,
      academicYear
    };

    try {
      const isOk = await onSubmitEvaluation(newEvaluation);
      if (isOk) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  // Auto-calculated total weight/average score
  const totalAverage = (scores.planeacion + scores.pedagogia + scores.controlGrupo + scores.evaluacion + scores.profesionalismo) / 5;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header Info */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ClipboardPen className="h-6.5 w-6.5 text-indigo-600" />
          Rúbrica de Evaluación Formativa
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Asienta valoraciones analíticas detalladas y comentarios cualitativos prácticos de acuerdo a los estándares del centro educativo.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8 text-center shadow-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto text-3xl mb-4">
              ✓
            </div>
            <h3 className="text-lg font-bold text-emerald-800">Evaluación Asentada Correctamente</h3>
            <p className="text-sm text-emerald-600 mt-2 max-w-md mx-auto">
              La rúbrica y las anotaciones para <strong>{activeTeacher?.name}</strong> fueron guardadas y consolidadas con éxito. El promedio final asentado fue de <strong>{totalAverage.toFixed(2)}</strong>.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs text-white rounded-xl shadow transition cursor-pointer"
              >
                Registrar Otra Rúbrica
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Metadata evaluators box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Teacher selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Docente a Evaluar</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => {
                    setSelectedTeacherId(e.target.value);
                    setSubmitStatus('idle');
                  }}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-bold"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.level} — {t.subject})</option>
                  ))}
                </select>
                {activeTeacher && (
                  <p className="text-[10px] text-slate-500 font-semibold mt-1.5">
                    Clase impartida actual: {activeTeacher.grade} • {activeTeacher.subject}
                  </p>
                )}
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Ciclo / Año Lectivo</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-bold"
                >
                  <option value="2026">Ciclo Escolar 2026</option>
                  <option value="2025">Ciclo Escolar 2025</option>
                  <option value="2024">Ciclo Escolar 2024</option>
                </select>
              </div>

              {/* Evaluator Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nombre del Evaluador</label>
                <input
                  type="text"
                  required
                  placeholder="Introduce tu nombre completo"
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 font-bold">Relación Evaluadora / Rol</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-bold"
                >
                  <option value="Coordinador">Coordinador Académico</option>
                  <option value="Director">Director de Plantel</option>
                  <option value="Colega">Evaluación Entre Pares (Colega)</option>
                  <option value="Autoevaluación">Autoevaluación del Docente</option>
                </select>
              </div>

            </div>

            {/* Interactive dimensions rubrics */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dimensiones Evaluativas</h3>
              
              {categoriesList.map((cat, idx) => {
                const rubricInfo = RUBRICS[cat.key];
                const activeScore = scores[cat.key];
                const activeDesc = rubricInfo.levels[activeScore as 1|2|3|4|5];

                return (
                  <div key={cat.key} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    {/* Header index and title */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 font-mono font-bold text-[10px] items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900">{rubricInfo.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 pl-7">{rubricInfo.description}</p>
                      </div>

                      {/* Display score */}
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 shrink-0">
                        Nivel: {activeScore}.0 (SOBRE 5)
                      </span>
                    </div>

                    {/* Radio visual slider */}
                    <div className="pl-7 mt-2">
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleScoreChange(cat.key, val)}
                            className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold w-14 shrink-0 cursor-pointer ${
                              activeScore === val
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-105'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <span>{val}.0</span>
                            <span className="text-[8px] font-semibold opacity-70">
                              {val === 1 ? 'Def.' : val === 2 ? 'Acept.' : val === 3 ? 'Buen.' : val === 4 ? 'M.Buen.' : 'Excel.'}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Descriptive rubric detail of active selected mark */}
                      <motion.div 
                        key={`${cat.key}-${activeScore}`}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-indigo-50/40 p-4 border border-indigo-100/60 rounded-xl"
                      >
                        <div className="flex items-center gap-2 text-indigo-800 text-[11px] font-bold">
                          <Sparkles className="h-4 w-4" />
                          <span>Descriptor de Rúbrica: {activeDesc.label}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {activeDesc.desc}
                        </p>
                      </motion.div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Qualitative Retroalimentación */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <label className="block text-xs font-bold text-slate-600 uppercase">Observaciones Cualitativas y Compromisos</label>
              <textarea
                required
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Ingresa retroalimentación detallada. Qué observaste que se hace bien y cuáles son las áreas específicas de desarrollo acordadas con el docente..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-850 placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            {/* Error messaging */}
            {submitStatus === 'error' && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Ocurrió un error al enviar la evaluación. Si tienes integrado Google Sheets, revisa tu conexión en la pestaña de Enlace.</span>
              </div>
            )}

            {/* Action Triggers */}
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 pl-2">
                Promedio Ponderado de Clase: <span className="text-indigo-600 font-bold">{totalAverage.toFixed(2)} / 5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  Restaurar Formulario
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitStatus === 'loading' ? (
                    <span>Registrando...</span>
                  ) : (
                    <>
                      <ClipboardPen className="h-4 w-4" />
                      <span>Asentar Evaluación</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}
      </AnimatePresence>

    </div>
  );
}
