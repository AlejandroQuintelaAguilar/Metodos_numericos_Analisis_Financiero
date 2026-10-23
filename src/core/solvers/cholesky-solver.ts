/**
 * @file cholesky-solver.ts
 * @description Método directo de referencia: Factorización de Cholesky (A = L * L^T).
 * Resuelve el sistema lineal simétrico y definido positivo A * x = b para obtener
 * la Solución Numérica de Referencia (clasificada formalmente como "Solución Exacta").
 * 
 * Requerimiento de la Sección 6.2 de la consigna oficial UMSA:
 * - Descomposición A = L * L^T (L triangular inferior con l_ii > 0).
 * - Detección estricta de no positividad con lanzamiento de MatrixNotPositiveDefiniteError.
 * - Resolución en dos etapas: L * y = b (progresiva) y L^T * x = y (regresiva).
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import {
  assertSymmetry,
  createZeroMatrix,
  matrixVectorMultiply,
  solveLowerTriangular,
  solveUpperTriangular,
  transpose,
  validateNonZeroDemand
} from '../math/linear-algebra';
import {
  MatrixDimensionError,
  MatrixNotPositiveDefiniteError
} from '../math/matrix-errors';
import { CholeskyFactorizationResult } from '../types/solver.types';

/**
 * Calcula la descomposición de Cholesky de una matriz simétrica y definida positiva (SPD):
 * A = L * L^T.
 * 
 * Algoritmo de Cholesky-Banachiewicz (por columnas):
 * Para cada columna j = 0, ..., n-1:
 *   l_jj = sqrt( a_jj - sum_{k=0}^{j-1} l_jk^2 )   [debe ser estrictamente > 0]
 *   Para cada fila i = j+1, ..., n-1:
 *     l_ij = ( a_ij - sum_{k=0}^{j-1} l_ik * l_jk ) / l_jj
 * 
 * @param A - Matriz simétrica cuadrada de coeficientes (SPD)
 * @param validateSymmetry - Si es true, valida formalmente A = A^T antes de factorizar
 * @returns Matriz triangular inferior L
 * @throws {MatrixNotPositiveDefiniteError} Si algún pivote diagonal l_jj^2 <= 0
 */
export function choleskyDecompose(
  A: readonly (readonly number[])[],
  validateSymmetry: boolean = true
): number[][] {
  const n = A.length;
  if (n === 0) return [];

  // Validar dimensiones cuadradas
  for (let i = 0; i < n; i++) {
    if (A[i].length !== n) {
      throw new MatrixDimensionError(n, n, n, A[i].length, 'Factorización de Cholesky (matriz cuadrada)');
    }
  }

  // Validar simetría formal A = A^T
  if (validateSymmetry) {
    assertSymmetry(A, 1e-12);
  }

  const L = createZeroMatrix(n);

  for (let j = 0; j < n; j++) {
    // 1. Elemento diagonal: l_jj
    let sumDiag = 0;
    for (let k = 0; k < j; k++) {
      const ljk = L[j][k];
      sumDiag += ljk * ljk;
    }

    const diagPivot = A[j][j] - sumDiag;
    if (diagPivot <= 1e-15) {
      // Si el pivote es menor o igual a cero, la matriz no es estrictamente definida positiva
      throw new MatrixNotPositiveDefiniteError(j, diagPivot, 'Factorización de Cholesky (A = L * L^T)');
    }

    const ljj = Math.sqrt(diagPivot);
    L[j][j] = ljj;

    // 2. Elementos subdiagonales: l_ij para i > j
    for (let i = j + 1; i < n; i++) {
      let sumSub = 0;
      for (let k = 0; k < j; k++) {
        sumSub += L[i][k] * L[j][k];
      }
      L[i][j] = (A[i][j] - sumSub) / ljj;
    }
  }

  return L;
}

/**
 * Resuelve el sistema lineal A * x = b utilizando el método directo de Cholesky (A = L * L^T).
 * 
 * Etapas:
 * 1. Factorización directa: A = L * L^T
 * 2. Sustitución progresiva: L * y = b
 * 3. Sustitución regresiva: L^T * x = y
 * 
 * @param A - Matriz de coeficientes SPD
 * @param b - Vector de demandas
 * @param validateSymmetry - Si valida simetría formal
 * @returns Resultado completo con x_ref, matrices L y L^T, residuo exacto y tiempo de cómputo
 */
export function solveCholesky(
  A: readonly (readonly number[])[],
  b: readonly number[],
  validateSymmetry: boolean = true
): CholeskyFactorizationResult {
  const startTime = performance.now();
  const normB = validateNonZeroDemand(b);

  // 1. Descomposición A = L * L^T
  const L = choleskyDecompose(A, validateSymmetry);
  const LT = transpose(L);

  // 2. Sustitución progresiva: L * y = b
  const y = solveLowerTriangular(L, b);

  // 3. Sustitución regresiva: L^T * x = y
  const xRef = solveUpperTriangular(LT, y);

  const endTime = performance.now();
  const executionTimeMs = Math.max(0, endTime - startTime);

  // Calcular residuo analítico de verificación: r = b - A * x_ref
  const Ax = matrixVectorMultiply(A, xRef);
  let sumResSq = 0;
  for (let i = 0; i < b.length; i++) {
    const diff = b[i] - Ax[i];
    sumResSq += diff * diff;
  }
  const residualNorm = Math.sqrt(sumResSq);
  const relativeResidual = residualNorm / normB;

  return {
    L,
    LT,
    xRef,
    residualNorm,
    relativeResidual,
    executionTimeMs
  };
}
