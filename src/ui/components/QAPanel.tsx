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
  const [report, setReport] = useState<QASummaryReport | null>(() => {
    try {
      const engine = new QAEngine();
      return engine.runAllTests();
    } catch {
      return null;
    }
  });
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
    <div id="qa" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Módulo 9 · Control de Calidad y Pruebas Funcionales (Sección 9 Consigna)
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Módulo de Pruebas de Software Obligatorias (QA Engine)
          </h3>
        </div>

        <button
          onClick={handleRunQA}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white shadow-xs transition active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? 'Ejecutando Pruebas...' : 'Ejecutar Suite QA Completa'}</span>
        </button>
      </div>

      {/* Resumen de Ejecución si se ha disparado */}
      {report && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                {report.passedTests} de {report.totalTests} Pruebas Aprobadas
              </span>
              <span className="text-[11px] text-slate-600">
                Tasa de éxito: <strong className="text-teal-800 font-mono">{report.successRate.toFixed(1)}%</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
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
                className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden transition"
              >
                <div
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  className="p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                    <span className={`p-1 rounded-full ${test.passed ? 'text-teal-800 bg-teal-50/80' : 'text-rose-800 bg-rose-50'}`}>
                      {test.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{test.name}</h4>
                      <span className="text-[11px] font-mono text-slate-600">{test.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-600">{test.executionTimeMs.toFixed(2)} ms</span>
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full font-mono ${
                      test.passed
                        ? 'bg-emerald-950 text-teal-800 border border-teal-200'
                        : 'bg-red-950 text-rose-800 border border-rose-300'
                    }`}>
                      {test.passed ? 'PASS' : 'FAIL'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                  </div>
                </div>

                {/* Detalle Expandible */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-200 bg-white/30 text-xs space-y-3 font-sans">
                    <div>
                      <strong className="text-slate-700 block mb-1">Entrada Suministrada:</strong>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {test.inputDescription}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-700 block mb-1">Resultado Esperado:</strong>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {test.expectedResult}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-700 block mb-1">Resultado Obtenido:</strong>
                      <p className="text-teal-800 font-mono text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {test.actualResult}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-700 block mb-1">Conclusión Formal:</strong>
                      <p className="text-slate-700 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
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
        <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
          <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-600 mb-4">
            Presiona el botón superior para ejecutar los 4 casos de prueba obligatorios de control de calidad
            (Carga de Escenarios, Resiliencia ante Entrada Inválida, Edición Dinámica y Eficiencia de Precondicionamiento).
          </p>
          <button
            onClick={handleRunQA}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
          >
            <Play className="w-3 h-3" />
            <span>Ejecutar Tests Ahora</span>
          </button>
        </div>
      )}
    </div>
  );
};
