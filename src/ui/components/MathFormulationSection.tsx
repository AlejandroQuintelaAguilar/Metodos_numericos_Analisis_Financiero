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
  matrixA: number[][];
  vectorB: number[];
}

export const MathFormulationSection: React.FC<MathFormulationProps> = ({
  validation,
  matrixA,
  vectorB
}) => {
  return (
    <section id="formulacion" className="py-16 border-b border-slate-800 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 3 · Formulación Matemática Rigurosa (Secciones 6.1 y 7.3)
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Definición de Variables, Sistema Lineal Ax = b y Criterio de Sylvester
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            El equilibrio óptimo de asignación presupuestaria minimiza la fricción cuadrática neta. 
            Al ser la matriz A Simétrica y Estrictamente Definida Positiva (SPD), la solución es única.
          </p>
        </div>

        {/* Definición Explícita de Variables (n=4), Sistema Lineal Ax=b e Interpretación de a_ij */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Definición Explícita de Variables e Interpretación de Coeficientes */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400">
              1. Definición Explícita de Variables (n = 4) e Interpretación de Coeficientes a_ij
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <li><strong className="text-blue-400">x₁ ∈ ℝ⁺:</strong> Presupuesto Infraestructura Cloud &amp; DevOps ($K USD)</li>
              <li><strong className="text-red-400">x₂ ∈ ℝ⁺:</strong> Presupuesto Ciberseguridad &amp; Auditoría ($K USD)</li>
              <li><strong className="text-amber-400">x₃ ∈ ℝ⁺:</strong> Presupuesto Ingeniería de Software Core ($K USD)</li>
              <li><strong className="text-emerald-400">x₄ ∈ ℝ⁺:</strong> Presupuesto QA, Testing &amp; Observabilidad ($K USD)</li>
            </ul>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong className="text-indigo-300">Coeficientes Diagonales (a_ii &gt; 0):</strong> Representan el costo marginal cuadrático de congestión o rigidez interna propia del departamento <em>i</em>.
              </p>
              <p>
                <strong className="text-cyan-300">Coeficientes Cruzados (a_ij = a_ji):</strong> Cuantifican la interdependencia simétrica de recursos entre los departamentos <em>i</em> y <em>j</em> (fricción de sincronización interdepartamental).
              </p>
            </div>
          </div>

          {/* Sistema Lineal Desarrollado Ax = b */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
                2. Sistema de Ecuaciones Lineales Explícito (Ax = b)
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Representación algebraica en tiempo real de las 4 ecuaciones simultáneas activas en memoria:
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 overflow-x-auto">
                {matrixA.map((row, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-slate-200 whitespace-nowrap">
                    <span>
                      <span className="text-slate-500 mr-2">Ec. {i + 1}:</span>
                      {row.map((coef, j) => {
                        const sign = j === 0 ? '' : coef >= 0 ? ' + ' : ' - ';
                        const absVal = j === 0 ? coef.toFixed(2) : Math.abs(coef).toFixed(2);
                        return (
                          <span key={j}>
                            {sign}
                            <strong className={i === j ? 'text-blue-300' : 'text-slate-300'}>{absVal}</strong>
                            <span className="text-indigo-400">·x_{j + 1}</span>
                          </span>
                        );
                      })}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      = {vectorB[i]?.toFixed(2)} $K
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Forma Matricial Compacta: <strong className="text-slate-200 font-mono">A ∈ ℝ⁴ˣ⁴, x ∈ ℝ⁴, b ∈ ℝ⁴</strong></span>
              <span className="text-blue-300 font-mono">∇Φ(x) = Ax - b = 0</span>
            </div>
          </div>
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
