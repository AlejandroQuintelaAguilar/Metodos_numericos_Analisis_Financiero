/**
 * @file ComparativeTable.tsx
 * @description Sección 8 de la consigna oficial: Tabla Comparativa Transversal Obligatoria.
 * Contrasta lado a lado los resultados de los tres escenarios numéricos en todas las métricas exigidas.
 */

import React from 'react';
import { Columns, CheckCircle2 } from 'lucide-react';

export const ComparativeTable: React.FC = () => {
  return (
    <div id="tabla-comparativa" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Sección 8 · Matriz Resumen de Evaluación Académica
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Tabla Comparativa Oficial de los Tres Escenarios
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
          <Columns className="w-3.5 h-3.5" />
          <span>Matriz de Desempeño Transversal</span>
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-4 px-4 w-1/4">Indicador de Desempeño</th>
              <th className="py-4 px-4 w-1/4 text-emerald-400">Escenario 1 (Ideal)</th>
              <th className="py-4 px-4 w-1/4 text-amber-400">Escenario 2 (Bajo Estrés)</th>
              <th className="py-4 px-4 w-1/4 text-rose-400">Escenario 3 (Mal Condicionado)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 bg-slate-900/50">
            {/* Solución de Referencia */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Solución Numérica de Referencia [x*]
              </td>
              <td className="py-3 px-4 font-mono font-bold text-emerald-300">
                [25.0, 10.0, 35.0, 12.0]
              </td>
              <td className="py-3 px-4 font-mono font-bold text-amber-300">
                [40.0, 20.0, 30.0, 5.0]
              </td>
              <td className="py-3 px-4 font-mono font-bold text-rose-300">
                [25.0, 15.0, 30.0, 40.0]
              </td>
            </tr>

            {/* Solución GCP */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Solución GCP (Suñagua 2020)
              </td>
              <td className="py-3 px-4 font-mono text-slate-300">
                [25.0, 10.0, 35.0, 12.0]
              </td>
              <td className="py-3 px-4 font-mono text-slate-300">
                [40.0, 20.0, 30.0, 5.0]
              </td>
              <td className="py-3 px-4 font-mono text-slate-300">
                [25.0, 15.0, 30.0, 40.0]
              </td>
            </tr>

            {/* Max Error Absoluto */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Error Absoluto Máximo (E_a)
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">
                7.11 × 10⁻¹⁵ $K
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">
                7.11 × 10⁻¹⁵ $K
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">
                2.13 × 10⁻¹⁴ $K
              </td>
            </tr>

            {/* Error Porcentual */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Error Porcentual Máximo (E_p)
              </td>
              <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                0.000000%
              </td>
              <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                0.000000%
              </td>
              <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                0.000000%
              </td>
            </tr>

            {/* Iteraciones GC */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Iteraciones GC (Sin Precondicionar)
              </td>
              <td className="py-3 px-4 font-mono text-amber-300">
                4 iteraciones
              </td>
              <td className="py-3 px-4 font-mono text-amber-300">
                4 iteraciones
              </td>
              <td className="py-3 px-4 font-mono text-amber-300">
                4 iteraciones
              </td>
            </tr>

            {/* Iteraciones GCP */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Iteraciones GCP (Precondicionado)
              </td>
              <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                4 iters (Jacobi) / 1 (IC₀)
              </td>
              <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                4 iters (Jacobi) / 1 (IC₀)
              </td>
              <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                4 iters (Jacobi) / 1 (IC₀)
              </td>
            </tr>

            {/* Número de Condición Original */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Número de Condición Original κ(A)
              </td>
              <td className="py-3 px-4 font-mono text-slate-300">
                2.71 (&lt; 15)
              </td>
              <td className="py-3 px-4 font-mono text-slate-300">
                3.40 (&lt; 15)
              </td>
              <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                1477.17 (≫ 10³)
              </td>
            </tr>

            {/* Condición Precondicionada */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Condición Precondicionada κ(M⁻¹A)
              </td>
              <td className="py-3 px-4 font-mono text-slate-300">
                2.36 (Jacobi)
              </td>
              <td className="py-3 px-4 font-mono text-slate-300">
                3.13 (Jacobi)
              </td>
              <td className="py-3 px-4 font-mono text-emerald-300 font-bold">
                2.55 (Reducción 580x)
              </td>
            </tr>

            {/* Residuo Relativo Final */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                Residuo Relativo Final GCP
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">
                1.21 × 10⁻¹⁶
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">
                5.55 × 10⁻¹⁷
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">
                7.23 × 10⁻¹⁹
              </td>
            </tr>

            {/* ¿Convergió? */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200">
                ¿Convergió el algoritmo?
              </td>
              <td className="py-3 px-4 font-semibold text-emerald-400">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SÍ (Tol &lt; 10⁻⁶)
                </span>
              </td>
              <td className="py-3 px-4 font-semibold text-emerald-400">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SÍ (Tol &lt; 10⁻⁶)
                </span>
              </td>
              <td className="py-3 px-4 font-semibold text-emerald-400">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SÍ (Tol &lt; 10⁻⁶)
                </span>
              </td>
            </tr>

            {/* Interpretación Financiera Cualitativa */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3 px-4 font-semibold text-slate-200 align-top">
                Interpretación Financiera Cualitativa
              </td>
              <td className="py-3 px-4 text-slate-400 text-[11px] leading-relaxed">
                Asignación balanceada ($82K USD total), interfaces desacopladas y costo mínimo de coordinación operativa.
              </td>
              <td className="py-3 px-4 text-slate-400 text-[11px] leading-relaxed">
                Rebalanceo por shock de nube y ciberseguridad ($95K USD total), absorbiendo sobrecostos sin desestabilizar la operación.
              </td>
              <td className="py-3 px-4 text-slate-400 text-[11px] leading-relaxed">
                Disparidad extrema de costes entre infraestructura y QA ($110K USD); el precondicionador normaliza la rigidez de escala.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
