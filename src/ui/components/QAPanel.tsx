/**
 * @file QAPanel.tsx
 * @description Módulo 9: Panel interactivo de Pruebas de Software Automatizadas (Módulo QA - Sección 9).
 * Permite ejecutar en vivo el QAEngine y renderizar la tabla formal de control de calidad.
 */

import React, { useState } from 'react';
import { ShieldCheck, Play, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { QAEngine } from '../../qa/engine/qa-engine';
import { QASummaryReport } from '../../qa/types/qa.types';

export const QAPanel: React.FC = () => {
  const [report, setReport] = useState<QASummaryReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const handleRunQA = () => {
    setIsRunning(true);
    // Simular un micro delay para dar feedback visual de ejecución de tests
    setTimeout(() => {
      const engine = new QAEngine();
      const results = engine.runAllTests();
      setReport(results);
      setIsRunning(false);
    }, 150);
  };

  return (
    <div id="qa" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
            Módulo 9 · Control de Calidad y Pruebas Funcionales (Sección 9 Consigna)
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Módulo de Pruebas de Software Obligatorias (QA Engine)
          </h3>
        </div>

        <button
          onClick={handleRunQA}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? 'Ejecutando Pruebas...' : 'Ejecutar Suite QA Completa'}</span>
        </button>
      </div>

      {/* Resumen de Ejecución si se ha disparado */}
      {report && (
        <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">
                {report.passedTests} de {report.totalTests} Pruebas Aprobadas
              </span>
              <span className="text-[11px] text-slate-400">
                Tasa de éxito: <strong className="text-emerald-400 font-mono">{report.successRate.toFixed(1)}%</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Tiempo total: {report.totalExecutionTimeMs.toFixed(3)} ms</span>
          </div>
        </div>
      )}

      {/* Tabla de Pruebas */}
      {report ? (
        <div className="space-y-4">
          {report.results.map((test, idx) => {
            const isExpanded = expandedTestId === test.id;
            return (
              <div
                key={test.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition"
              >
                <div
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  className="p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                    <span className={`p-1 rounded-full ${test.passed ? 'text-emerald-400 bg-emerald-950/60' : 'text-red-400 bg-red-950/60'}`}>
                      {test.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{test.name}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{test.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400">{test.executionTimeMs.toFixed(2)} ms</span>
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full font-mono ${
                      test.passed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-red-950 text-red-300 border border-red-800/60'
                    }`}>
                      {test.passed ? 'PASS' : 'FAIL'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Detalle Expandible */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 text-xs space-y-3 font-sans">
                    <div>
                      <strong className="text-slate-300 block mb-1">Entrada Suministrada:</strong>
                      <p className="text-slate-400 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {test.inputDescription}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-300 block mb-1">Resultado Esperado:</strong>
                      <p className="text-slate-400 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {test.expectedResult}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-300 block mb-1">Resultado Obtenido:</strong>
                      <p className="text-emerald-300 font-mono text-[11px] leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {test.actualResult}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-300 block mb-1">Conclusión Formal:</strong>
                      <p className="text-slate-300 leading-relaxed italic bg-blue-950/20 p-2.5 rounded-lg border border-blue-900/30">
                        "{test.conclusion}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-dashed border-slate-800">
          <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 mb-4">
            Presiona el botón superior para ejecutar los 4 casos de prueba obligatorios de control de calidad
            (Carga de Escenarios, Resiliencia ante Entrada Inválida, Edición Dinámica y Eficiencia de Precondicionamiento).
          </p>
          <button
            onClick={handleRunQA}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Play className="w-3 h-3" />
            <span>Ejecutar Tests Ahora</span>
          </button>
        </div>
      )}
    </div>
  );
};
