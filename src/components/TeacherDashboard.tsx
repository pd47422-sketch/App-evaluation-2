/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Plus, Download, Printer, User, Mail, Calendar, 
  MessageCircle, Star, ThumbsUp, AlertCircle, FileText, LayoutGrid, CheckCircle, ChevronRight
} from 'lucide-react';
import { Teacher, Evaluation, StudentComment, EducationalLevel } from '../types';
import MetricChart from './MetricChart';
import { downloadHTMLReport, printPDFReport } from '../utils/exporter';

interface TeacherDashboardProps {
  teachers: Teacher[];
  evaluations: Evaluation[];
  comments: StudentComment[];
  onAddTeacher: (teacher: Teacher) => void;
}

export default function TeacherDashboard({ teachers, evaluations, comments, onAddTeacher }: TeacherDashboardProps) {
  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  
  // States of Add New Teacher dialog
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    level: 'Primaria' as EducationalLevel,
    grade: '',
    subject: '',
    email: '',
    avatar: '👩‍🏫'
  });

  const levelsList: (EducationalLevel | 'Todos')[] = ['Todos', 'Primaria', 'Secundaria', 'Preparatoria'];
  const avatarPresets = ['👩‍🏫', '👨‍🏫', '👩‍💻', '👨‍💻', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '📚', '📐'];

  // Filter teachers list based on search and level selection
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesLevel = selectedLevel === 'Todos' || t.level === selectedLevel;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.grade.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [teachers, selectedLevel, searchQuery]);

  // Handle selected teacher info
  const selectedTeacher = useMemo(() => {
    return teachers.find((t) => t.id === selectedTeacherId) || filteredTeachers[0] || null;
  }, [teachers, selectedTeacherId, filteredTeachers]);

  // Ensure a teacher is always selected when filtering changes
  useState(() => {
    if (filteredTeachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(filteredTeachers[0].id);
    }
  });

  // Fetch evaluations & student comments for selected teacher
  const selectedTeacherEvals = useMemo(() => {
    if (!selectedTeacher) return [];
    return evaluations.filter((e) => e.teacherId === selectedTeacher.id);
  }, [evaluations, selectedTeacher]);

  const selectedTeacherComments = useMemo(() => {
    if (!selectedTeacher) return [];
    return comments.filter((c) => c.teacherId === selectedTeacher.id);
  }, [comments, selectedTeacher]);

  // Calculate stats for selected teacher
  const teacherStats = useMemo(() => {
    if (!selectedTeacher || selectedTeacherEvals.length === 0) {
      return { overallAvg: 0, count: 0, planeacionAvg: 0, pedagogiaAvg: 0, controlGrupoAvg: 0, evaluacionAvg: 0, profesionalismoAvg: 0 };
    }
    let sums = { planeacion: 0, pedagogia: 0, controlGrupo: 0, evaluacion: 0, profesionalismo: 0 };
    selectedTeacherEvals.forEach((e) => {
      sums.planeacion += e.scores.planeacion;
      sums.pedagogia += e.scores.pedagogia;
      sums.controlGrupo += e.scores.controlGrupo;
      sums.evaluacion += e.scores.evaluacion;
      sums.profesionalismo += e.scores.profesionalismo;
    });
    const count = selectedTeacherEvals.length;
    return {
      count,
      planeacionAvg: Math.round((sums.planeacion / count) * 10) / 10,
      pedagogiaAvg: Math.round((sums.pedagogia / count) * 10) / 10,
      controlGrupoAvg: Math.round((sums.controlGrupo / count) * 10) / 10,
      evaluacionAvg: Math.round((sums.evaluacion / count) * 10) / 10,
      profesionalismoAvg: Math.round((sums.profesionalismo / count) * 10) / 10,
      overallAvg: Math.round(((sums.planeacion + sums.pedagogia + sums.controlGrupo + sums.evaluacion + sums.profesionalismo) / (count * 5)) * 100) / 100
    };
  }, [selectedTeacher, selectedTeacherEvals]);

  // Handle adding teacher
  const handleSubmitTeacher = (e: FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name || !newTeacherForm.grade || !newTeacherForm.subject) return;

    const newTeacher: Teacher = {
      id: `doc-${Date.now()}`,
      name: newTeacherForm.name,
      level: newTeacherForm.level,
      grade: newTeacherForm.grade,
      subject: newTeacherForm.subject,
      email: newTeacherForm.email || `${newTeacherForm.name.toLowerCase().replace(/\s+/g, '.')}@colegio.edu.mx`,
      avatar: newTeacherForm.avatar
    };

    onAddTeacher(newTeacher);
    setSelectedTeacherId(newTeacher.id);
    setIsAddingTeacher(false);
    // Reset form
    setNewTeacherForm({
      name: '',
      level: 'Primaria',
      grade: '',
      subject: '',
      email: '',
      avatar: '👩‍🏫'
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search and control filter board */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        {/* Tabs for level selection */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
          {levelsList.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search bar and Quick buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:w-1/2">
          <div className="relative flex-grow">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar docente, materia o grado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-800"
            />
          </div>
          <button
            onClick={() => setIsAddingTeacher(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 font-semibold text-xs text-white rounded-xl hover:bg-indigo-700 transition shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Docente</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Teachers List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-[calc(100vh-14rem)] overflow-y-auto pr-2 scrollbar-thin">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-slate-400" />
              Directorio Docente ({filteredTeachers.length})
            </h2>
          </div>

          {filteredTeachers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
              <div className="text-3xl text-slate-100 mb-2">🤷‍♂️</div>
              <p className="text-sm font-semibold text-slate-500">No se encontraron docentes</p>
              <p className="text-xs text-slate-400 mt-1">Prueba refinando los filtros o añade un nuevo perfil en el botón de la derecha.</p>
            </div>
          ) : (
            filteredTeachers.map((t) => {
              const isSelected = selectedTeacher?.id === t.id;
              const evalsCount = evaluations.filter((e) => e.teacherId === t.id).length;
              return (
                <div
                  key={t.id}
                  id={`teacher-card-${t.id}`}
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`group relative p-4 rounded-xl border transition-all duration-150 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-200/80 shadow-md ring-1 ring-indigo-100'
                      : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl group-hover:scale-105 transition duration-150">
                      {t.avatar}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate leading-snug">
                          {t.name}
                        </h3>
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-500 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                        {t.level} • {t.grade} • {t.subject}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        {/* Rating pill indicator */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          📂 {evalsCount} {evalsCount === 1 ? 'eval.' : 'evals.'}
                        </span>
                        
                        {/* Student Comments count */}
                        {comments.filter(c => c.teacherId === t.id).length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                            💬 {comments.filter(c => c.teacherId === t.id).length} buzón
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right column: Selected Teacher Details Evaluation Dashboard (8 cols) */}
        <div id="print-area" className="lg:col-span-8">
          {selectedTeacher ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-8">
              
              {/* Header profile of selected teacher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 print:pb-4">
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50/80 text-4xl shadow-sm">
                    {selectedTeacher.avatar}
                  </div>
                  <div>
                    <span className="inline-flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                      {selectedTeacher.level}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {selectedTeacher.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 leading-none">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        {selectedTeacher.grade} — {selectedTeacher.subject}
                      </span>
                      {selectedTeacher.email && (
                        <span className="flex items-center gap-1 leading-none border-l border-slate-200 pl-3">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {selectedTeacher.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Exporter triggers */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0 print:hidden">
                  <button
                    onClick={() => downloadHTMLReport(selectedTeacher, evaluations, comments)}
                    title="Descargar Reporte Completo en HTML para Archivo"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    <Download className="h-4.5 w-4.5 text-slate-500" />
                    <span>Fichero HTML</span>
                  </button>
                  <button
                    onClick={printPDFReport}
                    title="Imprimir Expediente o Guardar como PDF"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    <Printer className="h-4.5 w-4.5" />
                    <span>Imprimir PDF</span>
                  </button>
                </div>
              </div>

              {/* General Performance Metas / Bento cards */}
              {selectedTeacherEvals.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <span className="inline-block text-3xl mb-2 text-slate-300">📁</span>
                  <h4 className="text-sm font-bold text-slate-700">Sin Evaluaciones Registradas</h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                    Aún ningún directivo o colega ha registrado una evaluación detallada para {selectedTeacher.name}.
                  </p>
                  <p className="text-xs text-indigo-600 font-bold mt-3">
                    ¡Ve a la pestaña "Evaluar Docente" para asentar la primera rúbrica ahora mismo!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {/* Stats grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Puntuación General</div>
                      <div className="text-3xl font-black text-indigo-600">{teacherStats.overallAvg.toFixed(2)}</div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 mt-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3" /> Promedio de Rúbricas
                      </div>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Rúbricas Aplicadas</div>
                      <div className="text-3xl font-black text-slate-800">{teacherStats.count}</div>
                      <div className="text-[10px] font-semibold text-slate-400 mt-1">Registradas período 2024 - 2026</div>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Buzón Escolar</div>
                      <div className="text-3xl font-black text-sky-600">{selectedTeacherComments.length}</div>
                      <div className="text-[10px] font-semibold text-slate-400 mt-1">Opiniones anónimas de alumnos</div>
                    </div>
                  </div>

                  {/* Visual Chart Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-indigo-500" />
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Desempeño Comparativo Anual</h3>
                    </div>
                    <MetricChart teacherId={selectedTeacher.id} evaluations={evaluations} />
                  </div>

                  {/* Rubric metrics breakdown bar sliders */}
                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/30">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">Detalle Proporcional de Rúbricas</h3>
                    <div className="flex flex-col gap-3.5">
                      {[
                        { label: 'Planeación Didáctica', val: teacherStats.planeacionAvg, color: 'from-blue-400 to-indigo-500' },
                        { label: 'Práctica y Didáctica', val: teacherStats.pedagogiaAvg, color: 'from-emerald-400 to-teal-500' },
                        { label: 'Gestión de Grupo', val: teacherStats.controlGrupoAvg, color: 'from-indigo-400 to-violet-500' },
                        { label: 'Evaluación de Aprendizajes', val: teacherStats.evaluacionAvg, color: 'from-amber-400 to-orange-500' },
                        { label: 'Profesionalismo y Ética', val: teacherStats.profesionalismoAvg, color: 'from-rose-400 to-red-500' }
                      ].map((bar, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-xs font-medium mb-1">
                            <span className="text-slate-700">{bar.label}</span>
                            <span className="font-bold text-indigo-700">{bar.val.toFixed(1)} / 5.0</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                              style={{ width: `${(bar.val / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observations Qualitative list */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bitácora de Observaciones de Comisiones</h3>
                    <div className="flex flex-col gap-3.5">
                      {selectedTeacherEvals.map((e) => (
                        <div key={e.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-all">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2.5 mb-2.5 text-xs">
                            <span className="font-semibold text-slate-800">
                              ✍️ {e.evaluatorName} <span className="text-slate-400 font-normal">({e.role})</span>
                            </span>
                            <span className="text-slate-400 font-medium">Año Ciclo: {e.academicYear}</span>
                          </div>
                          <p className="text-xs text-slate-600 italic leading-relaxed">
                            "{e.comments}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Anonymous student comments mailbox cards */}
              <div className="border-t border-slate-100 pt-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="text-sky-500 h-4.5 w-4.5" />
                    Buzón Estudiantil ({selectedTeacherComments.length} comentarios)
                  </h3>
                </div>

                {selectedTeacherComments.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-[11px] text-slate-500">
                    <AlertCircle className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                    No hay comentarios anónimos registrados aún para este docente en el buzón escolar.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTeacherComments.map((c) => (
                      <div 
                        key={c.id} 
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                          c.sentiment === 'positivo' ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-200' :
                          c.sentiment === 'critico' ? 'bg-rose-50/20 border-rose-100 hover:border-rose-200' :
                          'bg-slate-50/40 border-slate-200/60 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2.5">
                            <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                              Alumno de {c.grade} • {c.subject}
                            </span>
                            <div className="flex gap-0.5 shrink-0 text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < c.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 italic leading-relaxed">
                            "{c.comment}"
                          </p>
                        </div>
                        <div className="text-[9.5px] text-slate-400 text-right mt-3">
                          Huso: {new Date(c.date).toLocaleDateString('es-MX')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
              <span className="text-4xl">📚</span>
              <p className="text-slate-600 font-bold mt-4">No se ha cargado ningún perfil docente aún</p>
              <p className="text-slate-400 text-xs mt-1">Crea uno en el panel de Nuevo Docente para empezar a evaluarlo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Dialog for New Teacher profile */}
      <AnimatePresence>
        {isAddingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="bg-indigo-600 text-white p-5">
                <h3 className="text-base font-bold">Dar de alta Nuevo Docente</h3>
                <p className="text-slate-200 text-[11px] mt-0.5">Introduce los datos del maestro de la institución para registrarlo en las rúbricas.</p>
              </div>

              <form onSubmit={handleSubmitTeacher} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Profr. Alejandro Domínguez"
                    value={newTeacherForm.name}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nivel Educativo</label>
                    <select
                      value={newTeacherForm.level}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, level: e.target.value as EducationalLevel })}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-semibold"
                    >
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Preparatoria">Preparatoria</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Grado Específico</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. 5º de primaria or 3º Semestre"
                      value={newTeacherForm.grade}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, grade: e.target.value })}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Materia Impartida</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Historia de México"
                      value={newTeacherForm.subject}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, subject: e.target.value })}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email (Opcional)</label>
                    <input
                      type="email"
                      placeholder="maestro@correo.com"
                      value={newTeacherForm.email}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {/* Avatar presets selector emoji */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Avatar o Identificador Visual</label>
                  <div className="flex flex-wrap gap-2">
                    {avatarPresets.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setNewTeacherForm({ ...newTeacherForm, avatar: av })}
                        className={`text-2xl p-2 rounded-xl transition duration-100 ${
                          newTeacherForm.avatar === av ? 'bg-indigo-100 border border-indigo-300 scale-110' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTeacher(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-md transition cursor-pointer"
                  >
                    Guardar Registro Docente
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
