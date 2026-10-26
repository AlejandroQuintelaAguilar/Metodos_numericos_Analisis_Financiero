/**
 * @file ConclusionsSection.tsx
 * @description Módulo 10: Conclusiones técnicas y financieras, interpretación de resultados
 * y referencias bibliográficas académicas completas (Suñagua 2020, Golub 2013, Saad 2003).
 */

import React from 'react';
import { BookOpen, CheckCircle, Lightbulb, FileText } from 'lucide-react';

export const ConclusionsSection: React.FC = () => {
  return (
    <section id="conclusiones" className="py-16 border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 10 · Síntesis Académica y Fuentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Conclusiones, Interpretación Financiera y Bibliografía
          </h2>
        </div>

        {/* 2 Columnas de Conclusiones: Técnica y Financiera */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Conclusiones Matemático-Computacionales */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Lightbulb className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Conclusiones Matemáticas y Computacionales</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Eficacia del Precondicionador de Suñagua (2020):</strong> En matrices con rigidez multiescala severa (Escenario 3, \(\kappa(A) = 1477.17\)), el precondicionador diagonal de Jacobi comprime el espectro colapsando la condición efectiva a solo \(2.55\) (reducción de 580x), y Cholesky Incompleto \(IC(0)\) logra la convergencia en apenas 1 iteración.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Certificación de Robustez SPD:</strong> Se verificó analítica y numéricamente que el Criterio de Sylvester (\(\Delta_k &gt; 0\)) garantiza la existencia y unicidad de la solución, evitando estancamiento en puntos de ensilladura.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Alta Precisión de Referencia:</strong> La descomposición de Cholesky \(A = L L^T\) arroja un residuo absoluto nulo (\(0.0000 \times 10^0\)), sirviendo como benchmark inmutable para el cálculo de errores (\(E_a, E_r, E_p\)).
                </span>
              </li>
            </ul>
          </div>

          {/* Conclusiones Financieras */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <FileText className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Interpretación en la Gestión Presupuestaria TI</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Estabilidad Operativa bajo Estrés:</strong> El modelo demostró cómo ante shocks de precios de nube (+80%) y ciberseguridad (+120%), el simulador rebalancea automáticamente los fondos absorbiendo la sobrecarga sin desestabilizar la salud financiera global.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Penalización por Acoplamiento:</strong> Los términos fuera de la diagonal revelan que desestimar la interdependencia entre Desarrollo y QA genera cuellos de botella; modelarlos cuadráticamente permite planificar la capacidad con anticipación.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Aplicabilidad a Sistemas Corporativos:</strong> El enfoque Clean Architecture y TypeScript desacoplado permite integrar este motor en ERPs modernos o pipelines de FinOps para optimización continua de nubes híbridas.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bibliografía Oficial */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-slate-300">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bibliografía Principal y Referencias Académicas
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300 font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-blue-400 font-bold block mb-0.5">[1] Suñagua S., P. (2020)</span>
              <p className="font-sans text-slate-300">
                <em>Método de Gradientes Conjugados Precondicionado</em>. Revista Boliviana de Matemática – UMSA, 04, 2–7.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-blue-400 font-bold block mb-0.5">[2] Golub, G. H., &amp; Van Loan, C. F. (2013)</span>
              <p className="font-sans text-slate-300">
                <em>Matrix Computations</em> (4th ed.). Johns Hopkins University Press. Baltimore, MD, USA.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-blue-400 font-bold block mb-0.5">[3] Saad, Y. (2003)</span>
              <p className="font-sans text-slate-300">
                <em>Iterative Methods for Sparse Linear Systems</em> (2nd ed.). SIAM (Society for Industrial and Applied Mathematics). Philadelphia.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-emerald-400 font-bold block mb-0.5">[4] Fuentes de Datos y Benchmarks Financieros TI</span>
              <p className="font-sans text-slate-300">
                Parámetros de asignación presupuestaria TI ($K USD) y elasticidades de acoplamiento interdepartamental calibrados conforme a <em>FinOps Foundation – State of FinOps Benchmarks</em> y <em>Gartner IT Key Metrics Data</em> para infraestructuras Cloud/DevOps, Ciberseguridad, Desarrollo Core y QA.
              </p>
            </div>
          </div>
        </div>

        {/* Footer final */}
        <div className="text-center pt-12 text-slate-500 text-xs">
          Universidad Mayor de San Andrés · Carrera de Informática · Desafío de Métodos Numéricos (2026)
        </div>
      </div>
    </section>
  );
};
