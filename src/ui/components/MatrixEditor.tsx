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
    <div id="editor" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-700">
            Módulo 4 · Entrada y Edición Dinámica de Coeficientes
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Sistema Lineal Interactivo Ax = b y Vector Inicial x₀
          </h3>
        </div>

        {/* Botones de Simulación de Errores y Simetrización */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onUpdateMatrixA(0, 1, matrixA[1][0] + 4.2)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-amber-800 border border-slate-300 transition"
            title="Introduce deliberadamente a12 != a21 para probar la captura de asimetría"
          >
            <span>Simular Matriz Asimétrica</span>
          </button>
          <button
            onClick={() => onUpdateMatrixA(0, 0, -4.0)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-rose-800 border border-slate-300 transition"
            title="Introduce deliberadamente a11 = -4.0 para probar la captura de matriz no definida positiva"
          >
            <span>Simular Matriz No SPD</span>
          </button>
          {!validation.isSymmetric && (
            <button
              onClick={onSymmetrize}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simetrizar A = (A + Aᵀ)/2</span>
            </button>
          )}
        </div>
      </div>

      {/* Guía de Uso Integrada (Exigida en Nota de la Sección 11) */}
      <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div>
          <strong className="text-slate-700">Guía de Uso Interactivo:</strong>{' '}
          1) Edita cualquier celda <code className="font-mono text-slate-800">a_ij</code>, demanda <code className="font-mono text-teal-800">b_i</code> o vector inicial <code className="font-mono text-slate-800">x₀</code> (o carga un escenario en el Módulo 5).{' '}
          2) Cambia el precondicionador (<code className="font-mono text-slate-800">Jacobi / IC(0) / Identidad</code>) para observar el recálculo instantáneo.{' '}
          3) Usa los botones superiores para poner a prueba el validador ante matrices inválidas.
        </div>
      </div>

      {/* Alerta de Error de Validación si aplica */}
      {!validation.isValid && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs">
          <div className="flex items-center gap-2 font-bold mb-2 text-rose-800">
            <AlertCircle className="w-4 h-4" />
            <span>Matriz No Apta para el Método de Gradientes Conjugados</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
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
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
            Matriz de Rigidez e Interdependencia TI: A (4x4)
          </label>
          <div className="overflow-x-auto p-4 rounded-xl bg-slate-50 border border-slate-200 ">
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
                            ? 'bg-slate-100 border-slate-300 text-slate-900 font-bold focus:ring-slate-400'
                            : 'bg-white border-slate-300 text-slate-800 focus:ring-slate-400'
                        }`}
                        title={`A[${rIdx + 1}, ${cIdx + 1}]`}
                      />
                      <span className="absolute -top-1.5 -left-1.5 px-1 py-0.2 bg-slate-100 text-[9px] font-mono text-slate-600 rounded">
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
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
            Vector Demanda Neta: b ($K USD)
          </label>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200  space-y-2.5">
            {vectorB.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-600 w-24 truncate">
                  {variableLabels[idx]}:
                </span>
                <input
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => onUpdateVectorB(idx, parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold rounded-lg bg-slate-50 border border-teal-200 text-teal-800 focus:outline-none focus:ring-2 focus:ring-slate-400 text-right"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controles de Ejecución Numérica y Vector Inicial x0 */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-slate-700" />
            <span>Vector Inicial x₀ y Parámetros de Convergencia (Sección 6.3 y 7.4)</span>
          </div>
          <button
            onClick={handleResetX0}
            className="text-[11px] font-mono px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
          >
            Restaurar x₀ = [0, 0, 0, 0]ᵀ
          </button>
        </div>

        {/* Selección de Vector Inicial x0 */}
        <div>
          <label className="block text-xs text-slate-600 mb-2">
            Vector Inicial <code className="text-slate-800 font-mono">x₀ = [x₀,₁, x₀,₂, x₀,₃, x₀,₄]ᵀ</code> (Por defecto <code className="text-slate-700 font-mono">x₀ = 0</code>, donde <code className="text-slate-700 font-mono">r₀ = b - Ax₀</code>):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {initialGuess.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-[11px] font-mono text-slate-600">x₀,{idx + 1}:</span>
                <input
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => onUpdateInitialGuess(idx, parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 focus:outline-none text-right"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-200">
          {/* Tolerancia de Parada */}
          <div>
            <label className="block text-slate-600 mb-1.5">Tolerancia Relativa (||r||₂ / ||b||₂)</label>
            <select
              value={tolerance}
              onChange={(e) => onUpdateTolerance(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value={1e-6}>10⁻⁶ (Estándar UMSA)</option>
              <option value={1e-8}>10⁻⁸ (Alta Precisión)</option>
              <option value={1e-4}>10⁻⁴ (Rápida)</option>
            </select>
          </div>

          {/* Máximo de Iteraciones */}
          <div>
            <label className="block text-slate-600 mb-1.5">Iteraciones Máximas (N_max)</label>
            <input
              type="number"
              min={10}
              max={500}
              value={maxIterations}
              onChange={(e) => onUpdateMaxIterations(parseInt(e.target.value) || 100)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Selector de Precondicionador */}
          <div>
            <label className="block text-slate-600 mb-1.5">Estrategia de Precondicionador</label>
            <select
              value={preconditionerType}
              onChange={(e) => onUpdatePreconditioner(e.target.value as PreconditionerType)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
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
