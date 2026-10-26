/**
 * @file ComparativeTable.tsx
 * @description Sección 8 de la consigna oficial: Tabla Comparativa Transversal Obligatoria.
 * Contrasta lado a lado los resultados de los tres escenarios numéricos en todas las métricas exigidas.
 */

import React from 'react';
import { Columns, CheckCircle2 } from 'lucide-react';

export const ComparativeTable: React.FC = () => {
  return (
    <div id="tabla-comparativa" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-700">
            Sección 8 · Matriz Resumen de Evaluación Académica
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Tabla Comparativa Oficial de los Tres Escenarios
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
          <Columns className="w-3.5 h-3.5" />
          <span>Matriz de Desempeño Transversal</span>
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-4 px-4 w-1/4">Indicador de Desempeño</th>
              <th className="py-4 px-4 w-1/4 text-teal-800">Escenario 1 (Ideal)</th>
              <th className="py-4 px-4 w-1/4 text-amber-800">Escenario 2 (Bajo Estrés)</th>
              <th className="py-4 px-4 w-1/4 text-rose-800">Escenario 3 (Mal Condicionado)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {/* Solución de Referencia */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                Solución Numérica de Referencia [x*]
              </td>
              <td className="py-3 px-4 font-mono font-bold text-teal-800">
                [25.0, 10.0, 35.0, 12.0]
              </td>
              <td className="py-3 px-4 font-mono font-bold text-amber-800">
                [40.0, 20.0, 30.0, 5.0]
              </td>
              <td className="py-3 px-4 font-mono font-bold text-rose-800">
                [25.0, 15.0, 30.0, 40.0]
              </td>
            </tr>

            {/* Solución GCP */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                Solución GCP (Suñagua 2020)
              </td>
              <td className="py-3 px-4 font-mono text-slate-700">
                [25.0, 10.0, 35.0, 12.0]
              </td>
              <td className="py-3 px-4 font-mono text-slate-700">
                [40.0, 20.0, 30.0, 5.0]
              </td>
              <td className="py-3 px-4 font-mono text-slate-700">
                [25.0, 15.0, 30.0, 40.0]
              </td>
            </tr>

            {/* Error Absoluto Por Variable */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800 align-top">
                Error Absoluto por Variable (E_a,i)
              </td>
              <td className="py-3 px-4 font-mono text-slate-600 text-[11px] space-y-0.5">
                <div>x₁: 0.00 × 10⁰ | x₂: 1.78 × 10⁻¹⁵</div>
                <div>x₃: 7.11 × 10⁻¹⁵ | x₄: 1.78 × 10⁻¹⁵</div>
              </td>
              <td className="py-3 px-4 font-mono text-slate-600 text-[11px] space-y-0.5">
                <div>x₁: 7.11 × 10⁻¹⁵ | x₂: 3.55 × 10⁻¹⁵</div>
                <div>x₃: 0.00 × 10⁰ | x₄: 1.78 × 10⁻¹⁵</div>
              </td>
              <td className="py-3 px-4 font-mono text-slate-600 text-[11px] space-y-0.5">
                <div>x₁: 3.55 × 10⁻¹⁵ | x₂: 1.78 × 10⁻¹⁵</div>
                <div>x₃: 7.11 × 10⁻¹⁵ | x₄: 2.13 × 10⁻¹⁴</div>
              </td>
            </tr>

            {/* Error Porcentual Por Variable */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800 align-top">
                Error Porcentual por Variable (E_p,i)
              </td>
              <td className="py-3 px-4 font-mono text-teal-800 font-semibold text-[11px] space-y-0.5">
                <div>x₁: 0.000000% | x₂: 0.000000%</div>
                <div>x₃: 0.000000% | x₄: 0.000000%</div>
              </td>
              <td className="py-3 px-4 font-mono text-teal-800 font-semibold text-[11px] space-y-0.5">
                <div>x₁: 0.000000% | x₂: 0.000000%</div>
                <div>x₃: 0.000000% | x₄: 0.000000%</div>
              </td>
              <td className="py-3 px-4 font-mono text-teal-800 font-semibold text-[11px] space-y-0.5">
                <div>x₁: 0.000000% | x₂: 0.000000%</div>
                <div>x₃: 0.000000% | x₄: 0.000000%</div>
              </td>
            </tr>

            {/* Iteraciones GC */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                Iteraciones GC (Sin Precondicionar)
              </td>
              <td className="py-3 px-4 font-mono text-amber-800">
                4 iteraciones
              </td>
              <td className="py-3 px-4 font-mono text-amber-800">
                4 iteraciones
              </td>
              <td className="py-3 px-4 font-mono text-amber-800">
                4 iteraciones
              </td>
            </tr>

            {/* Iteraciones GCP */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                Iteraciones GCP (Precondicionado)
              </td>
              <td className="py-3 px-4 font-mono font-bold text-teal-800">
                4 iters (Jacobi) / 1 (IC₀)
              </td>
              <td className="py-3 px-4 font-mono font-bold text-teal-800">
                4 iters (Jacobi) / 1 (IC₀)
              </td>
              <td className="py-3 px-4 font-mono font-bold text-teal-800">
                4 iters (Jacobi) / 1 (IC₀)
              </td>
            </tr>

            {/* Número de Condición Original */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                Número de Condición Original κ(A)
              </td>
              <td className="py-3 px-4 font-mono text-slate-700">
                2.71 (&lt; 15)
              </td>
              <td className="py-3 px-4 font-mono text-slate-700">
                3.40 (&lt; 15)
              </td>
              <td className="py-3 px-4 font-mono text-rose-800 font-bold">
                1477.17 (≫ 10³)
              </td>
            </tr>

            {/* Condición Precondicionada */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                Condición Precondicionada κ(M⁻¹A)
              </td>
              <td className="py-3 px-4 font-mono text-slate-700">
                2.36 (Jacobi)
              </td>
              <td className="py-3 px-4 font-mono text-slate-700">
                3.13 (Jacobi)
              </td>
              <td className="py-3 px-4 font-mono text-teal-800 font-bold">
                2.55 (Reducción 580x)
              </td>
            </tr>

            {/* Residuo Relativo Final */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                Residuo Relativo Final GCP
              </td>
              <td className="py-3 px-4 font-mono text-slate-600">
                1.21 × 10⁻¹⁶
              </td>
              <td className="py-3 px-4 font-mono text-slate-600">
                5.55 × 10⁻¹⁷
              </td>
              <td className="py-3 px-4 font-mono text-slate-600">
                7.23 × 10⁻¹⁹
              </td>
            </tr>

            {/* ¿Convergió? */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800">
                ¿Convergió el algoritmo?
              </td>
              <td className="py-3 px-4 font-semibold text-teal-800">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SÍ (Tol &lt; 10⁻⁶)
                </span>
              </td>
              <td className="py-3 px-4 font-semibold text-teal-800">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SÍ (Tol &lt; 10⁻⁶)
                </span>
              </td>
              <td className="py-3 px-4 font-semibold text-teal-800">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SÍ (Tol &lt; 10⁻⁶)
                </span>
              </td>
            </tr>

            {/* Interpretación Financiera Cualitativa */}
            <tr className="hover:bg-slate-100/60 transition">
              <td className="py-3 px-4 font-semibold text-slate-800 align-top">
                Interpretación Financiera Cualitativa
              </td>
              <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                Asignación balanceada ($82K USD total), interfaces desacopladas y costo mínimo de coordinación operativa.
              </td>
              <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                Rebalanceo por shock de nube y ciberseguridad ($95K USD total), absorbiendo sobrecostos sin desestabilizar la operación.
              </td>
              <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                Disparidad extrema de costes entre infraestructura y QA ($110K USD); el precondicionador normaliza la rigidez de escala.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
