/**
 * @file FinancialCaseSection.tsx
 * @description Módulo 2 (Caso de Estudio): Justificación de la gestión financiera de TI,
 * descripción de las 4 variables de decisión presupuestaria y fundamentación de costos.
 */

import React from 'react';
import { Cloud, ShieldAlert, Code2, CheckCircle2, TrendingUp, Network } from 'lucide-react';
import { FINANCIAL_VARIABLES } from '../../core/constants/scenarios.data';

export const FinancialCaseSection: React.FC = () => {
  const icons = [
    <Cloud className="w-6 h-6 text-blue-400" key="cloud" />,
    <ShieldAlert className="w-6 h-6 text-red-400" key="sec" />,
    <Code2 className="w-6 h-6 text-amber-400" key="dev" />,
    <CheckCircle2 className="w-6 h-6 text-emerald-400" key="qa" />
  ];

  return (
    <section id="caso-estudio" className="py-16 border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 2 · Fundamentación Financiera
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Simulador de Asignación Presupuestaria de Categorías TI
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            En organizaciones tecnológicas modernas, el presupuesto de ingeniería no es un reparto estático, 
            sino un <strong>sistema dinámico interdependiente</strong> donde el crecimiento en una categoría 
            induce costos de escala y sincronización en las demás áreas.
          </p>
        </div>

        {/* Las 4 Variables de Decisión */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {FINANCIAL_VARIABLES.map((v, i) => (
            <div
              key={v.key}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition shadow-lg hover:shadow-blue-500/5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-800/80 group-hover:bg-slate-800 transition">
                  {icons[i]}
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-800/50">
                  {v.key} ({v.code})
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 leading-snug">{v.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{v.description}</p>
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Unidad contable</span>
                <span className="font-mono font-semibold text-slate-300">{v.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Justificación Económica de A y b */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-3 mb-3 text-blue-400">
              <TrendingUp className="w-5 h-5" />
              <h4 className="text-base font-bold text-white">Demanda Presupuestaria Bruta: Vector b</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              El vector <code className="text-blue-300 font-mono">b = [b₁, b₂, b₃, b₄]ᵀ</code> cuantifica la solicitud 
              presupuestaria de capital inicial por departamento. En el modelo cuadrático, el término lineal 
              <code className="text-blue-300 font-mono"> bᵀx</code> representa el valor bruto o beneficio operativo 
              generado al aprovisionar fondos para el desarrollo de proyectos y licencias durante el ciclo fiscal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-3 mb-3 text-indigo-400">
              <Network className="w-5 h-5" />
              <h4 className="text-base font-bold text-white">Rigidez y Fricción Cruzada: Matriz A (SPD)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              La matriz <code className="text-indigo-300 font-mono">A</code> es la Hessiana del costo cuadrático. 
              La diagonal <code className="text-indigo-300 font-mono">a_ii &gt; 0</code> representa la fricción de escala 
              interna (rendimientos marginales decrecientes). Los términos fuera de la diagonal 
              <code className="text-indigo-300 font-mono"> a_ij = a_ji ≥ 0</code> miden el costo de coordinación interdepartamental 
              (ej. mayor volumen de desarrollo en x₃ exige mayor tiempo de auditoría en x₂ y suites de pruebas en x₄).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
