/**
 * @file preconditioner-factory.ts
 * @description Fábrica (Factory Pattern) para instanciación desacoplada de precondicionadores.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import { IdentityPreconditioner } from './identity-preconditioner';
import { IncompleteCholeskyPreconditioner } from './incomplete-cholesky';
import { JacobiPreconditioner } from './jacobi-preconditioner';
import { IPreconditioner, PreconditionerType } from './preconditioner.interface';

export class PreconditionerFactory {
  /**
   * Crea e inicializa una instancia de precondicionador a partir de su tipo y matriz de coeficientes.
   * 
   * @param type - Tipo de precondicionador deseado ('identity' | 'jacobi' | 'incomplete_cholesky')
   * @param A - Matriz de coeficientes A para precalcular factores (opcional)
   */
  public static create(
    type: PreconditionerType,
    A?: readonly (readonly number[])[]
  ): IPreconditioner {
    let preconditioner: IPreconditioner;

    switch (type) {
      case 'jacobi':
        preconditioner = new JacobiPreconditioner();
        break;
      case 'incomplete_cholesky':
        preconditioner = new IncompleteCholeskyPreconditioner();
        break;
      case 'identity':
      default:
        preconditioner = new IdentityPreconditioner();
        break;
    }

    if (A) {
      preconditioner.initialize(A);
    }

    return preconditioner;
  }

  /**
   * Retorna la lista de precondicionadores disponibles con sus metadatos descriptivos.
   */
  public static getAvailablePreconditioners(): readonly {
    readonly id: PreconditionerType;
    readonly name: string;
    readonly description: string;
  }[] {
    return [
      {
        id: 'identity',
        name: 'Sin Precondicionador (GC Simple, M = I)',
        description: 'Gradiente Conjugado clásico sin modificación del sistema.'
      },
      {
        id: 'jacobi',
        name: 'Precondicionador de Jacobi (Diagonal, M = diag(A))',
        description: 'Escala cada componente normalizando la dispersión por rigidez de costes.'
      },
      {
        id: 'incomplete_cholesky',
        name: 'Cholesky Incompleto IC(0) (M = L_tilde * L_tilde^T)',
        description: 'Aproximación triangular que reduce drásticamente las dependencias cruzadas.'
      }
    ];
  }
}
