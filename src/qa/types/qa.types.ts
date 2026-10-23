/**
 * @file qa.types.ts
 * @description Definición de tipos, interfaces y estructuras de datos para el Módulo de Pruebas (QA)
 * y Validaciones de Entrada según la Sección 9 de la consigna oficial del proyecto (UMSA - Informática).
 * 
 * Cumple con el estándar de control de calidad exigido:
 * - Entrada
 * - Resultado Esperado
 * - Resultado Obtenido
 * - Estado (PASS / FAIL)
 * - Conclusión
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

/**
 * Identificadores únicos de los casos de prueba obligatorios según la Sección 9.
 */
export type QATestId =
  | 'QA-01-LOAD-SCENARIOS'
  | 'QA-02-INVALID-MATRIX'
  | 'QA-03-DYNAMIC-RECALC'
  | 'QA-04-PRECONDITIONER-EFFICIENCY';

/**
 * Nivel de severidad para diagnósticos del validador de entradas.
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Detalle individual de un error o advertencia en la validación de matriz/vector.
 */
export interface ValidationErrorItem {
  /** Código identificador del error (ej. 'ERR_ASYMMETRIC_MATRIX', 'ERR_NON_SPD_PIVOT') */
  readonly code: string;
  /** Mensaje explicativo amigable para el usuario */
  readonly message: string;
  /** Nivel de severidad */
  readonly severity: ValidationSeverity;
  /** Ubicación o contexto numérico donde se detectó el fallo */
  readonly context?: {
    readonly row?: number;
    readonly col?: number;
    readonly value?: number;
    readonly expected?: string;
  };
}

/**
 * Resultado completo y estructurado de la validación matemática de una matriz A y vector b.
 * Previene pantallas en blanco y caídas no controladas de la aplicación web.
 */
export interface MatrixValidationResult {
  /** Indica si la matriz y el vector son matemáticamente válidos para resolver con GC/GCP */
  readonly isValid: boolean;
  /** Indica si A es una matriz cuadrada (n x n) con n >= 4 */
  readonly isSquare: boolean;
  /** Dimensión de la matriz cuadrada */
  readonly dimension: number;
  /** Indica si A es simétrica: max |A_ij - A_ji| <= 1e-12 */
  readonly isSymmetric: boolean;
  /** Discrepancia absoluta máxima observada en la simetría */
  readonly symmetryMaxDiff: number;
  /** Posición de la máxima discrepancia de simetría (si existe) */
  readonly asymmetryCoordinates?: { readonly row: number; readonly col: number };
  /** Indica si A es estrictamente definida positiva (SPD) */
  readonly isPositiveDefinite: boolean;
  /** Valores de los menores principales dominantes calculados por el Criterio de Sylvester */
  readonly sylvesterMinors: readonly number[];
  /** Detalle del pivote o menor que causó la pérdida de definición positiva (si aplica) */
  readonly spdFailureReason?: string;
  /** Lista de errores críticos que impiden la ejecución */
  readonly errors: readonly ValidationErrorItem[];
  /** Lista de advertencias que no impiden la ejecución pero sugieren revisión */
  readonly warnings: readonly ValidationErrorItem[];
}

/**
 * Estructura formal de un resultado de prueba de software según la Sección 9 de la consigna.
 */
export interface QATestResult {
  /** Identificador único del caso de prueba (ej. 'QA-01-LOAD-SCENARIOS') */
  readonly id: QATestId | string;
  /** Nombre formal de la prueba de software */
  readonly name: string;
  /** Descripción concisa de los datos y parámetros de entrada suministrados */
  readonly inputDescription: string;
  /** Comportamiento y condiciones matemáticas esperadas */
  readonly expectedResult: string;
  /** Resultado empírico efectivamente producido por el sistema */
  readonly actualResult: string;
  /** Indicador binario de éxito: true = PASS (Aprobado), false = FAIL (Fallido) */
  readonly passed: boolean;
  /** Tiempo de ejecución de la prueba en milisegundos */
  readonly executionTimeMs: number;
  /** Conclusión formal y análisis técnico del resultado obtenido */
  readonly conclusion: string;
  /** Datos numéricos y métricas de soporte de la prueba */
  readonly details?: Record<string, unknown>;
}

/**
 * Reporte consolidado de ejecución de la suite de calidad del software (QA).
 */
export interface QASummaryReport {
  /** Título del reporte de aseguramiento de calidad */
  readonly title: string;
  /** Fecha y hora ISO de ejecución */
  readonly timestamp: string;
  /** Total de pruebas ejecutadas */
  readonly totalTests: number;
  /** Total de pruebas con veredicto PASS */
  readonly passedTests: number;
  /** Total de pruebas con veredicto FAIL */
  readonly failedTests: number;
  /** Tasa porcentual de éxito (0 a 100%) */
  readonly successRate: number;
  /** Tiempo total acumulado de ejecución de la suite en milisegundos */
  readonly totalExecutionTimeMs: number;
  /** Indicador booleano global: true si todas las pruebas resultaron PASS */
  readonly allPassed: boolean;
  /** Lista detallada de resultados individuales */
  readonly results: readonly QATestResult[];
}
