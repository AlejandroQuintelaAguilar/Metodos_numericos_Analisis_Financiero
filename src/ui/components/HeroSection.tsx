/**
 * @file HeroSection.tsx
 * @description Módulo 1 (Inicio): Presentación académica, datos institucionales UMSA,
 * identificación del estudiante y síntesis del problema de optimización presupuestaria TI.
 */

import React, { useState } from 'react';
import { Cpu, ArrowDown, UserCheck, Edit3, Check } from 'lucide-react';
import { MathBlock } from './MathBlock';

export const HeroSection: React.FC = () => {
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [studentName, setStudentName] = useState(() =>
    localStorage.getItem('umsa_student_name') || 'Univ. [Ingresa tu Nombre Completo]'
  );
  const [studentRU, setStudentRU] = useState(() =>
    localStorage.getItem('umsa_student_ru') || 'R.U. / C.I.: [Tu Registro]'
  );
  const [studentParallel, setStudentParallel] = useState(() =>
    localStorage.getItem('umsa_student_parallel') || 'Paralelo A · Gestión I/2026'
  );

  const handleSaveStudent = () => {
    localStorage.setItem('umsa_student_name', studentName);
    localStorage.setItem('umsa_student_ru', studentRU);
    localStorage.setItem('umsa_student_parallel', studentParallel);
    setIsEditingStudent(false);
  };

  return (
    <section id="inicio" className="relative pt-12 pb-16 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
      {/* Glow decorativo de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-gradient-to-r from-blue-600/15 via-indigo-500/10 to-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado Institucional UMSA */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/60">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
              Universidad Mayor de San Andrés · Facultad de Ciencias Puras y Naturales
            </span>
            <h2 className="text-sm font-medium text-slate-300">
              Carrera de Informática · Mención: <strong className="text-white">Desarrollo de Sistemas</strong>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              Materia: Métodos Numéricos
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-md bg-blue-950/80 text-blue-300 border border-blue-800/60">
              Prof. Porfirio Suñagua S. (2020)
            </span>
          </div>
        </div>

        {/* Tarjeta de Datos del Estudiante (Módulo 1 Obligatorio - Sección 7) */}
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            {!isEditingStudent ? (
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 block">
                  Módulo 1 · Datos del Estudiante (Modalidad Individual)
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                  <span className="text-sm font-bold text-white">{studentName}</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                    {studentRU}
                  </span>
                  <span className="text-xs text-slate-400">
                    Mención: <strong className="text-slate-200">Desarrollo de Sistemas</strong> · {studentParallel}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Nombre Completo"
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={studentRU}
                  onChange={(e) => setStudentRU(e.target.value)}
                  placeholder="R.U. / C.I."
                  className="px-2.5 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-emerald-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={studentParallel}
                  onChange={(e) => setStudentParallel(e.target.value)}
                  placeholder="Paralelo / Gestión"
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <button
            onClick={() => (isEditingStudent ? handleSaveStudent() : setIsEditingStudent(true))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {isEditingStudent ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guardar Datos</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Editar Estudiante</span>
              </>
            )}
          </button>
        </div>

        {/* Título Principal */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Desafío Académico Individual · Computación Científica & Software Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-6">
            Método de Gradientes Conjugados Precondicionado{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              en Problemas Financieros
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Simulador computacional y reactivo para la asignación y rebalanceo presupuestario en cuatro categorías estratégicas de TI, 
            modelado mediante minimización cuadrática convexa:
          </p>

          <div className="inline-block px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner text-sm font-mono text-blue-300 mb-8">
            <MathBlock math="\min_{x \in \mathbb{R}^4} \Phi(x) = \frac{1}{2} x^T A x - b^T x \quad \Longleftrightarrow \quad A x = b" block={false} />
          </div>

          {/* Badges de Métricas Clave */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Dimensión</span>
              <span className="text-xl font-bold text-white font-mono">n = 4</span>
              <span className="text-[11px] text-slate-500 block">Variables TI</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Tolerancia Parada</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">10⁻⁶</span>
              <span className="text-[11px] text-slate-500 block">||r_k||₂ / ||b||₂</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Precondicionador</span>
              <span className="text-xl font-bold text-indigo-400 font-mono">Jacobi / IC₀</span>
              <span className="text-[11px] text-slate-500 block">Suñagua (2020)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Módulo QA</span>
              <span className="text-xl font-bold text-cyan-400 font-mono">4 Pruebas</span>
              <span className="text-[11px] text-slate-500 block">100% Automatizado</span>
            </div>
          </div>
        </div>

        {/* Botón de Scroll */}
        <div className="text-center pt-2">
          <a
            href="#caso-estudio"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition group"
          >
            <span>Explorar modelo financiero y formulación</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
