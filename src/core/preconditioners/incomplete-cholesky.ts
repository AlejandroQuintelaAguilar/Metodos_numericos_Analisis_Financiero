/**
 * @file incomplete-cholesky.ts
 * @description Precondicionador de Factorización Incompleta de Cholesky (IC(0) / IC con umbral de caída).
 * M = L_tilde * L_tilde^T.
 * 
 * Mencionada en la Sección 5 y 6.3 de la consigna para mitigar mal condicionamiento cuando
 * existe un acoplamiento crítico fuera de la diagonal (correlaciones interdepartamentales fuertes).
 * 
 * En cada iteración:
 *   1. L_tilde * y = r (Sustitución progresiva)
 *   2. L_tilde^T * z = y (Sustitución regresiva)
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import {
  computeConditionNumber,
  createZeroMatrix,
  invertMatrixGaussJordan,
  matrixMultiply,
  solveLowerTriangular,
  solveUpperTriangular,
  transpose
} from '../math/linear-algebra';
import { IPreconditioner, PreconditionerType } from './preconditioner.interface';

export class IncompleteCholeskyPreconditioner implements IPreconditioner {
  public readonly id: PreconditionerType = 'incomplete_cholesky';
  public readonly name = 'Cholesky Incompleto IC(0) (M = L_tilde * L_tilde^T)';
  public readonly description =
    'M = L_tilde * L_tilde^T. Factorización triangular aproximada que captura ' +
    'tanto la escala diagonal como las correlaciones cruzadas críticas entre departamentos TI.';

  private L_tilde: number[][] = [];
  private LT_tilde: number[][] = [];
  private readonly dropTolerance: number;

  /**
   * @param dropTolerance - Umbral relativo por debajo del cual los términos fuera de la diagonal se descartan (por defecto: 1e-4)
   */
  constructor(dropTolerance: number = 1e-4) {
    this.dropTolerance = dropTolerance;
  }

  public initialize(A: readonly (readonly number[])[]): void {
    const n = A.length;
    this.L_tilde = createZeroMatrix(n);

    for (let j = 0; j < n; j++) {
      let sumDiag = 0;
      for (let k = 0; k < j; k++) {
        const ljk = this.L_tilde[j][k];
        sumDiag += ljk * ljk;
      }

      let pivot = A[j][j] - sumDiag;
      if (pivot <= 1e-15) {
        // Shift de regularización para garantizar que el precondicionador sea estrictamente SPD
        pivot = Math.max(1e-6, A[j][j] * 0.01);
      }

      const ljj = Math.sqrt(pivot);
      this.L_tilde[j][j] = ljj;

      for (let i = j + 1; i < n; i++) {
        // En IC(0), solo se calculan elementos si A_ij != 0 o supera el drop tolerance
        if (Math.abs(A[i][j]) >= this.dropTolerance) {
          let sumSub = 0;
          for (let k = 0; k < j; k++) {
            sumSub += this.L_tilde[i][k] * this.L_tilde[j][k];
          }
          const val = (A[i][j] - sumSub) / ljj;
          this.L_tilde[i][j] = Math.abs(val) >= this.dropTolerance ? val : 0;
        } else {
          this.L_tilde[i][j] = 0;
        }
      }
    }

    this.LT_tilde = transpose(this.L_tilde);
  }

  public solve(r: readonly number[]): number[] {
    // 1. L_tilde * y = r
    const y = solveLowerTriangular(this.L_tilde, r);
    // 2. L_tilde^T * z = y
    const z = solveUpperTriangular(this.LT_tilde, y);
    return z;
  }

  public getPreconditionedMatrix(A: readonly (readonly number[])[]): number[][] {
    // M = L_tilde * L_tilde^T
    const M = matrixMultiply(this.L_tilde, this.LT_tilde);
    const Minv = invertMatrixGaussJordan(M);
    return matrixMultiply(Minv, A);
  }

  public getConditionNumber(A: readonly (readonly number[])[]): number {
    const precA = this.getPreconditionedMatrix(A);
    return computeConditionNumber(precA, '1');
  }
}
