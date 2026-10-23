/**
 * @file solver.types.ts
 * @description Definición de tipos, interfaces y estructuras de datos para los algoritmos
 * de resolución numérica (Directo Cholesky, GC simple y GCP Suñagua 2020).
 * 
 * Enfoque: Clean Architecture, TypeScript estricto, inmutabilidad y telemetría algorítmica.
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

/**
 * Registro de telemetría de una iteración individual en algoritmos de gradientes conjugados.
 */
export interface IterationStep {
  /** Número de iteración k (0-based) */
  readonly iteration: number;
  /** Vector solución aproximado en el paso k: x_k */
  readonly x: readonly number[];
  /** Norma euclídea del vector residual: ||r_k||_2 */
  readonly residualNorm: number;
  /** Residuo relativo normalizado: ||r_k||_2 / ||b||_2 */
  readonly relativeResidual: number;
  /** Tamaño de paso en la dirección conjugada: alpha_k = (r_k^T * z_k) / (p_k^T * A * p_k) */
  readonly alpha: number;
  /** Factor de actualización de dirección: beta_k = (r_{k+1}^T * z_{k+1}) / (r_k^T * z_k) */
  readonly beta: number | null;
  /** Norma euclídea de la dirección de búsqueda: ||p_k||_2 */
  readonly searchDirectionNorm: number;
}

/**
 * Opciones de configuración para la ejecución de solvers iterativos.
 */
export interface SolverOptions {
  /** Tolerancia de parada relativa: ||r_k||_2 / ||b||_2 < tolerance (por defecto: 1e-6) */
  readonly tolerance?: number;
  /** Número máximo de iteraciones permitidas antes de declarar no convergencia (por defecto: 100) */
  readonly maxIterations?: number;
  /** Vector inicial de aproximación x_0 (por defecto: vector de ceros [0, ..., 0]^T) */
  readonly initialGuess?: readonly number[];
  /** Indicador para registrar el historial completo de telemetría paso a paso */
  readonly recordHistory?: boolean;
}

/**
 * Análisis de error para una componente individual del vector solución: x_i.
 */
export interface ComponentError {
  /** Índice de la componente (1-based: 1, 2, ..., n) */
  readonly index: number;
  /** Clave simbólica asociada en el modelo financiero (ej. 'x1', 'x2') */
  readonly variableKey: string;
  /** Valor de referencia exacto obtenido mediante el método directo de Cholesky */
  readonly xRef: number;
  /** Valor aproximado obtenido mediante el solver iterativo (GC o GCP) */
  readonly xApprox: number;
  /** Error absoluto: E_{a,i} = |x_{ref,i} - x_{approx,i}| */
  readonly absoluteError: number;
  /** Error relativo: E_{r,i} = E_{a,i} / |x_{ref,i}| (null si x_{ref,i} == 0) */
  readonly relativeError: number | null;
  /** Error porcentual: E_{p,i} = E_{r,i} * 100% (null si x_{ref,i} == 0) */
  readonly percentageError: number | null;
}

/**
 * Reporte consolidado de errores numéricos de acuerdo con la Sección 6.4 de la consigna.
 */
export interface ErrorAnalysis {
  /** Desglose detallado de error para cada componente i = 1, ..., n */
  readonly componentErrors: readonly ComponentError[];
  /** Máximo error absoluto observado: max_i |x_{ref,i} - x_{approx,i}| */
  readonly maxAbsoluteError: number;
  /** Máximo error relativo observado: max_i (E_{r,i}) */
  readonly maxRelativeError: number | null;
  /** Máximo error porcentual observado: max_i (E_{p,i}) */
  readonly maxPercentageError: number | null;
  /** Residuo relativo global: ||b - A * x_approx||_2 / ||b||_2 */
  readonly globalRelativeResidual: number;
  /** Norma euclídea del residuo final: ||b - A * x_approx||_2 */
  readonly finalResidualNorm: number;
}

/**
 * Resultado completo de la ejecución de un solver de sistemas lineales.
 */
export interface SolverResult {
  /** Nombre del método numérico ejecutado ('Cholesky (Directo)', 'GC Simple', 'GCP Suñagua (2020)') */
  readonly solverName: string;
  /** Nombre del precondicionador aplicado ('Ninguno', 'Jacobi (Diagonal)', 'Cholesky Incompleto IC(0)') */
  readonly preconditionerName: string;
  /** Vector solución final obtenido: x* */
  readonly x: readonly number[];
  /** Número total de iteraciones consumidas hasta la parada */
  readonly iterations: number;
  /** Indicador booleano de si el algoritmo alcanzó la tolerancia exigida */
  readonly converged: boolean;
  /** Residuo relativo final: ||r_k||_2 / ||b||_2 */
  readonly finalRelativeResidual: number;
  /** Norma absoluta del residuo final: ||r_k||_2 */
  readonly finalResidualNorm: number;
  /** Tolerancia de parada configurada */
  readonly tolerance: number;
  /** Tiempo de ejecución computacional en milisegundos */
  readonly executionTimeMs: number;
  /** Historial cronológico de pasos de iteración para graficación y diagnóstico */
  readonly history: readonly IterationStep[];
  /** Análisis de error frente a la solución de referencia (si fue provista) */
  readonly errorAnalysis?: ErrorAnalysis;
}

/**
 * Resultado de la descomposición directa de Cholesky: A = L * L^T.
 */
export interface CholeskyFactorizationResult {
  /** Matriz triangular inferior L con elementos diagonales positivos: l_ii > 0 */
  readonly L: readonly (readonly number[])[];
  /** Matriz triangular superior L^T (transpuesta de L) */
  readonly LT: readonly (readonly number[])[];
  /** Vector solución de referencia exacto: x_ref */
  readonly xRef: readonly number[];
  /** Residuo absoluto de la solución de referencia: ||A * x_ref - b||_2 */
  readonly residualNorm: number;
  /** Residuo relativo de la solución de referencia: ||A * x_ref - b||_2 / ||b||_2 */
  readonly relativeResidual: number;
  /** Tiempo de cómputo en milisegundos */
  readonly executionTimeMs: number;
}

/**
 * Métricas comparativas entre Gradiente Conjugado simple y Precondicionado.
 */
export interface ComparisonMetrics {
  /** Iteraciones consumidas por GC simple */
  readonly gcIterations: number;
  /** Iteraciones consumidas por GCP precondicionado */
  readonly gcpIterations: number;
  /** Reducción absoluta de iteraciones: (gcIterations - gcpIterations) */
  readonly iterationReduction: number;
  /** Porcentaje de reducción de iteraciones: ((gc - gcp) / gc) * 100% */
  readonly iterationReductionPercentage: number;
  /** Factor de aceleración en iteraciones: gcIterations / max(1, gcpIterations) */
  readonly speedupFactor: number;
  /** Tiempo de cómputo de GC en ms */
  readonly gcTimeMs: number;
  /** Tiempo de cómputo de GCP en ms */
  readonly gcpTimeMs: number;
  /** Residuo relativo final alcanzado por GC */
  readonly gcFinalRelativeResidual: number;
  /** Residuo relativo final alcanzado por GCP */
  readonly gcpFinalRelativeResidual: number;
  /** Indicador de si GCP cumplió la tolerancia requerida en <= iteraciones que GC */
  readonly preconditioningEffective: boolean;
}
