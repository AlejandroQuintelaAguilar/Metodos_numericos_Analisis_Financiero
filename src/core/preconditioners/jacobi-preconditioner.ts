/**
 * @file jacobi-preconditioner.ts
 * @description Precondicionador Diagonal de Jacobi (M = diag(A)).
 * Recomendado en el artículo de Suñagua (2020) y en la Sección 5 de la consigna para matrices
 * con mal escalamiento diagonal o rigidez multiescala (como el Escenario 3).
 * 
 * Principio matemático:
 *   M = diag(a_11, a_22, ..., a_nn)
 *   M * z = r  =>  z_i = r_i / a_ii  para i = 1, ..., n.
 * 
 * Complejidad de resolución: O(n) operaciones por iteración.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import { computeConditionNumber, deepCloneMatrix } from '../math/linear-algebra';
import { MatrixNotPositiveDefiniteError } from '../math/matrix-errors';
import { IPreconditioner, PreconditionerType } from './preconditioner.interface';

export class JacobiPreconditioner implements IPreconditioner {
  public readonly id: PreconditionerType = 'jacobi';
  public readonly name = 'Precondicionador de Jacobi (Diagonal, M = diag(A))';
  public readonly description =
    'M = diag(A). Escala cada componente independientemente por su rigidez diagonal (z_i = r_i / a_ii). ' +
    'Ideal para mitigar el mal condicionamiento por disparidad de escala en categorías TI.';

  private diagInv: number[] = [];

  public initialize(A: readonly (readonly number[])[]): void {
    const n = A.length;
    this.diagInv = new Array(n);

    for (let i = 0; i < n; i++) {
      const aii = A[i][i];
      if (aii <= 1e-15) {
        throw new MatrixNotPositiveDefiniteError(
          i,
          aii,
          'Inicialización del Precondicionador de Jacobi (a_ii > 0 requerido)'
        );
      }
      this.diagInv[i] = 1.0 / aii;
    }
  }

  public solve(r: readonly number[]): number[] {
    const n = r.length;
    const z: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      z[i] = r[i] * this.diagInv[i];
    }
    return z;
  }

  public getPreconditionedMatrix(A: readonly (readonly number[])[]): number[][] {
    const n = A.length;
    const prec = deepCloneMatrix(A);
    for (let i = 0; i < n; i++) {
      const inv = this.diagInv[i];
      for (let j = 0; j < n; j++) {
        prec[i][j] = A[i][j] * inv;
      }
    }
    return prec;
  }

  public getConditionNumber(A: readonly (readonly number[])[]): number {
    const precA = this.getPreconditionedMatrix(A);
    return computeConditionNumber(precA, '1');
  }
}
