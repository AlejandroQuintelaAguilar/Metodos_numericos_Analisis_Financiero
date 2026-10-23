/**
 * @file DirectSolutionDisplay.tsx
 * @description Módulo 6: Solución numérica de referencia mediante método directo (Factorización de Cholesky A = L*L^T).
 * Despliega el vector solución exacto x_ref, la matriz triangular L y las métricas de exactitud.
 */

import React from 'react';
import { Target, Clock, ShieldCheck } from 'lucide-react';
import { CholeskyFactorizationResult } from '../../core/types/solver.types';

interface DirectSolutionDisplayProps {
  choleskyResult: CholeskyFactorizationResult | null;
  variableKeys?: readonly string[];
}

export const DirectSolutionDisplay: React.FC<DirectSolutionDisplayProps> = ({
  choleskyResult,
  variableKeys = ['x1', 'x2', 'x3', 'x4']
}) => {
  if (!choleskyResult) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 mb-12">
        La solución directa de referencia no pudo ser calculada porque la matriz no es simétrica o no es estrictamente definida positiva.
      </div>
    );
  }

  const { xRef, L, residualNorm, executionTimeMs } = choleskyResult;
  const totalBudget = xRef.reduce((sum, v) => sum + v, 0);

  return (
    <div id="solucion-referencia" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 6 · Solución Numérica de Referencia (Método Directo)
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Factorización de Cholesky (A = L · Lᵀ)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Solución Exacta Clasificada</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700">
            <Clock className="w-3.5 h-3.5" />
            {executionTimeMs.toFixed(3)} ms
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Vector de Referencia x_ref */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Asignaciones Presupuestarias Óptimas (x_ref)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {xRef.map((val, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                <span className="text-[11px] font-mono text-slate-400 block mb-0.5">
                  Variable {variableKeys[idx]}
                </span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {val.toFixed(4)}
                </span>
                <span className="text-[10px] text-slate-500 block font-semibold">$K USD</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Presupuesto Total Optimizado:</span>
            <span className="text-base font-bold font-mono text-white">${totalBudget.toFixed(2)}K USD</span>
          </div>
        </div>

        {/* Matriz Triangular Inferior L */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Matriz Triangular Inferior L (l_ii &gt; 0)</span>
            <span className="text-blue-400 font-mono text-[11px]">A = L · Lᵀ</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner overflow-x-auto">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono min-w-[280px]">
              {L.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`py-2 px-1 rounded ${
                      r === c
                        ? 'bg-blue-950/60 text-blue-300 font-bold border border-blue-800/50'
                        : r > c
                        ? 'bg-slate-900 text-slate-300 border border-slate-800'
                        : 'text-slate-600'
                    }`}
                  >
                    {val.toFixed(3)}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Residuo analítico exacto ||A x_ref - b||₂:</span>
            <span className="font-mono text-emerald-400 font-semibold">{residualNorm.toExponential(4)}</span>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 text-[11px] text-blue-300 leading-relaxed">
        <strong>Nota metodológica oficial (Sección 6.2):</strong> El vector obtenido mediante la Factorización de Cholesky se denomina
        formalmente <em>«Solución numérica de referencia»</em> y clasifica como <em>«Solución exacta»</em> con residuo euclídeo dentro del margen de precisión de la máquina (\(\varepsilon \approx 10^{-16}\)).
      </div>
    </div>
  );
};
