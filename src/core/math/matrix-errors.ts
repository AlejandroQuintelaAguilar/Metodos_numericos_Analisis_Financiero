/**
 * @file matrix-errors.ts
 * @description Jerarquía de errores tipados para validaciones matemáticas y algebraicas.
 * Permite al sistema y a la interfaz de usuario capturar fallas de dominio de forma elegante
 * sin colapsar la aplicación (requisito crítico del módulo QA y mención Desarrollo de Sistemas).
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

/**
 * Error base para cualquier anomalía en operaciones matriciales o vectoriales.
 */
export abstract class NumericalModelError extends Error {
  public abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Lanzado cuando las dimensiones de una matriz o vector no coinciden con las requeridas por la operación.
 */
export class MatrixDimensionError extends NumericalModelError {
  public readonly errorCode = 'ERR_MATRIX_DIMENSION_MISMATCH';

  constructor(
    public readonly expectedRows: number,
    public readonly expectedCols: number,
    public readonly actualRows: number,
    public readonly actualCols: number,
    context?: string
  ) {
    super(
      `Discrepancia de dimensiones en ${context ?? 'operación matricial'}: ` +
      `se esperaba [${expectedRows}x${expectedCols}], pero se recibió [${actualRows}x${actualCols}].`
    );
  }
}

/**
 * Lanzado cuando una matriz no satisface la propiedad de simetría formal: A != A^T.
 */
export class MatrixNotSymmetricError extends NumericalModelError {
  public readonly errorCode = 'ERR_MATRIX_NOT_SYMMETRIC';

  constructor(
    public readonly row: number,
    public readonly col: number,
    public readonly aij: number,
    public readonly aji: number,
    public readonly maxDifference: number,
    public readonly tolerance: number = 1e-12
  ) {
    super(
      `La matriz no es simétrica (A != A^T): A[${row}][${col}] = ${aij} difiere de A[${col}][${row}] = ${aji} ` +
      `(diferencia absoluta: ${Math.abs(aij - aji).toExponential(4)} > tolerancia: ${tolerance.toExponential(4)}).`
    );
  }
}

/**
 * Lanzado cuando una matriz simétrica no es estrictamente definida positiva (SPD).
 * Puede ocurrir durante la factorización de Cholesky (pivote no positivo) o en el Criterio de Sylvester.
 */
export class MatrixNotPositiveDefiniteError extends NumericalModelError {
  public readonly errorCode = 'ERR_MATRIX_NOT_POSITIVE_DEFINITE';

  constructor(
    public readonly pivotIndex: number,
    public readonly pivotValue: number,
    public readonly context: string = 'Factorización de Cholesky'
  ) {
    super(
      `La matriz no es estrictamente definida positiva (SPD) en ${context}. ` +
      `El pivote diagonal o menor principal en el índice [${pivotIndex}] resultó no positivo: ` +
      `${pivotValue.toFixed(6)} <= 0. La factorización Cholesky (A = L*L^T) y el método GC requieren A > 0.`
    );
  }
}

/**
 * Lanzado cuando un vector requerido como denominador o normalizador posee norma cero (ej. ||b||_2 = 0).
 */
export class ZeroVectorError extends NumericalModelError {
  public readonly errorCode = 'ERR_ZERO_VECTOR_NORM';

  constructor(public readonly vectorName: string = 'vector de demanda b') {
    super(
      `El ${vectorName} tiene norma euclídea cero (||v||_2 = 0). ` +
      `No es posible normalizar el residuo relativo de parada ||r_k||_2 / ||b||_2.`
    );
  }
}

/**
 * Lanzado cuando el solver iterativo alcanza el número máximo de iteraciones sin converger.
 */
export class NonConvergenceWarning extends NumericalModelError {
  public readonly errorCode = 'WARN_NON_CONVERGENCE';

  constructor(
    public readonly maxIterations: number,
    public readonly finalRelativeResidual: number,
    public readonly tolerance: number
  ) {
    super(
      `El algoritmo no alcanzó la tolerancia requerida (${tolerance.toExponential(4)}) ` +
      `tras ${maxIterations} iteraciones máximas. Residuo relativo final: ${finalRelativeResidual.toExponential(4)}.`
    );
  }
}
