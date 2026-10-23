/**
 * @file conjugate-gradient.ts
 * @description Método de Gradientes Conjugados simple (GC sin precondicionar).
 * Implementado como elemento de contraste para evaluar la ganancia en velocidad de convergencia
 * frente a GCP conforme a la Sección 6.3 de la consigna oficial.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import {
  createZeroVector,
  deepCloneVector,
  dotProduct,
  matrixVectorMultiply,
  norm2,
  scalarMultiply,
  validateNonZeroDemand,
  vectorAdd,
  vectorScaleAndAdd,
  vectorSubtract
} from '../math/linear-algebra';
import { IterationStep, SolverOptions, SolverResult } from '../types/solver.types';

export class ConjugateGradientSolver {
  public readonly name = 'Gradientes Conjugados Simple (GC)';

  /**
   * Resuelve el sistema lineal simétrico y definido positivo A * x = b mediante GC clásico.
   * 
   * @param A - Matriz de coeficientes SPD
   * @param b - Vector de demandas independientes
   * @param options - Opciones de tolerancia y límites de iteración
   * @returns SolverResult con solución, métricas de convergencia e historial
   */
  public solve(
    A: readonly (readonly number[])[],
    b: readonly number[],
    options: SolverOptions = {}
  ): SolverResult {
    const startTime = performance.now();
    const n = b.length;
    const tolerance = options.tolerance ?? 1e-6;
    const maxIterations = options.maxIterations ?? 100;
    const recordHistory = options.recordHistory ?? true;

    const normB = validateNonZeroDemand(b);

    // Vector inicial x_0 (por defecto: ceros)
    let x: number[] = options.initialGuess
      ? deepCloneVector(options.initialGuess)
      : createZeroVector(n);

    // Residuo inicial: r_0 = b - A * x_0
    const Ax0 = matrixVectorMultiply(A, x);
    let r = vectorSubtract(b, Ax0);
    let normR = norm2(r);
    let relativeResidual = normR / normB;

    const history: IterationStep[] = [];

    // Verificación preliminar si x_0 ya satisface la tolerancia
    if (relativeResidual < tolerance) {
      const endTime = performance.now();
      if (recordHistory) {
        history.push({
          iteration: 0,
          x: deepCloneVector(x),
          residualNorm: normR,
          relativeResidual,
          alpha: 0,
          beta: null,
          searchDirectionNorm: 0
        });
      }
      return {
        solverName: this.name,
        preconditionerName: 'Ninguno (GC Clásico)',
        x,
        iterations: 0,
        converged: true,
        finalRelativeResidual: relativeResidual,
        finalResidualNorm: normR,
        tolerance,
        executionTimeMs: Math.max(0, endTime - startTime),
        history
      };
    }

    // Dirección inicial: p_0 = r_0
    let p = deepCloneVector(r);
    let rsOld = dotProduct(r, r); // r_0^T * r_0

    let iteration = 0;
    let converged = false;

    while (iteration < maxIterations) {
      // 1. w_k = A * p_k
      const Ap = matrixVectorMultiply(A, p);

      // 2. Curvatura en dirección p: p_k^T * A * p_k
      const pAp = dotProduct(p, Ap);
      if (pAp <= 1e-18) {
        // Pérdida de positividad o dirección degenerada
        break;
      }

      // 3. Tamaño de paso: alpha_k = (r_k^T * r_k) / (p_k^T * A * p_k)
      const alpha = rsOld / pAp;

      // 4. Actualización de solución: x_{k+1} = x_k + alpha_k * p_k
      x = vectorScaleAndAdd(x, alpha, p);

      // 5. Actualización de residuo: r_{k+1} = r_k - alpha_k * (A * p_k)
      r = vectorScaleAndAdd(r, -alpha, Ap);

      normR = norm2(r);
      relativeResidual = normR / normB;
      iteration++;

      // 6. Nuevo producto escalar de residuos: r_{k+1}^T * r_{k+1}
      const rsNew = dotProduct(r, r);

      // 7. Parámetro de dirección conjugada: beta_k = rsNew / rsOld
      const beta = rsNew / rsOld;

      if (recordHistory) {
        history.push({
          iteration,
          x: deepCloneVector(x),
          residualNorm: normR,
          relativeResidual,
          alpha,
          beta,
          searchDirectionNorm: norm2(p)
        });
      }

      // Comprobar criterio de parada relativo: ||r_{k+1}||_2 / ||b||_2 < tolerance
      if (relativeResidual < tolerance) {
        converged = true;
        break;
      }

      // 8. Actualizar dirección: p_{k+1} = r_{k+1} + beta_k * p_k
      p = vectorAdd(r, scalarMultiply(beta, p));
      rsOld = rsNew;
    }

    const endTime = performance.now();
    const executionTimeMs = Math.max(0, endTime - startTime);

    return {
      solverName: this.name,
      preconditionerName: 'Ninguno (GC Clásico)',
      x,
      iterations: iteration,
      converged,
      finalRelativeResidual: relativeResidual,
      finalResidualNorm: normR,
      tolerance,
      executionTimeMs,
      history
    };
  }
}
