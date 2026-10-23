/**
 * @file MathFormulationSection.tsx
 * @description Módulo 3 (Formulación Matemática): Modelo de optimización cuadrática,
 * verificación interactiva de simetría y Criterio de Sylvester para la matriz activa.
 */

import React from 'react';
import { CheckCircle, AlertTriangle, FunctionSquare, Binary } from 'lucide-react';
import { MathBlock } from './MathBlock';
import { MatrixValidationResult } from '../../qa/types/qa.types';

interface MathFormulationProps {
  validation: MatrixValidationResult;
}

export const MathFormulationSection: React.FC<MathFormulationProps> = ({ validation }) => {
  return (
    <section id="formulacion" className="py-16 border-b border-slate-800 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 3 · Formulación Matemática Rigurosa
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Minimización Cuadrática y Criterio de Sylvester
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            El equilibrio óptimo de asignación presupuestaria minimiza la fricción cuadrática neta. 
            Al ser la matriz A Simétrica y Estrictamente Definida Positiva (SPD), la solución es única.
          </p>
        </div>

        {/* Modelo Cuadrático */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <FunctionSquare className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Función Objetivo Cuadrática Convexa</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              La optimización equilibra el beneficio marginal lineal directo con los costos de coordinación cuadráticos:
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center mb-4">
              <MathBlock math="\min_{x \in \mathbb{R}^4} \Phi(x) = \frac{1}{2} x^T A x - b^T x" block={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Condición necesaria y suficiente de primer orden (gradiente nulo):
            </p>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-center mt-2">
              <MathBlock math="\nabla \Phi(x) = A x - b = 0 \quad \Longleftrightarrow \quad A x = b" block={false} />
            </div>
          </div>

          {/* Criterio de Sylvester */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Binary className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Criterio de Sylvester (Certificación SPD)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Una matriz simétrica A es estrictamente definida positiva si y solo si todos sus 
              menores principales dominantes son positivos:
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center mb-4">
              <MathBlock math="\Delta_k = \det(A_{1:k, 1:k}) > 0, \quad \forall k \in \{1, 2, 3, 4\}" block={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Garantiza que la Hessiana <MathBlock math="\nabla^2 \Phi(x) = A > 0" /> sea estrictamente convexa, 
              asegurando que el mínimo sea global y único.
            </p>
          </div>
        </div>

        {/* Verificación Dinámica de la Matriz Cargada */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Verificación Matemática en Tiempo Real de la Matriz Activa
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Evaluación continua de simetría y menores de Sylvester sobre los coeficientes actuales
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                validation.isSymmetric
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'bg-red-950/80 text-red-300 border border-red-800/60'
              }`}>
                {validation.isSymmetric ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {validation.isSymmetric ? 'Simétrica (A = Aᵀ)' : 'No Simétrica'}
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                validation.isPositiveDefinite
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'bg-red-950/80 text-red-300 border border-red-800/60'
              }`}>
                {validation.isPositiveDefinite ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {validation.isPositiveDefinite ? 'Definida Positiva (SPD)' : 'No SPD'}
              </span>
            </div>
          </div>

          {/* Menores Principales Dominantes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {validation.sylvesterMinors.length > 0 ? (
              validation.sylvesterMinors.map((minor, idx) => {
                const k = idx + 1;
                const isPositive = minor > 0;
                return (
                  <div
                    key={k}
                    className={`p-4 rounded-xl border text-center transition ${
                      isPositive
                        ? 'bg-slate-950/80 border-slate-800'
                        : 'bg-red-950/40 border-red-800/60'
                    }`}
                  >
                    <span className="text-xs font-mono font-medium text-slate-400 block mb-1">
                      Menor Dominante Δ_{k}
                    </span>
                    <span className={`text-lg font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {minor.toFixed(4)}
                    </span>
                    <span className="text-[10px] block mt-1 font-semibold text-slate-500 uppercase">
                      {isPositive ? 'Δ > 0 (Aprobado)' : 'Δ ≤ 0 (Fallo SPD)'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 p-4 text-center text-xs text-slate-400">
                La matriz actual no tiene menores dominantes calculables debido a inconsistencias de dimensión.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
