/**
 * @file ErrorAnalysisTable.tsx
 * @description Módulo 8: Análisis detallado de errores numéricos por variable (Sección 6.4 y 8 de la consigna).
 * Despliega la tabla interactiva de errores absolutos (Ea), relativos (Er) y porcentuales (Ep).
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ErrorAnalysis } from '../../core/types/solver.types';

interface ErrorAnalysisTableProps {
  errorAnalysis: ErrorAnalysis | null;
  variableNames?: readonly { key: string; name: string }[];
}

export const ErrorAnalysisTable: React.FC<ErrorAnalysisTableProps> = ({
  errorAnalysis,
  variableNames = [
    { key: 'x1', name: 'Infraestructura Cloud' },
    { key: 'x2', name: 'Ciberseguridad' },
    { key: 'x3', name: 'Desarrollo Core' },
    { key: 'x4', name: 'QA y Observabilidad' }
  ]
}) => {
  if (!errorAnalysis) {
    return null;
  }

  const {
    componentErrors,
    maxAbsoluteError,
    maxPercentageError,
    globalRelativeResidual,
    finalResidualNorm
  } = errorAnalysis;

  return (
    <div id="errores" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-700">
            Módulo 8 · Análisis Numérico de Errores y Precisión
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Errores por Componente: GCP vs. Solución de Referencia Exacta
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50/80 text-teal-800 border border-teal-200 font-mono">
            <CheckCircle className="w-3.5 h-3.5" />
            Max Error Abs: {maxAbsoluteError.toExponential(2)} $K
          </span>
        </div>
      </div>

      {/* Tabla Interactiva */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Variable TI</th>
              <th className="py-3.5 px-4 text-right">Referencia x_ref ($K)</th>
              <th className="py-3.5 px-4 text-right">Aproximado x_GCP ($K)</th>
              <th className="py-3.5 px-4 text-right">Error Absoluto (E_a)</th>
              <th className="py-3.5 px-4 text-right">Error Relativo (E_r)</th>
              <th className="py-3.5 px-4 text-right">Error Porcentual (E_p)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white font-mono">
            {componentErrors.map((err, idx) => {
              const label = variableNames[idx]?.name ?? `Variable ${err.variableKey}`;
              const pStr = err.percentageError !== null ? `${err.percentageError.toFixed(6)}%` : 'N/A';
              const rStr = err.relativeError !== null ? err.relativeError.toExponential(4) : 'N/A';

              return (
                <tr key={err.variableKey} className="hover:bg-slate-100/70 transition">
                  <td className="py-3.5 px-4 font-sans font-medium text-slate-800">
                    <span className="font-mono font-bold text-slate-700 mr-2">{err.variableKey}</span>
                    <span className="text-slate-600 text-[11px] hidden sm:inline">({label})</span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-800 font-bold">
                    ${err.xRef.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-teal-800 font-bold">
                    ${err.xApprox.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-700">
                    {err.absoluteError.toExponential(4)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600">
                    {rStr}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-teal-50/80 text-teal-800 border border-teal-200 font-semibold">
                      {pStr}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumen Global de Precisión */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-600 block mb-1">Residuo Relativo Global:</span>
          <span className="text-base font-bold font-mono text-teal-800">
            {globalRelativeResidual.toExponential(4)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">||b - A x_GCP||₂ / ||b||₂</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-600 block mb-1">Norma Euclídea del Residuo:</span>
          <span className="text-base font-bold font-mono text-slate-800">
            {finalResidualNorm.toExponential(4)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">||r_final||₂</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-600 block mb-1">Máximo Error Porcentual:</span>
          <span className="text-base font-bold font-mono text-slate-700">
            {maxPercentageError !== null ? `${maxPercentageError.toFixed(6)}%` : '0.000000%'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">max (E_p,i)</span>
        </div>
      </div>
    </div>
  );
};
