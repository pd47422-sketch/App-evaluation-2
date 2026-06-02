/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Teacher, Evaluation, StudentComment } from '../types';
import { RUBRICS } from '../data/presets';

// Helper to format date
const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
};

/**
 * Generates a beautiful self-contained HTML report file and triggers browser download.
 */
export const downloadHTMLReport = (
  teacher: Teacher,
  evaluations: Evaluation[],
  comments: StudentComment[]
) => {
  const teacherEvals = evaluations.filter((e) => e.teacherId === teacher.id);
  const teacherComments = comments.filter((c) => c.teacherId === teacher.id);

  // Calculate averages
  const count = teacherEvals.length;
  const avgScores = { planeacion: 0, pedagogia: 0, controlGrupo: 0, evaluacion: 0, profesionalismo: 0 };
  
  if (count > 0) {
    teacherEvals.forEach((e) => {
      avgScores.planeacion += e.scores.planeacion || 0;
      avgScores.pedagogia += e.scores.pedagogia || 0;
      avgScores.controlGrupo += e.scores.controlGrupo || 0;
      avgScores.evaluacion += e.scores.evaluacion || 0;
      avgScores.profesionalismo += e.scores.profesionalismo || 0;
    });
    avgScores.planeacion = Math.round((avgScores.planeacion / count) * 10) / 10;
    avgScores.pedagogia = Math.round((avgScores.pedagogia / count) * 10) / 10;
    avgScores.controlGrupo = Math.round((avgScores.controlGrupo / count) * 10) / 10;
    avgScores.evaluacion = Math.round((avgScores.evaluacion / count) * 10) / 10;
    avgScores.profesionalismo = Math.round((avgScores.profesionalismo / count) * 10) / 10;
  }

  const overallAvg = count > 0 
    ? Math.round(((avgScores.planeacion + avgScores.pedagogia + avgScores.controlGrupo + avgScores.evaluacion + avgScores.profesionalismo) / 5) * 100) / 100
    : 0;

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Evaluación - ${teacher.name}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 850px;
            margin: 0 auto;
            background: #ffffff;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 16px;
            border: 1px border #e2e8f0;
            overflow: hidden;
        }
        .header {
            background-color: #4f46e5;
            color: #ffffff;
            padding: 35px 40px;
            position: relative;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.025em;
        }
        .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .badge {
            background-color: #ffffff;
            color: #4f46e5;
            padding: 4px 12px;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
            margin-top: 10px;
        }
        .content {
            padding: 40px;
        }
        .teacher-meta-grid {
            display: grid;
            grid-template-columns: 100px 1sfr;
            gap: 20px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 25px;
            margin-bottom: 30px;
            align-items: center;
        }
        .avatar {
            font-size: 64px;
            background: #f1f5f9;
            width: 100px;
            height: 100px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .teacher-info h2 {
            margin: 0 0 5px 0;
            font-size: 22px;
            color: #0f172a;
        }
        .teacher-info p {
            margin: 2px 0;
            color: #64748b;
            font-size: 14px;
        }
        .stats-highlight {
            display: flex;
            gap: 20px;
            margin-bottom: 35px;
        }
        .stat-card {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .stat-card-title {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 5px;
            font-weight: 600;
        }
        .stat-card-value {
            font-size: 36px;
            font-weight: 800;
            color: #4f46e5;
            line-height: 1;
        }
        .stat-card-subtitle {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 5px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            border-left: 4px solid #4f46e5;
            padding-left: 12px;
            margin: 35px 0 20px 0;
            color: #0f172a;
        }
        .rubrics-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .rubrics-table th, .rubrics-table td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid #f1f5f9;
        }
        .rubrics-table th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #475569;
            font-size: 13px;
        }
        .rubrics-table td {
            font-size: 14px;
        }
        .score-pill {
            display: inline-block;
            padding: 4px 10px;
            background-color: #e0e7ff;
            color: #3730a3;
            border-radius: 6px;
            font-weight: bold;
            font-size: 13px;
        }
        .eval-comment-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .eval-comment-box h5 {
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #334155;
            display: flex;
            justify-content: space-between;
        }
        .eval-comment-box h5 span {
            font-size: 12px;
            color: #94a3b8;
            font-weight: normal;
        }
        .eval-comment-box p {
            margin: 0;
            font-size: 13.5px;
            color: #475569;
            font-style: italic;
        }
        .comment-item {
            border-bottom: 1px solid #f1f5f9;
            padding: 15px 0;
        }
        .comment-item:last-child {
            border-bottom: none;
        }
        .comment-meta {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #94a3b8;
            margin-bottom: 6px;
        }
        .comment-text {
            font-size: 13.5px;
            color: #334155;
            background: #fafaf9;
            padding: 10px 15px;
            border-radius: 8px;
            border-left: 3px solid #cbd5e1;
        }
        .footer {
            text-align: center;
            padding: 30px;
            color: #94a3b8;
            font-size: 12px;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                border: none;
            }
            .header {
                background: #ffffff !important;
                color: #000000 !important;
                border-bottom: 3px solid #4f46e5;
                padding: 20px 0;
            }
            .header p {
                color: #555;
            }
            .badge {
                border: 1px solid #4f46e5;
                color: #4f46e5;
            }
            .content {
                padding: 20px 0;
            }
            .section-title {
                page-break-inside: avoid;
            }
            .rubrics-table, .eval-comment-box, .comment-item {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <p>Sistema Educativo Distrital - Reporte de Archivo</p>
            <h1>Expediente de Desempeño Docente</h1>
            <div class="badge">Periodo Acumulado 2024 - 2026</div>
        </div>
        <div class="content">
            <div class="teacher-meta-grid">
                <div class="avatar">${teacher.avatar}</div>
                <div class="teacher-info">
                    <h2>${teacher.name}</h2>
                    <p><strong>Nivel Educativo:</strong> ${teacher.level}</p>
                    <p><strong>Grado y Materia:</strong> ${teacher.grade} - ${teacher.subject}</p>
                    <p><strong>Email Institucional:</strong> ${teacher.email || 'N/A'}</p>
                </div>
            </div>

            <div class="stats-highlight">
                <div class="stat-card">
                    <div class="stat-card-title">Promedio de Rúbricas</div>
                    <div class="stat-card-value">${overallAvg > 0 ? overallAvg.toFixed(2) : 'Sin evaluaciones'}</div>
                    <div class="stat-card-subtitle">Escala de 1.0 a 5.0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-title">Evaluaciones Registradas</div>
                    <div class="stat-card-value">${count}</div>
                    <div class="stat-card-subtitle">Comisiones evaluadoras</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-title font-semibold text-sky-800">Buzón de Alumnos</div>
                    <div class="stat-card-value text-sky-600">${teacherComments.length}</div>
                    <div class="stat-card-subtitle">Comentarios anónimos</div>
                </div>
            </div>

            <div class="section-title">Evaluación de Dimensiones (Promedio Acumulado)</div>
            <table class="rubrics-table">
                <thead>
                    <tr>
                        <th style="width: 30%">Dimensión Académica</th>
                        <th style="width: 15%; text-align: center;">Puntuación</th>
                        <th style="width: 55%">Nivel de Logro Alcanzado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Planeación Didáctica</strong></td>
                        <td style="text-align: center;"><span class="score-pill">${avgScores.planeacion > 0 ? avgScores.planeacion.toFixed(1) : 'S/D'}</span></td>
                        <td>${avgScores.planeacion > 0 ? RUBRICS.planeacion.levels[Math.round(avgScores.planeacion) as 1|2|3|4|5].desc : 'Sin datos'}</td>
                    </tr>
                    <tr>
                        <td><strong>Práctica y Didáctica</strong></td>
                        <td style="text-align: center;"><span class="score-pill">${avgScores.pedagogia > 0 ? avgScores.pedagogia.toFixed(1) : 'S/D'}</span></td>
                        <td>${avgScores.pedagogia > 0 ? RUBRICS.pedagogia.levels[Math.round(avgScores.pedagogia) as 1|2|3|4|5].desc : 'Sin datos'}</td>
                    </tr>
                    <tr>
                        <td><strong>Gestión del Aula</strong></td>
                        <td style="text-align: center;"><span class="score-pill">${avgScores.controlGrupo > 0 ? avgScores.controlGrupo.toFixed(1) : 'S/D'}</span></td>
                        <td>${avgScores.controlGrupo > 0 ? RUBRICS.controlGrupo.levels[Math.round(avgScores.controlGrupo) as 1|2|3|4|5].desc : 'Sin datos'}</td>
                    </tr>
                    <tr>
                        <td><strong>Evaluación y Feedback</strong></td>
                        <td style="text-align: center;"><span class="score-pill">${avgScores.evaluacion > 0 ? avgScores.evaluacion.toFixed(1) : 'S/D'}</span></td>
                        <td>${avgScores.evaluacion > 0 ? RUBRICS.evaluacion.levels[Math.round(avgScores.evaluacion) as 1|2|3|4|5].desc : 'Sin datos'}</td>
                    </tr>
                    <tr>
                        <td><strong>Profesionalismo y Ética</strong></td>
                        <td style="text-align: center;"><span class="score-pill">${avgScores.profesionalismo > 0 ? avgScores.profesionalismo.toFixed(1) : 'S/D'}</span></td>
                        <td>${avgScores.profesionalismo > 0 ? RUBRICS.profesionalismo.levels[Math.round(avgScores.profesionalismo) as 1|2|3|4|5].desc : 'Sin datos'}</td>
                    </tr>
                </tbody>
            </table>

            <div class="section-title font-semibold">Bitácora de Observaciones Cualitativas</div>
            ${teacherEvals.length === 0 
                ? '<p style="color: #94a3b8; font-style: italic;">No se han asentado observaciones cualitativas para este docente.</p>'
                : teacherEvals.map(e => `
                    <div class="eval-comment-box">
                        <h5>
                            <strong>Obs. de: ${e.evaluatorName} (${e.role})</strong>
                            <span>Ciclo Escolar: ${e.academicYear} - Fecha: ${formatDate(e.date)}</span>
                        </h5>
                        <p>"${e.comments}"</p>
                    </div>
                `).join('')
            }

            <div class="section-title">Comentarios de Alumnos (Anónimos)</div>
            ${teacherComments.length === 0 
                ? '<p style="color: #94a3b8; font-style: italic;">No se registran comentarios de alumnos en el buzón.</p>'
                : `
                    <div style="margin-top: 10px;">
                        ${teacherComments.map(c => `
                            <div class="comment-item">
                                <div class="comment-meta">
                                    <span>Alumno de ${c.grade} | Clase de ${c.subject}</span>
                                    <span>Valoración: ${'⭐'.repeat(c.rating)} | Fecha: ${formatDate(c.date)}</span>
                                </div>
                                <div class="comment-text">"${c.comment}"</div>
                            </div>
                        `).join('')}
                    </div>
                `
            }
        </div>
        <div class="footer">
            <p>EduEvalúa Web Platform © ${new Date().getFullYear()} - Documento Oficial de Archivo Escolar Público.</p>
            <p>Identificador de Docente Custodiado: ${teacher.id} | Archivo Generado desde Navegador Local.</p>
        </div>
    </div>
</body>
</html>
  `;

  // Create downloadable file blob
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Docente_${teacher.name.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Triggers the local window.print() layout sequence.
 * This utilizes CSS media query rules specified in the application CSS to render a perfect PDF on save.
 */
export const printPDFReport = () => {
  window.print();
};
