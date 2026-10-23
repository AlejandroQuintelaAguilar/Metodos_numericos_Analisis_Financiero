/**
 * @file linear-algebra.ts
 * @description Módulo fundamental de operaciones de álgebra lineal pura en TypeScript estricto.
 * Implementación nativa, predecible y sin dependencias externas (Clean Architecture).
 * 
 * Cumple con todos los requerimientos de la Sección 6 y 9 de la consigna oficial:
 * - Operaciones vectoriales: suma, resta, producto punto, norma euclídea L2, escalamiento.
 * - Operaciones matriciales: multiplicación matriz-vector, matriz-matriz, transposición, simetría.
 * - Resolución de sistemas triangulares (sustitución progresiva y regresiva).
 * - Cálculo de normas matriciales e inversión directa para análisis de condicionamiento.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import {
  MatrixDimensionError,
  MatrixNotSymmetricError,
  ZeroVectorError
} from './matrix-errors';

/**
 * Calcula el producto escalar (punto) entre dos vectores en R^n: <u, v> = sum(u_i * v_i).
 * 
 * @param u - Primer vector
 * @param v - Segundo vector
 * @returns Escalar resultado del producto interno
 * @throws {MatrixDimensionError} Si las longitudes de u y v difieren
 */
export function dotProduct(u: readonly number[], v: readonly number[]): number {
  if (u.length !== v.length) {
    throw new MatrixDimensionError(u.length, 1, v.length, 1, 'producto punto dotProduct');
  }

  let sum = 0;
  for (let i = 0; i < u.length; i++) {
    sum += u[i] * v[i];
  }
  return sum;
}

/**
 * Multiplica una matriz A de dimensión m x n por un vector x de dimensión n: y = A * x.
 * 
 * @param A - Matriz bidimensional de coeficientes (m filas x n columnas)
 * @param x - Vector columna de dimensión n
 * @returns Vector resultado y de dimensión m
 * @throws {MatrixDimensionError} Si el número de columnas de A no coincide con la longitud de x
 */
export function matrixVectorMultiply(
  A: readonly (readonly number[])[],
  x: readonly number[]
): number[] {
  const m = A.length;
  if (m === 0) return [];
  const n = A[0].length;

  if (n !== x.length) {
    throw new MatrixDimensionError(m, x.length, m, n, 'multiplicación matriz-vector');
  }

  const result: number[] = new Array(m);
  for (let i = 0; i < m; i++) {
    let sum = 0;
    const row = A[i];
    for (let j = 0; j < n; j++) {
      sum += row[j] * x[j];
    }
    result[i] = sum;
  }
  return result;
}

/**
 * Calcula la norma euclídea (L2) de un vector en R^n: ||v||_2 = sqrt(sum(v_i^2)).
 * Implementa escalamiento numérico para prevenir desbordamiento (overflow) o subdesbordamiento (underflow).
 * 
 * @param v - Vector de entrada
 * @returns Magnitud euclídea no negativa
 */
export function norm2(v: readonly number[]): number {
  if (v.length === 0) return 0;

  // Encontrar el valor absoluto máximo para escalamiento numéricamente estable
  let maxAbs = 0;
  for (let i = 0; i < v.length; i++) {
    const absVal = Math.abs(v[i]);
    if (absVal > maxAbs) maxAbs = absVal;
  }

  if (maxAbs === 0) return 0;

  let sumSquares = 0;
  for (let i = 0; i < v.length; i++) {
    const scaled = v[i] / maxAbs;
    sumSquares += scaled * scaled;
  }
  return maxAbs * Math.sqrt(sumSquares);
}

/**
 * Calcula la suma de dos vectores en R^n: w = u + v.
 * 
 * @param u - Primer vector
 * @param v - Segundo vector
 * @returns Vector suma w
 * @throws {MatrixDimensionError} Si las longitudes difieren
 */
export function vectorAdd(u: readonly number[], v: readonly number[]): number[] {
  if (u.length !== v.length) {
    throw new MatrixDimensionError(u.length, 1, v.length, 1, 'suma de vectores vectorAdd');
  }

  const result: number[] = new Array(u.length);
  for (let i = 0; i < u.length; i++) {
    result[i] = u[i] + v[i];
  }
  return result;
}

/**
 * Calcula la resta de dos vectores en R^n: w = u - v.
 * 
 * @param u - Vector minuendo
 * @param v - Vector sustraendo
 * @returns Vector diferencia w
 * @throws {MatrixDimensionError} Si las longitudes difieren
 */
export function vectorSubtract(u: readonly number[], v: readonly number[]): number[] {
  if (u.length !== v.length) {
    throw new MatrixDimensionError(u.length, 1, v.length, 1, 'resta de vectores vectorSubtract');
  }

  const result: number[] = new Array(u.length);
  for (let i = 0; i < u.length; i++) {
    result[i] = u[i] - v[i];
  }
  return result;
}

/**
 * Multiplica un vector por un escalar: w = alpha * v.
 * 
 * @param alpha - Escalar multiplicador
 * @param v - Vector de entrada
 * @returns Vector escalado w
 */
export function scalarMultiply(alpha: number, v: readonly number[]): number[] {
  const result: number[] = new Array(v.length);
  for (let i = 0; i < v.length; i++) {
    result[i] = alpha * v[i];
  }
  return result;
}

/**
 * Operación combinada tipo BLAS daxpy: w = u + alpha * v.
 * Optimiza la actualización de vectores en gradientes conjugados evitando asignaciones intermedias.
 * 
 * @param u - Vector base u
 * @param alpha - Escalar multiplicador de v
 * @param v - Vector v a ser escalado y sumado
 * @returns Nuevo vector u + alpha * v
 */
export function vectorScaleAndAdd(
  u: readonly number[],
  alpha: number,
  v: readonly number[]
): number[] {
  if (u.length !== v.length) {
    throw new MatrixDimensionError(u.length, 1, v.length, 1, 'operación vectorScaleAndAdd');
  }

  const result: number[] = new Array(u.length);
  for (let i = 0; i < u.length; i++) {
    result[i] = u[i] + alpha * v[i];
  }
  return result;
}

/**
 * Calcula la transpuesta de una matriz A: (A^T)_ij = A_ji.
 * 
 * @param A - Matriz bidimensional de dimensiones m x n
 * @returns Nueva matriz transpuesta de dimensiones n x m
 */
export function transpose(A: readonly (readonly number[])[]): number[][] {
  const m = A.length;
  if (m === 0) return [];
  const n = A[0].length;

  const AT: number[][] = Array.from({ length: n }, () => new Array(m));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      AT[j][i] = A[i][j];
    }
  }
  return AT;
}

/**
 * Valida formalmente si una matriz cuadrada es simétrica dentro de una tolerancia establecida:
 * |A_ij - A_ji| <= tolerance para todo i, j.
 * 
 * @param A - Matriz cuadrada a verificar
 * @param tolerance - Tolerancia absoluta de simetría (por defecto: 1e-12)
 * @returns Objeto con estado booleano, error máximo absoluto e índices de la mayor discrepancia
 */
export function verifySymmetry(
  A: readonly (readonly number[])[],
  tolerance: number = 1e-12
): {
  readonly isSymmetric: boolean;
  readonly maxDiff: number;
  readonly maxDiffRow: number;
  readonly maxDiffCol: number;
} {
  const n = A.length;
  if (n === 0) {
    return { isSymmetric: true, maxDiff: 0, maxDiffRow: 0, maxDiffCol: 0 };
  }

  let maxDiff = 0;
  let maxDiffRow = 0;
  let maxDiffCol = 0;

  for (let i = 0; i < n; i++) {
    if (A[i].length !== n) {
      throw new MatrixDimensionError(n, n, n, A[i].length, 'verificación de simetría (matriz cuadrada)');
    }
    for (let j = i + 1; j < n; j++) {
      const diff = Math.abs(A[i][j] - A[j][i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        maxDiffRow = i;
        maxDiffCol = j;
      }
    }
  }

  const isSymmetric = maxDiff <= tolerance;
  return { isSymmetric, maxDiff, maxDiffRow, maxDiffCol };
}

/**
 * Asegura que la matriz sea simétrica; si no lo es, lanza un MatrixNotSymmetricError tipado.
 * 
 * @param A - Matriz a validar
 * @param tolerance - Tolerancia de simetría (por defecto: 1e-12)
 */
export function assertSymmetry(
  A: readonly (readonly number[])[],
  tolerance: number = 1e-12
): void {
  const result = verifySymmetry(A, tolerance);
  if (!result.isSymmetric) {
    const i = result.maxDiffRow;
    const j = result.maxDiffCol;
    throw new MatrixNotSymmetricError(i, j, A[i][j], A[j][i], result.maxDiff, tolerance);
  }
}

/**
 * Crea un vector de dimensión n inicializado en cero: [0, ..., 0]^T.
 * 
 * @param n - Dimensión del vector
 */
export function createZeroVector(n: number): number[] {
  return new Array(n).fill(0);
}

/**
 * Crea una matriz n x n inicializada en ceros.
 * 
 * @param n - Dimensión de la matriz cuadrada
 */
export function createZeroMatrix(n: number): number[][] {
  return Array.from({ length: n }, () => new Array(n).fill(0));
}

/**
 * Crea una matriz identidad I de dimensión n x n.
 * 
 * @param n - Dimensión de la matriz cuadrada
 */
export function createIdentityMatrix(n: number): number[][] {
  const I = createZeroMatrix(n);
  for (let i = 0; i < n; i++) {
    I[i][i] = 1;
  }
  return I;
}

/**
 * Realiza una copia profunda de una matriz bidimensional.
 * 
 * @param A - Matriz original
 */
export function deepCloneMatrix(A: readonly (readonly number[])[]): number[][] {
  return A.map(row => [...row]);
}

/**
 * Realiza una copia profunda de un vector numérico.
 * 
 * @param v - Vector original
 */
export function deepCloneVector(v: readonly number[]): number[] {
  return [...v];
}

/**
 * Resuelve un sistema triangular inferior con elementos diagonales no nulos por sustitución progresiva:
 * L * y = b.
 * 
 * @param L - Matriz triangular inferior (L_ij = 0 para j > i) con L_ii != 0
 * @param b - Vector de términos independientes
 * @returns Vector solución y
 */
export function solveLowerTriangular(
  L: readonly (readonly number[])[],
  b: readonly number[]
): number[] {
  const n = L.length;
  if (n !== b.length) {
    throw new MatrixDimensionError(n, n, n, b.length, 'sustitución progresiva L*y = b');
  }

  const y: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    const row = L[i];
    for (let j = 0; j < i; j++) {
      sum += row[j] * y[j];
    }
    const diag = row[i];
    if (Math.abs(diag) < 1e-15) {
      throw new Error(`Elemento diagonal nulo o casi singular en sustitución progresiva fila [${i}]: ${diag}`);
    }
    y[i] = (b[i] - sum) / diag;
  }
  return y;
}

/**
 * Resuelve un sistema triangular superior con elementos diagonales no nulos por sustitución regresiva:
 * U * x = y.
 * 
 * @param U - Matriz triangular superior (U_ij = 0 para j < i) con U_ii != 0
 * @param y - Vector de términos independientes
 * @returns Vector solución x
 */
export function solveUpperTriangular(
  U: readonly (readonly number[])[],
  y: readonly number[]
): number[] {
  const n = U.length;
  if (n !== y.length) {
    throw new MatrixDimensionError(n, n, n, y.length, 'sustitución regresiva U*x = y');
  }

  const x: number[] = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    const row = U[i];
    for (let j = i + 1; j < n; j++) {
      sum += row[j] * x[j];
    }
    const diag = row[i];
    if (Math.abs(diag) < 1e-15) {
      throw new Error(`Elemento diagonal nulo o casi singular en sustitución regresiva fila [${i}]: ${diag}`);
    }
    x[i] = (y[i] - sum) / diag;
  }
  return x;
}

/**
 * Multiplica dos matrices cuadradas o rectangulares compatibles: C = A * B.
 * 
 * @param A - Matriz de dimensión m x p
 * @param B - Matriz de dimensión p x n
 * @returns Matriz C de dimensión m x n
 */
export function matrixMultiply(
  A: readonly (readonly number[])[],
  B: readonly (readonly number[])[]
): number[][] {
  const m = A.length;
  if (m === 0) return [];
  const p = A[0].length;
  const n = B[0].length;

  if (p !== B.length) {
    throw new MatrixDimensionError(m, B.length, m, p, 'multiplicación matricial A * B');
  }

  const C: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    const rowA = A[i];
    for (let k = 0; k < p; k++) {
      const aVal = rowA[k];
      const rowB = B[k];
      for (let j = 0; j < n; j++) {
        C[i][j] += aVal * rowB[j];
      }
    }
  }
  return C;
}

/**
 * Calcula la norma infinito de una matriz: ||A||_inf = max_i sum_j |A_ij| (suma máxima de filas).
 * 
 * @param A - Matriz de entrada
 */
export function matrixInfinityNorm(A: readonly (readonly number[])[]): number {
  let maxRowSum = 0;
  for (let i = 0; i < A.length; i++) {
    let rowSum = 0;
    const row = A[i];
    for (let j = 0; j < row.length; j++) {
      rowSum += Math.abs(row[j]);
    }
    if (rowSum > maxRowSum) maxRowSum = rowSum;
  }
  return maxRowSum;
}

/**
 * Calcula la norma 1 de una matriz: ||A||_1 = max_j sum_i |A_ij| (suma máxima de columnas).
 * 
 * @param A - Matriz de entrada
 */
export function matrix1Norm(A: readonly (readonly number[])[]): number {
  if (A.length === 0) return 0;
  const m = A.length;
  const n = A[0].length;
  let maxColSum = 0;

  for (let j = 0; j < n; j++) {
    let colSum = 0;
    for (let i = 0; i < m; i++) {
      colSum += Math.abs(A[i][j]);
    }
    if (colSum > maxColSum) maxColSum = colSum;
  }
  return maxColSum;
}

/**
 * Invierte una matriz invertible utilizando eliminación de Gauss-Jordan con pivoteo parcial.
 * Utilizado primordialmente para cálculos de número de condición formal kappa(A) = ||A|| * ||A^-1||.
 * 
 * @param A - Matriz cuadrada n x n
 * @returns Matriz inversa A^-1
 */
export function invertMatrixGaussJordan(A: readonly (readonly number[])[]): number[][] {
  const n = A.length;
  // Construir matriz aumentada [A | I]
  const augmented: number[][] = Array.from({ length: n }, (_, i) => [
    ...A[i],
    ...Array.from({ length: n }, (__, j) => (i === j ? 1 : 0))
  ]);

  for (let col = 0; col < n; col++) {
    // Pivoteo parcial
    let maxRow = col;
    let maxVal = Math.abs(augmented[col][col]);
    for (let row = col + 1; row < n; row++) {
      const val = Math.abs(augmented[row][col]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = row;
      }
    }

    if (maxVal < 1e-15) {
      throw new Error(`Matriz singular o casi singular: pivote nulo en columna [${col}].`);
    }

    // Intercambio de filas
    if (maxRow !== col) {
      const temp = augmented[col];
      augmented[col] = augmented[maxRow];
      augmented[maxRow] = temp;
    }

    // Normalizar la fila pivote
    const pivot = augmented[col][col];
    for (let j = 0; j < 2 * n; j++) {
      augmented[col][j] /= pivot;
    }

    // Eliminar las demás filas
    for (let row = 0; row < n; row++) {
      if (row !== col) {
        const factor = augmented[row][col];
        if (factor !== 0) {
          for (let j = 0; j < 2 * n; j++) {
            augmented[row][j] -= factor * augmented[col][j];
          }
        }
      }
    }
  }

  // Extraer la mitad derecha correspondiente a A^-1
  const inv: number[][] = Array.from({ length: n }, (_, i) =>
    augmented[i].slice(n, 2 * n)
  );
  return inv;
}

/**
 * Calcula el número de condición formal en norma 1 o norma infinito: kappa(A) = ||A|| * ||A^-1||.
 * 
 * @param A - Matriz cuadrada
 * @param normType - '1' o 'inf' (por defecto: '1')
 */
export function computeConditionNumber(
  A: readonly (readonly number[])[],
  normType: '1' | 'inf' = '1'
): number {
  const invA = invertMatrixGaussJordan(A);
  if (normType === '1') {
    return matrix1Norm(A) * matrix1Norm(invA);
  } else {
    return matrixInfinityNorm(A) * matrixInfinityNorm(invA);
  }
}

/**
 * Valida que el vector b no sea un vector nulo para permitir el cálculo de la tolerancia relativa:
 * ||r_k||_2 / ||b||_2.
 * 
 * @param b - Vector de demanda
 * @returns La norma euclídea ||b||_2 garantizada > 0
 * @throws {ZeroVectorError} Si ||b||_2 == 0
 */
export function validateNonZeroDemand(b: readonly number[]): number {
  const normB = norm2(b);
  if (normB === 0) {
    throw new ZeroVectorError('vector de demanda b');
  }
  return normB;
}
