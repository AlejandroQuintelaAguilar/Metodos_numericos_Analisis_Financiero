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
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 5 · Carga Rápida de Escenarios Oficiales
          </span>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
            Selecciona un Escenario Numérico Preconfigurado
          </h3>
        </div>
        {activeScenarioId === 'custom' && (
          <button
            onClick={onResetCustom}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Escenario 1</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {ALL_SCENARIOS.map((sc) => {
          const isSelected = activeScenarioId === sc.id;
          let icon = <Sparkles className="w-4 h-4 text-emerald-400" />;
          let activeBorder = 'border-emerald-500/80 bg-emerald-950/20';

          if (sc.id === 'financial_stress') {
            icon = <Flame className="w-4 h-4 text-amber-400" />;
            activeBorder = 'border-amber-500/80 bg-amber-950/20';
          } else if (sc.id === 'ill_conditioned') {
            icon = <AlertOctagon className="w-4 h-4 text-rose-400" />;
            activeBorder = 'border-rose-500/80 bg-rose-950/20';
          }

          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-200 relative group ${
                isSelected
                  ? `${activeBorder} shadow-lg ring-1 ring-blue-400/40`
                  : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {icon}
                  </div>
                  <span className="font-bold text-sm text-white">{sc.academicTitle.split(':')[0]}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  κ(A) = {sc.spectral.conditionNumber.toFixed(2)}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-200 mb-1">{sc.academicTitle.split(':')[1]?.trim()}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sc.subtitle}
              </p>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    ● Activo en Memoria
                  </span>
                  <span className="text-slate-400 font-mono">||b||₂ = {sc.vectorB.normL2.toFixed(1)} $K</span>
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
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/70 pb-2">
              <span className="font-bold text-blue-300 uppercase tracking-wider text-[11px]">
                Justificación Financiera y Modificación Matemática ({activeSc.academicTitle})
              </span>
              <span className="font-mono text-[11px] text-emerald-400">
                Precondicionador: {activeSc.preconditioning.type} (κ reducido a {activeSc.preconditioning.preconditionedConditionNumber.toFixed(2)})
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Contexto Económico:</strong> {activeSc.financialContext}
            </p>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Análisis del Precondicionamiento:</strong> {activeSc.preconditioning.technicalExplanation}
            </p>
          </div>
        );
      })()}
    </div>
  );
};
