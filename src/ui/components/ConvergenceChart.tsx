/**
 * @file ConvergenceChart.tsx
 * @description Gráfica interactiva de convergencia semilogarítmica en SVG nativo:
 * log10(||r_k||_2 / ||b||_2) vs. número de iteración k para contrastar GC vs. GCP.
 */

import React, { useState } from 'react';
import { IterationStep } from '../../core/types/solver.types';

interface ConvergenceChartProps {
  gcHistory: readonly IterationStep[];
  gcpHistory: readonly IterationStep[];
  tolerance?: number;
}

export const ConvergenceChart: React.FC<ConvergenceChartProps> = ({
  gcHistory,
  gcpHistory,
  tolerance = 1e-6
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    method: 'GC' | 'GCP';
    step: IterationStep;
    x: number;
    y: number;
  } | null>(null);

  // Dimensiones del gráfico SVG
  const width = 640;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 45, left: 65 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Rango de iteraciones
  const maxK = Math.max(
    1,
    ...gcHistory.map(h => h.iteration),
    ...gcpHistory.map(h => h.iteration)
  );

  // Escala Logarítmica: log10(relativeResidual)
  // Rango típico: de 0 (residuo relativo 1.0) a -16 (precisión de máquina)
  const minLog = -16;
  const maxLog = 0.5;

  const getX = (k: number) => padding.left + (k / maxK) * chartW;
  const getY = (relRes: number) => {
    const logVal = Math.max(minLog, Math.min(maxLog, Math.log10(Math.max(1e-19, relRes))));
    const ratio = (logVal - minLog) / (maxLog - minLog);
    return padding.top + (1 - ratio) * chartH;
  };

  // Puntos para líneas
  const makePath = (history: readonly IterationStep[]) => {
    if (history.length === 0) return '';
    return history
      .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(h.iteration)} ${getY(h.relativeResidual)}`)
      .join(' ');
  };

  const pathGC = makePath(gcHistory);
  const pathGCP = makePath(gcpHistory);
  const yTol = getY(tolerance);

  // Marcas de eje Y
  const yTicks = [0, -2, -4, -6, -8, -10, -12, -14, -16];

  return (
    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Curva de Descenso Residual Semilogarítmica
          </h4>
          <span className="text-[11px] text-slate-400">log₁₀(||r_k||₂ / ||b||₂) vs. Iteración k</span>
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 inline-block rounded" />
            <span className="text-amber-300">GC Simple</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" />
            <span className="text-emerald-300">GCP (Suñagua)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-red-400 inline-block" />
            <span className="text-red-300 font-mono text-[10px]">Tol = 10⁻⁶</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] overflow-visible"
        >
          {/* Grilla y Ejes */}
          {yTicks.map(tick => {
            const yPos = getY(Math.pow(10, tick));
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={width - padding.right}
                  y2={yPos}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={yPos + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  10^{tick}
                </text>
              </g>
            );
          })}

          {/* Línea horizontal de tolerancia (10^-6) */}
          <line
            x1={padding.left}
            y1={yTol}
            x2={width - padding.right}
            y2={yTol}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right}
            y={yTol - 6}
            textAnchor="end"
            fill="#ef4444"
            fontSize="9"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            Umbral 10⁻⁶
          </text>

          {/* Marcas de eje X (Iteraciones) */}
          {Array.from({ length: maxK + 1 }, (_, i) => i).map(k => {
            const xPos = getX(k);
            return (
              <g key={k}>
                <line
                  x1={xPos}
                  y1={height - padding.bottom}
                  x2={xPos}
                  y2={height - padding.bottom + 5}
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text
                  x={xPos}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  k={k}
                </text>
              </g>
            );
          })}

          {/* Línea de GC Simple */}
          <path
            d={pathGC}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Línea de GCP Precondicionado */}
          <path
            d={pathGCP}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos interactivos GC */}
          {gcHistory.map((h, i) => (
            <circle
              key={`gc-${i}`}
              cx={getX(h.iteration)}
              cy={getY(h.relativeResidual)}
              r="4.5"
              fill="#f59e0b"
              stroke="#0f172a"
              strokeWidth="1.5"
              className="cursor-pointer hover:r-6 transition-all"
              onMouseEnter={() =>
                setHoveredPoint({
                  method: 'GC',
                  step: h,
                  x: getX(h.iteration),
                  y: getY(h.relativeResidual)
                })
              }
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Puntos interactivos GCP */}
          {gcpHistory.map((h, i) => (
            <circle
              key={`gcp-${i}`}
              cx={getX(h.iteration)}
              cy={getY(h.relativeResidual)}
              r="4.5"
              fill="#10b981"
              stroke="#0f172a"
              strokeWidth="1.5"
              className="cursor-pointer hover:r-6 transition-all"
              onMouseEnter={() =>
                setHoveredPoint({
                  method: 'GCP',
                  step: h,
                  x: getX(h.iteration),
                  y: getY(h.relativeResidual)
                })
              }
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Tooltip flotante */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-lg bg-slate-900 border border-slate-700 shadow-xl text-xs font-mono text-slate-200"
            style={{
              left: `${Math.min(chartW, Math.max(10, hoveredPoint.x - 70))}px`,
              top: `${Math.max(10, hoveredPoint.y - 85)}px`
            }}
          >
            <div className="font-bold flex items-center justify-between gap-2 border-b border-slate-800 pb-1 mb-1">
              <span className={hoveredPoint.method === 'GCP' ? 'text-emerald-400' : 'text-amber-400'}>
                {hoveredPoint.method} · Paso k = {hoveredPoint.step.iteration}
              </span>
            </div>
            <div>Residuo Rel: {hoveredPoint.step.relativeResidual.toExponential(3)}</div>
            <div>Norma ||r_k||₂: {hoveredPoint.step.residualNorm.toExponential(3)}</div>
            <div>Paso α_k: {hoveredPoint.step.alpha.toFixed(5)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
