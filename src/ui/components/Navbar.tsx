/**
 * @file Navbar.tsx
 * @description Barra de navegación superior con estilo académico sobrio y limpio.
 */

import React from 'react';
import { Calculator, ShieldCheck, Terminal } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Título Académico */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-white">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight flex items-center gap-2 text-sm sm:text-base">
                Simulador GCP <span className="text-slate-600 font-mono text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200">UMSA 2026</span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Métodos Numéricos · Mención Desarrollo de Sistemas
              </p>
            </div>
          </div>

          {/* Enlaces de Navegación Rápida (Orden estricto Módulos 1 al 10) */}
          <div className="hidden xl:flex items-center space-x-1 text-[11px] font-medium text-slate-600">
            <a href="#inicio" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">1. Inicio</a>
            <a href="#caso-estudio" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">2. Caso TI</a>
            <a href="#formulacion" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">3. Formulación</a>
            <a href="#editor" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">4. Entrada</a>
            <a href="#escenarios" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">5. Escenarios</a>
            <a href="#solucion-referencia" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">6. Referencia</a>
            <a href="#gcp-vs-gc" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">7. GCP vs GC</a>
            <a href="#errores" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">8. Errores</a>
            <a href="#qa" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" /> 9. QA
            </a>
            <a href="#conclusiones" className="px-2.5 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition">10. Conclusiones</a>
          </div>

          {/* Badge de Mención */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Terminal className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Mención:</span> DS
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
