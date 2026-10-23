/**
 * @file identity-preconditioner.ts
 * @description Precondicionador Identidad (M = I): Representa la ausencia de precondicionamiento.
 * Cuando se utiliza con GCP, el algoritmo reproduce idénticamente el método de Gradiente Conjugado simple (GC).
 * Sirve como baseline de referencia y elemento de contraste exigido en la Sección 6.3.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import {
  computeConditionNumber,
  deepCloneMatrix,
  deepCloneVector
} from '../math/linear-algebra';
import { IPreconditioner, PreconditionerType } from './preconditioner.interface';

export class IdentityPreconditioner implements IPreconditioner {
  public readonly id: PreconditionerType = 'identity';
  public readonly name = 'Identidad (Sin Precondicionador, M = I)';
  public readonly description =
    'M = I. No altera el sistema original (M*z = r => z = r). ' +
    'Ejecuta el método de Gradientes Conjugados clásico.';

  public initialize(_A: readonly (readonly number[])[]): void {
    // La matriz identidad no requiere precomputación
  }

  public solve(r: readonly number[]): number[] {
    return deepCloneVector(r);
  }

  public getPreconditionedMatrix(A: readonly (readonly number[])[]): number[][] {
    return deepCloneMatrix(A);
  }

  public getConditionNumber(A: readonly (readonly number[])[]): number {
    return computeConditionNumber(A, '1');
  }
}
