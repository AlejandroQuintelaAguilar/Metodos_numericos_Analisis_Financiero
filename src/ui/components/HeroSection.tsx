/**
 * @file HeroSection.tsx
 * @description Módulo 1 (Inicio): Presentación académica sobria y limpia, datos institucionales UMSA,
 * identificación del estudiante y síntesis del problema de optimización presupuestaria TI.
 */

import React from 'react';
import { Cpu, ArrowDown, UserCheck } from 'lucide-react';
import { MathBlock } from './MathBlock';

export const HeroSection: React.FC = () => {
  return (
    <section id="inicio" className="pt-10 pb-14 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado Institucional UMSA */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Universidad Mayor de San Andrés · Facultad de Ciencias Puras y Naturales
            </span>
            <h2 className="text-sm font-medium text-slate-700 mt-0.5">
              Carrera de Informática · Mención: <strong className="text-slate-900">Desarrollo de Sistemas</strong>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Materia: Métodos Numéricos
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Prof. Porfirio Suñagua S. (2020)
            </span>
          </div>
        </div>

        {/* Tarjeta Oficial de Datos del Estudiante (Módulo 1 Obligatorio - Sección 7) */}
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-200/70 text-slate-700 border border-slate-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Módulo 1 · Datos del Estudiante (Modalidad Individual)
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                <span className="text-sm font-bold text-slate-900">Univ. Alejandro Quintela Aguilar</span>
                <span className="text-xs font-mono text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-300">
                  R.U.: 1802408
                </span>
                <span className="text-xs font-mono text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-300">
                  C.I.: 6805626
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            Mención Académica: <strong className="text-slate-900">Desarrollo de Sistemas</strong>
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-4">
            <Cpu className="w-3.5 h-3.5 text-slate-600" />
            <span>Desafío Académico Individual · Computación Científica y Arquitectura de Software</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-4">
            Método de Gradientes Conjugados Precondicionado en Problemas Financieros
          </h1>

          <p className="text-slate-600 text-base leading-relaxed mb-6">
            Simulador computacional y reactivo para la asignación y rebalanceo presupuestario en cuatro categorías estratégicas de TI, 
            modelado mediante minimización cuadrática convexa:
          </p>

          <div className="inline-block px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-800 mb-8">
            <MathBlock math="\min_{x \in \mathbb{R}^4} \Phi(x) = \frac{1}{2} x^T A x - b^T x \quad \Longleftrightarrow \quad A x = b" block={false} />
          </div>

          {/* Badges de Métricas Clave */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Dimensión</span>
              <span className="text-xl font-bold text-slate-900 font-mono">n = 4</span>
              <span className="text-[11px] text-slate-500 block">Variables TI</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Tolerancia Parada</span>
              <span className="text-xl font-bold text-teal-800 font-mono">10⁻⁶</span>
              <span className="text-[11px] text-slate-500 block">||r_k||₂ / ||b||₂</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Precondicionador</span>
              <span className="text-xl font-bold text-slate-800 font-mono">Jacobi / IC₀</span>
              <span className="text-[11px] text-slate-500 block">Suñagua (2020)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Módulo QA</span>
              <span className="text-xl font-bold text-slate-800 font-mono">4 Pruebas</span>
              <span className="text-[11px] text-slate-500 block">100% Automatizado</span>
            </div>
          </div>
        </div>

        {/* Botón de Scroll */}
        <div className="text-center pt-2">
          <a
            href="#caso-estudio"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition group"
          >
            <span>Explorar modelo financiero y formulación</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
