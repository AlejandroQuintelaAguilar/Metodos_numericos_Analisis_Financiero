/**
 * @file error-analyzer.ts
 * @description Módulo de cálculo y análisis de errores numéricos según la Sección 6.4 de la consigna.
 * Evalúa errores por componente (absoluto, relativo, porcentual), residuo global y
 * métricas comparativas de ganancia en convergencia entre GC simple y GCP.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import { matrixVectorMultiply, validateNonZeroDemand } from '../math/linear-algebra';
import {
  ComparisonMetrics,
  ComponentError,
  ErrorAnalysis,
  SolverResult
} from '../types/solver.types';

export class ErrorAnalyzer {
  /**
   * Calcula el desglose de errores numéricos para cada variable frente a la solución de referencia directa:
   *   E_{a,i} = |x_{ref,i} - x_{approx,i}|
   *   E_{r,i} = E_{a,i} / |x_{ref,i}|  (si x_{ref,i} != 0)
   *   E_{p,i} = E_{r,i} * 100%
   * 
   * @param A - Matriz de coeficientes
   * @param b - Vector de demandas
   * @param xRef - Vector solución numérica de referencia (obtenido por Cholesky directo)
   * @param xApprox - Vector solución aproximada (obtenido por GC o GCP)
   * @param variableKeys - Claves simbólicas opcionales (ej. ['x1', 'x2', 'x3', 'x4'])
   */
  public static computeErrorAnalysis(
    A: readonly (readonly number[])[],
    b: readonly number[],
    xRef: readonly number[],
    xApprox: readonly number[],
    variableKeys?: readonly string[]
  ): ErrorAnalysis {
    const n = xRef.length;
    const normB = validateNonZeroDemand(b);
    const componentErrors: ComponentError[] = [];

    let maxAbsoluteError = 0;
    let maxRelativeError: number | null = null;
    let maxPercentageError: number | null = null;

    for (let i = 0; i < n; i++) {
      const refVal = xRef[i];
      const approxVal = xApprox[i];
      const absErr = Math.abs(refVal - approxVal);

      let relErr: number | null = null;
      let pctErr: number | null = null;

      if (Math.abs(refVal) > 1e-15) {
        relErr = absErr / Math.abs(refVal);
        pctErr = relErr * 100;

        if (maxRelativeError === null || relErr > maxRelativeError) {
          maxRelativeError = relErr;
        }
        if (maxPercentageError === null || pctErr > maxPercentageError) {
          maxPercentageError = pctErr;
        }
      }

      if (absErr > maxAbsoluteError) {
        maxAbsoluteError = absErr;
      }

      componentErrors.push({
        index: i + 1,
        variableKey: variableKeys ? variableKeys[i] : `x${i + 1}`,
        xRef: refVal,
        xApprox: approxVal,
        absoluteError: absErr,
        relativeError: relErr,
        percentageError: pctErr
      });
    }

    // Calcular residuo global: r = b - A * x_approx
    const Ax = matrixVectorMultiply(A, xApprox);
    let sumResSq = 0;
    for (let i = 0; i < b.length; i++) {
      const diff = b[i] - Ax[i];
      sumResSq += diff * diff;
    }
    const finalResidualNorm = Math.sqrt(sumResSq);
    const globalRelativeResidual = finalResidualNorm / normB;

    return {
      componentErrors,
      maxAbsoluteError,
      maxRelativeError,
      maxPercentageError,
      globalRelativeResidual,
      finalResidualNorm
    };
  }

  /**
   * Compara los resultados entre el solver GC simple y GCP precondicionado.
   * Evalúa la ganancia en velocidad de convergencia (Sección 6.3).
   * 
   * @param gcResult - Resultado de GC sin precondicionar
   * @param gcpResult - Resultado de GCP precondicionado
   */
  public static compareSolvers(
    gcResult: SolverResult,
    gcpResult: SolverResult
  ): ComparisonMetrics {
    const gcIter = gcResult.iterations;
    const gcpIter = gcpResult.iterations;
    const diffIter = gcIter - gcpIter;
    const pctReduction = gcIter > 0 ? (diffIter / gcIter) * 100 : 0;
    const speedup = gcIter / Math.max(1, gcpIter);

    return {
      gcIterations: gcIter,
      gcpIterations: gcpIter,
      iterationReduction: diffIter,
      iterationReductionPercentage: pctReduction,
      speedupFactor: speedup,
      gcTimeMs: gcResult.executionTimeMs,
      gcpTimeMs: gcpResult.executionTimeMs,
      gcFinalRelativeResidual: gcResult.finalRelativeResidual,
      gcpFinalRelativeResidual: gcpResult.finalRelativeResidual,
      preconditioningEffective: gcpIter <= gcIter && gcpResult.converged
    };
  }
}
