/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, Send, ThumbsUp, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import { Teacher, StudentComment } from '../types';

interface StudentFeedbackProps {
  teachers: Teacher[];
  onSubmitComment: (comment: StudentComment) => Promise<boolean>;
}

export default function StudentFeedback({ teachers, onSubmitComment }: StudentFeedbackProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const activeTeacher = teachers.find(t => t.id === selectedTeacherId);

  const handleReset = () => {
    setCommentText('');
    setRating(5);
    setSubmitStatus('idle');
  };

  // Simplistic local sentiment tagger for Spanish academic feedback
  const tagSentiment = (text: string, score: number): 'positivo' | 'neutro' | 'critico' => {
    const raw = text.toLowerCase();
    const positiveWords = ['bonito', 'divertido', 'lindo', 'chido', 'excelente', 'bueno', 'gusta', 'feliz', 'mejor', 'justo', 'gran', 'comprendo', 'explica', 'paciente', 'recomiendo'];
    const criticalWords = ['estricto', 'enoja', 'grita', 'desespera', 'reprobo', 'miedo', 'pesado', 'aburrido', 'malo', 'injusto', 'ofende', 'falta', 'tarde', 'no explica'];

    let posCount = 0;
    let negCount = 0;

    positiveWords.forEach(w => { if (raw.includes(w)) posCount++; });
    criticalWords.forEach(w => { if (raw.includes(w)) negCount++; });

    if (score >= 4) {
      return negCount > posCount ? 'neutro' : 'positivo';
    } else if (score <= 2) {
      return 'critico';
    } else {
      if (posCount > negCount) return 'positivo';
      if (negCount > posCount) return 'critico';
      return 'neutro';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTeacherId || !activeTeacher) return;

    setSubmitStatus('loading');

    const sentiment = tagSentiment(commentText, rating);

    const newComment: StudentComment = {
      id: `com-${Date.now()}`,
      teacherId: selectedTeacherId,
      date: new Date().toISOString(),
      comment: commentText.trim(),
      rating,
      level: activeTeacher.level,
      grade: activeTeacher.grade,
      subject: activeTeacher.subject,
      sentiment
    };

    try {
      const isOk = await onSubmitComment(newComment);
      if (isOk) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Box Header info */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-2.5">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Buzón de Opinión Escolar Anónima
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Tu opinión ayuda a tus maestros a dar mejores clases. Este buzón es <strong>totalmente anónimo</strong>; tu nombre ni tu cuenta de correo quedarán registrados en ningún lado.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-sky-50 rounded-2xl border border-sky-100 p-8 text-center shadow-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600 mx-auto text-3xl mb-4">
              ✨
            </div>
            <h3 className="text-lg font-bold text-sky-800">¡Tu comentario fue enviado!</h3>
            <p className="text-sm text-sky-600 mt-2 max-w-md mx-auto">
              Muchas gracias por participar de forma constructiva. Tu opinión ha sido depositada de manera segura en el expediente confidencial del docente.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 font-semibold text-xs text-white rounded-xl shadow transition cursor-pointer"
              >
                Enviar Otra Opinión
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-6">
            
            {/* Teacher selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Selecciona a tu Maestro(a)</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => {
                  setSelectedTeacherId(e.target.value);
                  setSubmitStatus('idle');
                }}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-850 font-bold"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.level} — {t.subject})</option>
                ))}
              </select>
            </div>

            {/* Micro warning about anonymity */}
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-[11px] text-amber-800 flex items-start gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Compromiso de Privacidad Escolar:</strong> Los datos se almacenan de modo directo encriptados y sin metadatos de usuario o de sesión. Por favor, sé limpio, objetivo y respetuoso en tus comentarios.
              </div>
            </div>

            {/* Interactive Stars Rating system */}
            <div className="flex flex-col items-center gap-2 border-y border-slate-50 py-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">¿Qué calificación le das a su clase?</span>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isActive = (hoverRating !== null ? hoverRating : rating) >= val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(val)}
                      className="p-1 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                    >
                      <Star 
                        className={`h-8 w-8 transition ${
                          isActive 
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm scale-110' 
                            : 'text-slate-200'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-indigo-600 mt-1">
                {rating === 1 ? 'Muy Mala (1 de 5)' :
                 rating === 2 ? 'Mala / Mejorable (2 de 5)' :
                 rating === 3 ? 'Regular / Normal (3 de 5)' :
                 rating === 4 ? 'Muy Buena (4 de 5)' : 'Excelente Clase (5 de 5)'}
              </span>
            </div>

            {/* Written comment textarea */}
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-slate-600 uppercase">Cuéntanos por qué (Comentarios o sugerencias)</label>
              <textarea
                required
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe sugerencias para tu maestro... ¿Qué te gusta de su clase? ¿Qué crees que podría mejorar o explicar de otra manera?"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-850 placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            {/* Error notifications */}
            {submitStatus === 'error' && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-lg text-xs font-semibold">
                Ocurrió un error. Revisa la conexión con Google Sheets o inténtalo de nuevo más tarde.
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Limpiar todo
              </button>
              <button
                type="submit"
                disabled={submitStatus === 'loading' || !commentText.trim()}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-xs font-bold text-white rounded-xl shadow-md shadow-sky-100 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitStatus === 'loading' ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enviar de forma anónima</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </AnimatePresence>

    </div>
  );
}
