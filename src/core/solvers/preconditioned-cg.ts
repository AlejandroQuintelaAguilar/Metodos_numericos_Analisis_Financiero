/**
 * @file preconditioned-cg.ts
 * @description Método de Gradientes Conjugados Precondicionado (GCP) según Suñagua (2020).
 * Núcleo algorítmico del proyecto que resuelve A * x = b acelerando la tasa de convergencia
 * mediante un operador de precondicionamiento M simétrico y definido positivo (SPD).
 * 
 * Referencia bibliográfica:
 * Suñagua S., P. (2020). Método de Gradientes Conjugados Precondicionado.
 * Revista Boliviana de Matemática – UMSA, 04, 2–7.
 * 
 * Algoritmo paso a paso:
 * 1. Dado x_0, calcular r_0 = b - A * x_0.
 * 2. Resolver M * z_0 = r_0.
 * 3. Asignar p_0 = z_0 y gamma_0 = <r_0, z_0>.
 * 4. Para k = 0, 1, ..., N_max-1:
 *      w_k = A * p_k
 *      alpha_k = gamma_k / <p_k, w_k>
 *      x_{k+1} = x_k + alpha_k * p_k
 *      r_{k+1} = r_k - alpha_k * w_k
 *      Si ||r_{k+1}||_2 / ||b||_2 < tol => Parar (Convergencia)
 *      Resolver M * z_{k+1} = r_{k+1}
 *      gamma_{k+1} = <r_{k+1}, z_{k+1}>
 *      beta_k = gamma_{k+1} / gamma_k
 *      p_{k+1} = z_{k+1} + beta_k * p_k
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
import { IPreconditioner } from '../preconditioners/preconditioner.interface';
import { IterationStep, SolverOptions, SolverResult } from '../types/solver.types';

export class PreconditionedCGSolver {
  public readonly name = 'Gradientes Conjugados Precondicionado (GCP - Suñagua 2020)';

  private readonly preconditioner: IPreconditioner;

  /**
   * @param preconditioner - Estrategia de precondicionamiento (ej. Jacobi, Incomplete Cholesky)
   */
  constructor(preconditioner: IPreconditioner) {
    this.preconditioner = preconditioner;
  }

  /**
   * Resuelve el sistema lineal simétrico y definido positivo A * x = b mediante GCP.
   * 
   * @param A - Matriz de rigidez e interdependencia SPD
   * @param b - Vector de demandas
   * @param options - Opciones de tolerancia y límites de iteración
   * @returns SolverResult con solución óptima, telemetría e historial paso a paso
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

    // Inicializar precondicionador con la matriz A del sistema
    this.preconditioner.initialize(A);

    // 1. Vector inicial x_0 (por defecto: vector de ceros)
    let x: number[] = options.initialGuess
      ? deepCloneVector(options.initialGuess)
      : createZeroVector(n);

    // 2. Residuo inicial: r_0 = b - A * x_0
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
        preconditionerName: this.preconditioner.name,
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

    // 3. Resolver sistema precondicionado inicial: M * z_0 = r_0  =>  z_0 = M^-1 * r_0
    let z = this.preconditioner.solve(r);

    // 4. Dirección conjugada inicial: p_0 = z_0
    let p = deepCloneVector(z);

    // 5. Producto interno proyectado: gamma_0 = <r_0, z_0>
    let gamma = dotProduct(r, z);

    let iteration = 0;
    let converged = false;

    // 6. Bucle iterativo de Suñagua (2020)
    while (iteration < maxIterations) {
      // w_k = A * p_k
      const Ap = matrixVectorMultiply(A, p);

      // Curvatura <p_k, A * p_k>
      const pAp = dotProduct(p, Ap);
      if (pAp <= 1e-18) {
        // Matriz no positiva o dirección conjugada singular
        break;
      }

      // Tamaño de paso óptimo: alpha_k = <r_k, z_k> / <p_k, A * p_k>
      const alpha = gamma / pAp;

      // Actualizar aproximación: x_{k+1} = x_k + alpha_k * p_k
      x = vectorScaleAndAdd(x, alpha, p);

      // Actualizar residuo: r_{k+1} = r_k - alpha_k * (A * p_k)
      r = vectorScaleAndAdd(r, -alpha, Ap);

      normR = norm2(r);
      relativeResidual = normR / normB;
      iteration++;

      // Resolver M * z_{k+1} = r_{k+1}
      const zNew = this.preconditioner.solve(r);

      // Nuevo producto interno proyectado: gamma_{k+1} = <r_{k+1}, z_{k+1}>
      const gammaNew = dotProduct(r, zNew);

      // Factor de corrección conjugada: beta_k = gamma_{k+1} / gamma_k
      const beta = gammaNew / gamma;

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

      // Actualizar dirección conjugada: p_{k+1} = z_{k+1} + beta_k * p_k
      p = vectorAdd(zNew, scalarMultiply(beta, p));

      z = zNew;
      gamma = gammaNew;
    }

    const endTime = performance.now();
    const executionTimeMs = Math.max(0, endTime - startTime);

    return {
      solverName: this.name,
      preconditionerName: this.preconditioner.name,
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
