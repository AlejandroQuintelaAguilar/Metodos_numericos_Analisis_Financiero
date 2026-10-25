/**
 * @file MatrixEditor.tsx
 * @description Módulo 4: Editor matricial dinámico y controles de ejecución numérica.
 * Permite la mutación en vivo de los coeficientes de A y demandas b con recálculo instantáneo.
 */

import React from 'react';
import { Sliders, AlertCircle, RefreshCw } from 'lucide-react';
import { PreconditionerType } from '../../core/preconditioners/preconditioner.interface';
import { MatrixValidationResult } from '../../qa/types/qa.types';

interface MatrixEditorProps {
  matrixA: number[][];
  vectorB: number[];
  initialGuess: number[];
  tolerance: number;
  maxIterations: number;
  preconditionerType: PreconditionerType;
  validation: MatrixValidationResult;
  onUpdateMatrixA: (row: number, col: number, value: number) => void;
  onUpdateVectorB: (index: number, value: number) => void;
  onUpdateInitialGuess: (index: number, value: number) => void;
  onUpdateTolerance: (tol: number) => void;
  onUpdateMaxIterations: (maxIter: number) => void;
  onUpdatePreconditioner: (type: PreconditionerType) => void;
  onSymmetrize: () => void;
}

export const MatrixEditor: React.FC<MatrixEditorProps> = ({
  matrixA,
  vectorB,
  initialGuess,
  tolerance,
  maxIterations,
  preconditionerType,
  validation,
  onUpdateMatrixA,
  onUpdateVectorB,
  onUpdateInitialGuess,
  onUpdateTolerance,
  onUpdateMaxIterations,
  onUpdatePreconditioner,
  onSymmetrize
}) => {
  const variableLabels = ['x1 (Cloud)', 'x2 (Sec)', 'x3 (Dev)', 'x4 (QA)'];

  const handleResetX0 = () => {
    for (let i = 0; i < 4; i++) {
      onUpdateInitialGuess(i, 0);
    }
  };

  return (
    <div id="editor" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Módulo 4 · Entrada y Edición Dinámica de Coeficientes
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Sistema Lineal Interactivo Ax = b y Vector Inicial x₀
          </h3>
        </div>

        {/* Botones de Simulación de Errores y Simetrización */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onUpdateMatrixA(0, 1, matrixA[1][0] + 4.2)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
            title="Introduce deliberadamente a12 != a21 para probar la captura de asimetría"
          >
            <span>Simular Matriz Asimétrica</span>
          </button>
          <button
            onClick={() => onUpdateMatrixA(0, 0, -4.0)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition"
            title="Introduce deliberadamente a11 = -4.0 para probar la captura de matriz no definida positiva"
          >
            <span>Simular Matriz No SPD</span>
          </button>
          {!validation.isSymmetric && (
            <button
              onClick={onSymmetrize}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simetrizar A = (A + Aᵀ)/2</span>
            </button>
          )}
        </div>
      </div>

      {/* Alerta de Error de Validación si aplica */}
      {!validation.isValid && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
          <div className="flex items-center gap-2 font-bold mb-2 text-red-300">
            <AlertCircle className="w-4 h-4" />
            <span>Matriz No Apta para el Método de Gradientes Conjugados</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {validation.errors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor Grid: Matriz A (4x4) y Vector b (4x1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Matriz A */}
        <div className="lg:col-span-8">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            Matriz de Rigidez e Interdependencia TI: A (4x4)
          </label>
          <div className="overflow-x-auto p-4 rounded-xl bg-slate-950 border border-slate-800/90 shadow-inner">
            <div className="grid grid-cols-4 gap-2.5 min-w-[340px]">
              {matrixA.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isDiag = rIdx === cIdx;
                  return (
                    <div key={`${rIdx}-${cIdx}`} className="relative">
                      <input
                        type="number"
                        step="any"
                        value={val}
                        onChange={(e) => onUpdateMatrixA(rIdx, cIdx, parseFloat(e.target.value) || 0)}
                        className={`w-full px-2.5 py-2 text-center text-xs font-mono rounded-lg border transition focus:outline-none focus:ring-2 ${
                          isDiag
                            ? 'bg-blue-950/40 border-blue-800/60 text-blue-200 font-bold focus:ring-blue-500'
                            : 'bg-slate-900 border-slate-700/80 text-slate-200 focus:ring-indigo-500'
                        }`}
                        title={`A[${rIdx + 1}, ${cIdx + 1}]`}
                      />
                      <span className="absolute -top-1.5 -left-1.5 px-1 py-0.2 bg-slate-800 text-[9px] font-mono text-slate-400 rounded">
                        a{rIdx + 1}{cIdx + 1}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Vector b */}
        <div className="lg:col-span-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            Vector Demanda Neta: b ($K USD)
          </label>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 shadow-inner space-y-2.5">
            {vectorB.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-400 w-24 truncate">
                  {variableLabels[idx]}:
                </span>
                <input
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => onUpdateVectorB(idx, parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-950/30 border border-emerald-800/60 text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controles de Ejecución Numérica y Vector Inicial x0 */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Vector Inicial x₀ y Parámetros de Convergencia (Sección 6.3 y 7.4)</span>
          </div>
          <button
            onClick={handleResetX0}
            className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
          >
            Restaurar x₀ = [0, 0, 0, 0]ᵀ
          </button>
        </div>

        {/* Selección de Vector Inicial x0 */}
        <div>
          <label className="block text-xs text-slate-400 mb-2">
            Vector Inicial <code className="text-blue-300 font-mono">x₀ = [x₀,₁, x₀,₂, x₀,₃, x₀,₄]ᵀ</code> (Por defecto <code className="text-slate-300 font-mono">x₀ = 0</code>, donde <code className="text-slate-300 font-mono">r₀ = b - Ax₀</code>):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {initialGuess.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">x₀,{idx + 1}:</span>
                <input
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => onUpdateInitialGuess(idx, parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-xs font-mono font-bold text-blue-300 focus:outline-none text-right"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-800/60">
          {/* Tolerancia de Parada */}
          <div>
            <label className="block text-slate-400 mb-1.5">Tolerancia Relativa (||r||₂ / ||b||₂)</label>
            <select
              value={tolerance}
              onChange={(e) => onUpdateTolerance(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1e-6}>10⁻⁶ (Estándar UMSA)</option>
              <option value={1e-8}>10⁻⁸ (Alta Precisión)</option>
              <option value={1e-4}>10⁻⁴ (Rápida)</option>
            </select>
          </div>

          {/* Máximo de Iteraciones */}
          <div>
            <label className="block text-slate-400 mb-1.5">Iteraciones Máximas (N_max)</label>
            <input
              type="number"
              min={10}
              max={500}
              value={maxIterations}
              onChange={(e) => onUpdateMaxIterations(parseInt(e.target.value) || 100)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Selector de Precondicionador */}
          <div>
            <label className="block text-slate-400 mb-1.5">Estrategia de Precondicionador</label>
            <select
              value={preconditionerType}
              onChange={(e) => onUpdatePreconditioner(e.target.value as PreconditionerType)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="jacobi">Jacobi Diagonal (M = diag(A))</option>
              <option value="incomplete_cholesky">Cholesky Incompleto IC(0)</option>
              <option value="identity">Identidad (Sin Precondicionador / GC)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
