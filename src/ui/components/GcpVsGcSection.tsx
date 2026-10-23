/**
 * @file GcpVsGcSection.tsx
 * @description Módulo 7: Comparativa lado a lado entre Gradiente Conjugado simple (GC)
 * y Gradiente Conjugado Precondicionado (GCP - Suñagua 2020), con métricas y gráfico de convergencia.
 */

import React from 'react';
import { Zap, CheckCircle2, XCircle } from 'lucide-react';
import { SolverResult } from '../../core/types/solver.types';
import { ConvergenceChart } from './ConvergenceChart';

interface GcpVsGcSectionProps {
  gcResult: SolverResult | null;
  gcpResult: SolverResult | null;
  conditionNumberA: number;
  conditionNumberPrec: number;
  tolerance: number;
}

export const GcpVsGcSection: React.FC<GcpVsGcSectionProps> = ({
  gcResult,
  gcpResult,
  conditionNumberA,
  conditionNumberPrec,
  tolerance
}) => {
  if (!gcResult || !gcpResult) {
    return null;
  }

  const speedup = (gcResult.iterations / Math.max(1, gcpResult.iterations)).toFixed(2);
  const conditionReduction = (conditionNumberA / Math.max(0.001, conditionNumberPrec)).toFixed(1);

  return (
    <div id="gcp-vs-gc" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 7 · Contraste Algorítmico y Velocidad de Convergencia
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            GCP (Suñagua 2020) vs. GC Simple (Sin Precondicionar)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Aceleración Espectral: {conditionReduction}x ({speedup}x iters)
          </span>
        </div>
      </div>

      {/* Tarjetas Comparativas Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* GC Simple */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-amber-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                GC Simple (Sin Precondicionar)
              </h4>
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
              gcResult.converged
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                : 'bg-red-950/60 text-red-300 border border-red-800/40'
            }`}>
              {gcResult.converged ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {gcResult.converged ? 'Convergió' : 'No alcanzó tol'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Iteraciones</span>
              <span className="text-xl font-bold text-amber-400 font-mono">{gcResult.iterations}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Residuo Rel. Final</span>
              <span className="text-xs font-bold text-slate-200 font-mono truncate block mt-1">
                {gcResult.finalRelativeResidual.toExponential(3)}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Número de Condición Original κ(A):</span>
              <span className="font-mono text-slate-200 font-bold">{conditionNumberA.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Tiempo de Cómputo:</span>
              <span className="font-mono text-slate-200">{gcResult.executionTimeMs.toFixed(3)} ms</span>
            </div>
            <div className="pt-2 text-slate-400">
              <span className="block mb-1 text-[11px]">Vector Solución x_GC:</span>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
                [{gcResult.x.map(v => v.toFixed(3)).join(', ')}]
              </div>
            </div>
          </div>
        </div>

        {/* GCP Suñagua 2020 */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                GCP (Suñagua 2020 - Precondicionado)
              </h4>
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
              gcpResult.converged
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                : 'bg-red-950/60 text-red-300 border border-red-800/40'
            }`}>
              {gcpResult.converged ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {gcpResult.converged ? 'Convergió' : 'No alcanzó tol'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Iteraciones</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{gcpResult.iterations}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Residuo Rel. Final</span>
              <span className="text-xs font-bold text-slate-200 font-mono truncate block mt-1">
                {gcpResult.finalRelativeResidual.toExponential(3)}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Condición Precondicionada κ(M⁻¹A):</span>
              <span className="font-mono text-emerald-300 font-bold">{conditionNumberPrec.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Tiempo de Cómputo:</span>
              <span className="font-mono text-slate-200">{gcpResult.executionTimeMs.toFixed(3)} ms</span>
            </div>
            <div className="pt-2 text-slate-400">
              <span className="block mb-1 text-[11px]">Vector Solución x_GCP:</span>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
                [{gcpResult.x.map(v => v.toFixed(3)).join(', ')}]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Convergencia */}
      <ConvergenceChart
        gcHistory={gcResult.history}
        gcpHistory={gcpResult.history}
        tolerance={tolerance}
      />
    </div>
  );
};
