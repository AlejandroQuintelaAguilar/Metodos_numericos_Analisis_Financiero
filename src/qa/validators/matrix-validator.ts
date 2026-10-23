/**
 * @file matrix-validator.ts
 * @description Validador matemático defensivo para matrices y vectores de entrada.
 * Diseñado bajo principios de resiliencia para la mención Desarrollo de Sistemas:
 * intercepta anomalías matemáticas (no simetría, falta de positividad, dimensiones inválidas)
 * y retorna diagnósticos estructurados sin colapsar la aplicación web ni lanzar excepciones fatales.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import { norm2 } from '../../core/math/linear-algebra';
import {
  MatrixValidationResult,
  ValidationErrorItem
} from '../types/qa.types';

export interface ValidationOptions {
  /** Dimensión mínima exigida (por defecto: 4 según consigna UMSA) */
  readonly minDimension?: number;
  /** Tolerancia de simetría formal: |a_ij - a_ji| <= tolerance (por defecto: 1e-12) */
  readonly symmetryTolerance?: number;
}

export class MatrixValidator {
  /**
   * Valida exhaustivamente una matriz A y opcionalmente un vector de demandas b.
   * 
   * @param A - Matriz de rigidez e interdependencia
   * @param b - Vector de demandas presupuestarias (opcional)
   * @param options - Opciones de tolerancia y límites
   * @returns MatrixValidationResult con diagnóstico completo y lista de errores/advertencias
   */
  public static validateSystem(
    A: readonly (readonly number[])[],
    b?: readonly number[],
    options: ValidationOptions = {}
  ): MatrixValidationResult {
    const minDim = options.minDimension ?? 4;
    const symTol = options.symmetryTolerance ?? 1e-12;

    const errors: ValidationErrorItem[] = [];
    const warnings: ValidationErrorItem[] = [];

    // 1. Validación de existencia y no vacuidad
    if (!A || !Array.isArray(A) || A.length === 0) {
      errors.push({
        code: 'ERR_EMPTY_MATRIX',
        message: 'La matriz de coeficientes A no puede estar vacía.',
        severity: 'error'
      });
      return this.createInvalidResult(0, false, false, 0, errors, warnings);
    }

    const n = A.length;

    // 2. Validación de dimensión mínima (n >= 4)
    if (n < minDim) {
      errors.push({
        code: 'ERR_MIN_DIMENSION',
        message: `La dimensión del sistema (n = ${n}) es menor que la mínima requerida (n >= ${minDim}).`,
        severity: 'error',
        context: { value: n, expected: `>= ${minDim}` }
      });
    }

    // 3. Validación de matriz cuadrada y valores numéricos finitos
    let isSquare = true;
    for (let i = 0; i < n; i++) {
      const row = A[i];
      if (!Array.isArray(row) || row.length !== n) {
        isSquare = false;
        errors.push({
          code: 'ERR_NOT_SQUARE_MATRIX',
          message: `La fila [${i}] tiene longitud ${row?.length ?? 0}, difiriendo de la dimensión esperada ${n}.`,
          severity: 'error',
          context: { row: i, value: row?.length ?? 0, expected: `${n}` }
        });
      } else {
        for (let j = 0; j < n; j++) {
          const val = row[j];
          if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
            errors.push({
              code: 'ERR_INVALID_NUMERIC_VALUE',
              message: `El elemento en la posición [${i}, ${j}] no es un número finito válido.`,
              severity: 'error',
              context: { row: i, col: j, value: val }
            });
          }
        }
      }
    }

    if (!isSquare) {
      return this.createInvalidResult(n, false, false, 0, errors, warnings);
    }

    // 4. Validación de simetría formal: A = A^T
    let isSymmetric = true;
    let maxDiff = 0;
    let maxDiffCoords: { row: number; col: number } | undefined;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = Math.abs(A[i][j] - A[j][i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          maxDiffCoords = { row: i, col: j };
        }
      }
    }

    if (maxDiff > symTol) {
      isSymmetric = false;
      const r = maxDiffCoords?.row ?? 0;
      const c = maxDiffCoords?.col ?? 0;
      errors.push({
        code: 'ERR_ASYMMETRIC_MATRIX',
        message: `La matriz no es simétrica (A != A^T). En [${r}, ${c}] = ${A[r][c]} difiere de [${c}, ${r}] = ${A[c][r]} (discrepancia: ${maxDiff.toExponential(4)} > tol: ${symTol.toExponential(4)}).`,
        severity: 'error',
        context: { row: r, col: c, value: maxDiff }
      });
    }

    // 5. Validación de positividad diagonal preliminar: a_ii > 0
    let hasNonPositiveDiagonal = false;
    for (let i = 0; i < n; i++) {
      if (A[i][i] <= 0) {
        hasNonPositiveDiagonal = true;
        errors.push({
          code: 'ERR_NON_POSITIVE_DIAGONAL',
          message: `El elemento diagonal A[${i}, ${i}] = ${A[i][i]} es menor o igual a cero. Una matriz SPD requiere a_ii > 0.`,
          severity: 'error',
          context: { row: i, col: i, value: A[i][i] }
        });
      }
    }

    // 6. Validación de Definida Positiva (SPD) mediante Menores de Sylvester
    let isPositiveDefinite = !hasNonPositiveDiagonal;
    const sylvesterMinors: number[] = [];
    let spdFailureReason: string | undefined;

    if (!hasNonPositiveDiagonal) {
      // Cálculo de menores principales dominantes mediante eliminación gaussiana sin pivoteo
      const minorsCheck = this.computeSylvesterMinors(A);
      sylvesterMinors.push(...minorsCheck.minors);

      if (!minorsCheck.isSPD) {
        isPositiveDefinite = false;
        spdFailureReason = minorsCheck.failureReason;
        errors.push({
          code: 'ERR_NOT_POSITIVE_DEFINITE',
          message: minorsCheck.failureReason ?? 'La matriz no es estrictamente definida positiva (falló el Criterio de Sylvester).',
          severity: 'error'
        });
      }
    }

    // 7. Validación del vector de demanda b (si fue provisto)
    if (b !== undefined) {
      if (!Array.isArray(b) || b.length !== n) {
        errors.push({
          code: 'ERR_VECTOR_DIMENSION_MISMATCH',
          message: `La dimensión del vector de demanda (${b?.length ?? 0}) no coincide con la dimensión de la matriz (${n}).`,
          severity: 'error',
          context: { value: b?.length ?? 0, expected: `${n}` }
        });
      } else {
        const normB = norm2(b);
        if (normB === 0) {
          errors.push({
            code: 'ERR_ZERO_DEMAND_NORM',
            message: 'El vector de demanda b tiene norma euclídea cero (||b||_2 = 0). Se requiere ||b||_2 > 0 para calcular la tolerancia relativa.',
            severity: 'error'
          });
        }
      }
    }

    // 8. Advertencias heurísticas útiles para la toma de decisiones
    if (isSymmetric && isPositiveDefinite) {
      // Verificar si hay dominancia diagonal estricta
      let isDiagonallyDominant = true;
      for (let i = 0; i < n; i++) {
        let rowSum = 0;
        for (let j = 0; j < n; j++) {
          if (i !== j) rowSum += Math.abs(A[i][j]);
        }
        if (A[i][i] <= rowSum) {
          isDiagonallyDominant = false;
          break;
        }
      }

      if (!isDiagonallyDominant) {
        warnings.push({
          code: 'WARN_NOT_DIAGONALLY_DOMINANT',
          message: 'La matriz no es diagonalmente dominante; se recomienda utilizar precondicionador (Jacobi o Cholesky Incompleto) para acelerar la convergencia.',
          severity: 'warning'
        });
      }
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      isSquare,
      dimension: n,
      isSymmetric,
      symmetryMaxDiff: maxDiff,
      asymmetryCoordinates: maxDiffCoords,
      isPositiveDefinite,
      sylvesterMinors,
      spdFailureReason,
      errors,
      warnings
    };
  }

  /**
   * Calcula los menores principales dominantes y verifica el Criterio de Sylvester.
   */
  private static computeSylvesterMinors(A: readonly (readonly number[])[]): {
    readonly isSPD: boolean;
    readonly minors: number[];
    readonly failureReason?: string;
  } {
    const n = A.length;
    const minors: number[] = [];

    // Para n = 4, podemos calcular directamente los determinantes de las submatrices 1x1, 2x2, 3x3 y 4x4
    for (let k = 1; k <= n; k++) {
      const subMatrix: number[][] = [];
      for (let i = 0; i < k; i++) {
        subMatrix.push(A[i].slice(0, k));
      }

      const detK = this.computeDeterminant(subMatrix);
      minors.push(detK);

      if (detK <= 1e-12) {
        return {
          isSPD: false,
          minors,
          failureReason: `El menor principal de orden [${k}] es no positivo (Delta_${k} = ${detK.toExponential(4)} <= 0). Por el Criterio de Sylvester, A no es SPD.`
        };
      }
    }

    return { isSPD: true, minors };
  }

  /**
   * Calcula el determinante de una matriz cuadrada de dimensión k x k mediante eliminación gaussiana.
   */
  public static computeDeterminant(M: readonly (readonly number[])[]): number {
    const k = M.length;
    if (k === 0) return 1;
    if (k === 1) return M[0][0];
    if (k === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];

    // Clonar para operaciones elementales de fila
    const A: number[][] = M.map(row => [...row]);
    let det = 1;
    let sign = 1;

    for (let col = 0; col < k; col++) {
      // Pivoteo parcial
      let pivotRow = col;
      let maxVal = Math.abs(A[col][col]);
      for (let row = col + 1; row < k; row++) {
        const val = Math.abs(A[row][col]);
        if (val > maxVal) {
          maxVal = val;
          pivotRow = row;
        }
      }

      if (maxVal < 1e-15) {
        return 0; // Matriz singular
      }

      if (pivotRow !== col) {
        const temp = A[col];
        A[col] = A[pivotRow];
        A[pivotRow] = temp;
        sign = -sign;
      }

      const pivot = A[col][col];
      det *= pivot;

      for (let row = col + 1; row < k; row++) {
        const factor = A[row][col] / pivot;
        for (let j = col + 1; j < k; j++) {
          A[row][j] -= factor * A[col][j];
        }
      }
    }

    return sign * det;
  }

  private static createInvalidResult(
    dimension: number,
    isSquare: boolean,
    isSymmetric: boolean,
    symmetryMaxDiff: number,
    errors: ValidationErrorItem[],
    warnings: ValidationErrorItem[]
  ): MatrixValidationResult {
    return {
      isValid: false,
      isSquare,
      dimension,
      isSymmetric,
      symmetryMaxDiff,
      isPositiveDefinite: false,
      sylvesterMinors: [],
      errors,
      warnings
    };
  }
}
