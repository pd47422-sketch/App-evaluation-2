/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RubricCategory } from '../types';
import { RUBRICS } from '../data/presets';

interface MetricChartProps {
  teacherId: string;
  evaluations: any[];
}

export default function MetricChart({ teacherId, evaluations }: MetricChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ category: string; value: number; year: string; x: number; y: number } | null>(null);

  // Group evaluations by year for this teacher
  const teacherEvals = evaluations.filter(e => e.teacherId === teacherId);

  const years = ['2024', '2025', '2026'];
  const categories: { key: RubricCategory; label: string; color: string }[] = [
    { key: 'planeacion', label: 'Planeación', color: 'bg-blue-500' },
    { key: 'pedagogia', label: 'Pedagogía', color: 'bg-emerald-500' },
    { key: 'controlGrupo', label: 'Gestión', color: 'bg-indigo-500' },
    { key: 'evaluacion', label: 'Evaluación', color: 'bg-amber-500' },
    { key: 'profesionalismo', label: 'Profesores', color: 'bg-rose-500' }
  ];

  // Calculate year averages
  const yearAverages = years.map(year => {
    const evalsOfYear = teacherEvals.filter(e => e.academicYear === year);
    if (evalsOfYear.length === 0) return { year, avg: 0, scores: { planeacion: 0, pedagogia: 0, controlGrupo: 0, evaluacion: 0, profesionalismo: 0 } };

    const totals = { planeacion: 0, pedagogia: 0, controlGrupo: 0, evaluacion: 0, profesionalismo: 0 };
    evalsOfYear.forEach(e => {
      totals.planeacion += e.scores.planeacion || 0;
      totals.pedagogia += e.scores.pedagogia || 0;
      totals.controlGrupo += e.scores.controlGrupo || 0;
      totals.evaluacion += e.scores.evaluacion || 0;
      totals.profesionalismo += e.scores.profesionalismo || 0;
    });

    const count = evalsOfYear.length;
    const scoresAvg = {
      planeacion: Math.round((totals.planeacion / count) * 10) / 10,
      pedagogia: Math.round((totals.pedagogia / count) * 10) / 10,
      controlGrupo: Math.round((totals.controlGrupo / count) * 10) / 10,
      evaluacion: Math.round((totals.evaluacion / count) * 10) / 10,
      profesionalismo: Math.round((totals.profesionalismo / count) * 10) / 10,
    };

    const overallAvg = Math.round(((scoresAvg.planeacion + scoresAvg.pedagogia + scoresAvg.controlGrupo + scoresAvg.evaluacion + scoresAvg.profesionalismo) / 5) * 10) / 10;

    return { year, avg: overallAvg, scores: scoresAvg };
  });

  // Calculate coordinates for comparative bar chart (categories on X axis, years side-by-side)
  // Chart width 600, height 260
  const chartHeight = 200;
  const chartWidth = 500;
  const paddingX = 60;
  const paddingY = 30;

  // Render SVG bars for comparison
  const categorySpacing = (chartWidth - paddingX * 2) / categories.length;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      {/* Overview Stat Ring Cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 tracking-tight">Desempeño Promedio Anual (Sobre 5.0)</h3>
        <div className="grid grid-cols-3 gap-3">
          {yearAverages.map((y) => (
            <div key={y.year} className={`p-3.5 rounded-xl border transition-all duration-200 ${y.avg > 0 ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-50/20 border-slate-100 border-dashed'}`}>
              <div className="text-xs font-medium text-slate-500 mb-1">{y.year}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-800">{y.avg > 0 ? y.avg.toFixed(1) : 'N/A'}</span>
                {y.avg > 0 && <span className="text-[10px] text-slate-400">pts</span>}
              </div>
              {/* Simple inline progress indicator bar */}
              <div className="mt-2 w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    y.avg >= 4.5 ? 'bg-emerald-500' :
                    y.avg >= 3.8 ? 'bg-indigo-500' :
                    y.avg >= 3.0 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${(y.avg / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main SVG Chart Area */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Comparativa Anual de Rúbricas</h4>
          {/* Custom Legends Key */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="inline-block h-2.5 w-2.5 rounded bg-sky-200" />
              <span>2024</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="inline-block h-2.5 w-2.5 rounded bg-indigo-300" />
              <span>2025</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="inline-block h-2.5 w-2.5 rounded bg-indigo-600" />
              <span>2026</span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto select-none">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + paddingY * 2}`} className="w-full min-w-[450px] overflow-visible">
            {/* Grid Lines */}
            {[1, 2, 3, 4, 5].map((val) => {
              const yPos = chartHeight + paddingY - (val * (chartHeight / 5));
              return (
                <g key={val} className="opacity-40">
                  <line 
                    x1={paddingX} 
                    y1={yPos} 
                    x2={chartWidth - paddingX / 2} 
                    y2={yPos} 
                    stroke="#E2E8F0" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={paddingX - 12} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    className="font-mono text-[10px] font-semibold text-slate-400"
                  >
                    {val}.0
                  </text>
                </g>
              );
            })}

            {/* Base Horizontal Zero Line */}
            <line 
              x1={paddingX} 
              y1={chartHeight + paddingY} 
              x2={chartWidth - paddingX / 2} 
              y2={chartHeight + paddingY} 
              stroke="#CBD5E1" 
              strokeWidth="1.5"
            />

            {/* Render bars for each category */}
            {categories.map((cat, catIdx) => {
              const categoryCenterX = paddingX + (catIdx * categorySpacing) + (categorySpacing / 2);
              const barWidth = 12;
              const barGroupWidth = barWidth * 3 + 4; // Width of 3 bars + custom spacing between years

              return (
                <g key={cat.key}>
                  {/* Category Axis Labels */}
                  <text
                    x={categoryCenterX}
                    y={chartHeight + paddingY + 20}
                    textAnchor="middle"
                    className="font-sans text-[10.5px] font-medium text-slate-600"
                  >
                    {cat.label}
                  </text>

                  {/* 2024 Bar */}
                  {(() => {
                    const yearData = yearAverages.find(y => y.year === '2024');
                    const score = yearData?.scores[cat.key] || 0;
                    const valHeight = (score / 5) * chartHeight;
                    const barX = categoryCenterX - barGroupWidth / 2;
                    const barY = chartHeight + paddingY - valHeight;

                    return score > 0 ? (
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={valHeight}
                        rx="2"
                        className="fill-sky-200 hover:fill-sky-300 transition-colors cursor-pointer"
                        onMouseEnter={(e) => setHoveredBar({ category: cat.label, value: score, year: '2024', x: barX + barWidth/2, y: barY })}
                        onMouseLeave={() => setHoveredBar(null)}
                      />
                    ) : null;
                  })()}

                  {/* 2025 Bar */}
                  {(() => {
                    const yearData = yearAverages.find(y => y.year === '2025');
                    const score = yearData?.scores[cat.key] || 0;
                    const valHeight = (score / 5) * chartHeight;
                    const barX = categoryCenterX - barGroupWidth / 2 + barWidth + 2;
                    const barY = chartHeight + paddingY - valHeight;

                    return score > 0 ? (
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={valHeight}
                        rx="2"
                        className="fill-indigo-300 hover:fill-indigo-400 transition-colors cursor-pointer"
                        onMouseEnter={(e) => setHoveredBar({ category: cat.label, value: score, year: '2025', x: barX + barWidth/2, y: barY })}
                        onMouseLeave={() => setHoveredBar(null)}
                      />
                    ) : null;
                  })()}

                  {/* 2026 Bar */}
                  {(() => {
                    const yearData = yearAverages.find(y => y.year === '2026');
                    const score = yearData?.scores[cat.key] || 0;
                    const valHeight = (score / 5) * chartHeight;
                    const barX = categoryCenterX - barGroupWidth / 2 + (barWidth + 2) * 2;
                    const barY = chartHeight + paddingY - valHeight;

                    return score > 0 ? (
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={valHeight}
                        rx="2"
                        className="fill-indigo-600 hover:fill-indigo-700 transition-colors cursor-pointer"
                        onMouseEnter={(e) => setHoveredBar({ category: cat.label, value: score, year: '2026', x: barX + barWidth/2, y: barY })}
                        onMouseLeave={() => setHoveredBar(null)}
                      />
                    ) : null;
                  })()}
                </g>
              );
            })}

            {/* Hover Tooltip Render */}
            {hoveredBar && (
              <g className="filter drop-shadow-md">
                {/* Background Box */}
                <rect
                  x={hoveredBar.x - 55}
                  y={hoveredBar.y - 38}
                  width="110"
                  height="32"
                  rx="6"
                  fill="#1E293B"
                />
                {/* Text Indicator */}
                <text
                  x={hoveredBar.x}
                  y={hoveredBar.y - 25}
                  textAnchor="middle"
                  fill="#FFF"
                  className="font-sans text-[10px] font-bold"
                >
                  {hoveredBar.year}: {hoveredBar.value.toFixed(1)} pts
                </text>
                <text
                  x={hoveredBar.x}
                  y={hoveredBar.y - 14}
                  textAnchor="middle"
                  fill="#94A3B8"
                  className="font-sans text-[8px]"
                >
                  {hoveredBar.category}
                </text>
                {/* Tooltip Anchor arrow */}
                <polygon
                  points={`${hoveredBar.x - 4},${hoveredBar.y - 6} ${hoveredBar.x + 4},${hoveredBar.y - 6} ${hoveredBar.x},${hoveredBar.y - 2}`}
                  fill="#1E293B"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Mini Insights section */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 mb-1">Tendencia de Desempeño</h4>
        {(() => {
          let hasEvals = yearAverages.some(y => y.avg > 0);
          if (!hasEvals) {
            return <p className="text-xs text-slate-500">Aún no hay suficientes datos históricos cargados para este docente.</p>;
          }

          const validAverages = yearAverages.filter(y => y.avg > 0);
          if (validAverages.length >= 2) {
            const currentAvg = validAverages[validAverages.length - 1].avg;
            const pastAvg = validAverages[validAverages.length - 2].avg;
            const diff = currentAvg - pastAvg;
            const roundedDiff = Math.abs(diff).toFixed(1);

            if (diff > 0.1) {
              return (
                <p className="text-xs text-slate-600">
                  📈 <strong className="text-emerald-700 font-semibold">Crecimiento formativo positivo:</strong> El docente muestra un incremento de <span className="font-bold">+{roundedDiff} puntos</span> de promedio general con respecto al año anterior, destacando la continua capacitación y maduración de prácticas áulicas.
                </p>
              );
            } else if (diff < -0.1) {
              return (
                <p className="text-xs text-slate-600">
                  📉 <strong className="text-rose-700 font-semibold">Alerta de decrecimiento:</strong> Hay un decremento de <span className="font-bold">-{roundedDiff} puntos</span> acumulados en las dimensiones de evaluación. Se aconseja agendar una mentoría y revisar de cerca la dimensión de menor puntaje.
                </p>
              );
            } else {
              return (
                <p className="text-xs text-slate-600">
                  ⚖️ <strong className="text-indigo-700 font-semibold">Desempeño estable:</strong> El docente mantiene una consistencia sólida y equilibrada en sus puntuaciones, rondando un promedio estable con variación imperceptible.
                </p>
              );
            }
          }
          return <p className="text-xs text-slate-500">Muestra estabilidad. Registre evaluaciones para más periodos para obtener gráficos temporales comparativos detallados.</p>;
        })()}
      </div>
    </div>
  );
}
