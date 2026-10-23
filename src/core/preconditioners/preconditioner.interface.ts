/**
 * @file preconditioner.interface.ts
 * @description Interfaz común (Patrón Strategy) para los operadores precondicionadores en GCP.
 * Permite intercambiar dinámicamente entre precondicionadores (Identidad, Jacobi e IC(0))
 * manteniendo el desacoplamiento estricto según los principios SOLID (Inversión de Dependencias).
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

/**
 * Identificador de tipo de precondicionador soportado.
 */
export type PreconditionerType = 'identity' | 'jacobi' | 'incomplete_cholesky';

/**
 * Contrato formal para precondicionadores simétricos y definidos positivos (SPD).
 */
export interface IPreconditioner {
  /** Identificador único del precondicionador */
  readonly id: PreconditionerType;
  /** Nombre formal legible */
  readonly name: string;
  /** Descripción del principio operativo matemático */
  readonly description: string;

  /**
   * Inicializa y precalcula los factores de la matriz precondicionadora M a partir de A.
   * 
   * @param A - Matriz de coeficientes del sistema original (SPD)
   */
  initialize(A: readonly (readonly number[])[]): void;

  /**
   * Resuelve el sistema lineal precondicionado M * z = r para obtener el gradiente precondicionado z.
   * Operación central del paso Suñagua (2020): z_k = M^-1 * r_k.
   * 
   * @param r - Vector residual actual r_k
   * @returns Vector precondicionado z_k
   */
  solve(r: readonly number[]): number[];

  /**
   * Retorna la matriz del sistema precondicionado: M^-1 * A.
   * 
   * @param A - Matriz original
   * @returns Matriz M^-1 * A
   */
  getPreconditionedMatrix(A: readonly (readonly number[])[]): number[][];

  /**
   * Calcula el número de condición formal de la matriz precondicionada: kappa(M^-1 * A).
   * 
   * @param A - Matriz original
   * @returns Número de condición kappa(M^-1 * A)
   */
  getConditionNumber(A: readonly (readonly number[])[]): number;
}
