/**
 * @file ScenarioButtons.tsx
 * @description Módulo 5: Botones de selección y carga instantánea de los tres escenarios oficiales
 * del Desafío Académico UMSA (Ideal, Bajo Estrés, Mal Condicionado).
 */

import React from 'react';
import { Sparkles, Flame, AlertOctagon, RotateCcw } from 'lucide-react';
import { ScenarioId } from '../../core/types/financial-model.types';
import { ALL_SCENARIOS } from '../../core/constants/scenarios.data';

interface ScenarioButtonsProps {
  activeScenarioId: ScenarioId | 'custom';
  onSelectScenario: (id: ScenarioId) => void;
  onResetCustom: () => void;
}

export const ScenarioButtons: React.FC<ScenarioButtonsProps> = ({
  activeScenarioId,
  onSelectScenario,
  onResetCustom
}) => {
  return (
    <div id="escenarios" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-700">
            Módulo 5 · Tres Escenarios Obligatorios (Sección 5 y 7.5)
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Carga Rápida y Ejecución de Escenarios: Ideal, Bajo Estrés y Mal Condicionado
          </h3>
        </div>
        {activeScenarioId === 'custom' && (
          <button
            onClick={onResetCustom}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Escenario 1</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {ALL_SCENARIOS.map((sc) => {
          const isSelected = activeScenarioId === sc.id;
          let icon = <Sparkles className="w-4 h-4 text-teal-800" />;
          let activeBorder = 'border-teal-700 bg-teal-50/50';

          if (sc.id === 'financial_stress') {
            icon = <Flame className="w-4 h-4 text-amber-800" />;
            activeBorder = 'border-amber-700 bg-amber-50/50';
          } else if (sc.id === 'ill_conditioned') {
            icon = <AlertOctagon className="w-4 h-4 text-rose-800" />;
            activeBorder = 'border-rose-700 bg-rose-50/50';
          }

          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-200 relative group ${
                isSelected
                  ? `${activeBorder} shadow-xs ring-1 ring-slate-300`
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    {icon}
                  </div>
                  <span className="font-bold text-sm text-slate-900">{sc.academicTitle.split(':')[0]}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  κ(A) = {sc.spectral.conditionNumber.toFixed(2)}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-800 mb-1">{sc.academicTitle.split(':')[1]?.trim()}</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {sc.subtitle}
              </p>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-teal-800 font-semibold flex items-center gap-1">
                    ● Activo en Memoria
                  </span>
                  <span className="text-slate-600 font-mono">||b||₂ = {sc.vectorB.normL2.toFixed(1)} $K</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detalle Financiero y Matemático del Escenario Seleccionado (Sección 5) */}
      {activeScenarioId !== 'custom' && (() => {
        const activeSc = ALL_SCENARIOS.find(s => s.id === activeScenarioId);
        if (!activeSc) return null;
        return (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Justificación Financiera y Modificación Matemática ({activeSc.academicTitle})
              </span>
              <span className="font-mono text-[11px] text-teal-800">
                Precondicionador: {activeSc.preconditioning.type} (κ reducido a {activeSc.preconditioning.preconditionedConditionNumber.toFixed(2)})
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Contexto Económico:</strong> {activeSc.financialContext}
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Análisis del Precondicionamiento:</strong> {activeSc.preconditioning.technicalExplanation}
            </p>
          </div>
        );
      })()}
    </div>
  );
};
