/**
 * @file Navbar.tsx
 * @description Barra de navegación superior con enlaces a las secciones principales,
 * badges académicos y conmutador visual.
 */

import React from 'react';
import { Calculator, ShieldCheck, Terminal } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Título Académico */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight flex items-center gap-2 text-sm sm:text-base">
                Simulador GCP <span className="text-blue-400 font-mono text-xs px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/60">UMSA 2026</span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Métodos Numéricos · Mención Desarrollo de Sistemas
              </p>
            </div>
          </div>

          {/* Enlaces de Navegación Rápida (Orden estricto Módulos 1 al 10) */}
          <div className="hidden xl:flex items-center space-x-1 text-[11px] font-medium text-slate-300">
            <a href="#inicio" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">1. Inicio</a>
            <a href="#caso-estudio" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">2. Caso TI</a>
            <a href="#formulacion" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">3. Formulación</a>
            <a href="#editor" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">4. Entrada</a>
            <a href="#escenarios" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">5. Escenarios</a>
            <a href="#solucion-referencia" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">6. Referencia</a>
            <a href="#gcp-vs-gc" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">7. GCP vs GC</a>
            <a href="#errores" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">8. Errores</a>
            <a href="#qa" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/50">
              <ShieldCheck className="w-3.5 h-3.5" /> 9. QA
            </a>
            <a href="#conclusiones" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition">10. Conclusiones</a>
          </div>

          {/* Badge de Mención y Estado */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span className="hidden sm:inline">Mención:</span> DS
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
