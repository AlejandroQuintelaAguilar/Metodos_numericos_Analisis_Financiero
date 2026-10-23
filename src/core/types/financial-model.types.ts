/**
 * @file financial-model.types.ts
 * @description Definición de tipos de dominio e interfaces matemáticas y financieras
 * para el Desafío Académico de Métodos Numéricos (UMSA - Informática).
 * 
 * Enfoque: Clean Architecture, Domain-Driven Design (DDD), principios SOLID y TypeScript estricto.
 * Caso de Estudio: Simulador de asignación y rebalanceo presupuestario en categorías TI.
 * Dimensión: n = 4 variables independientes ($K USD).
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

/**
 * Identificadores únicos de los escenarios de simulación presupuestaria TI.
 */
export type ScenarioId = 'ideal' | 'financial_stress' | 'ill_conditioned';

/**
 * Índices y claves simbólicas de las cuatro variables de decisión presupuestaria TI.
 */
export type VariableKey = 'x1' | 'x2' | 'x3' | 'x4';

/**
 * Tupla fija de dimensión n = 4 para vectores en R^4 con tipado estricto.
 */
export type Vector4D = readonly [number, number, number, number];

/**
 * Matriz cuadrada de dimensión 4x4 representada como tupla inmutable de tuplas.
 */
export type Matrix4x4 = readonly [
  Vector4D,
  Vector4D,
  Vector4D,
  Vector4D
];

/**
 * Metadatos descriptivos y contables de una variable presupuestaria TI.
 */
export interface FinancialVariable {
  /** Clave simbólica en el modelo matemático (x1, x2, x3, x4) */
  readonly key: VariableKey;
  /** Índice matemático 1-based (1, 2, 3, 4) */
  readonly index: 1 | 2 | 3 | 4;
  /** Código contable / departamental interno */
  readonly code: 'TI-INFRA' | 'TI-CYBERSEC' | 'TI-DEV' | 'TI-QA';
  /** Nombre formal del departamento / área de inversión */
  readonly name: string;
  /** Descripción detallada del alcance técnico y operativo */
  readonly description: string;
  /** Unidad de medida financiera estandarizada ($K USD = Miles de Dólares Estadounidenses) */
  readonly unit: '$K USD';
}

/**
 * Representación inmutable de una matriz en R^(nxn) con metadatos algebraicos.
 */
export interface MatrixData {
  /** Arreglo bidimensional de valores numéricos de dimensión 4x4 */
  readonly data: Matrix4x4;
  /** Número de filas de la matriz (siempre 4) */
  readonly rows: 4;
  /** Número de columnas de la matriz (siempre 4) */
  readonly cols: 4;
  /** Propiedad de simetría verificada: A = A^T */
  readonly isSymmetric: boolean;
  /** Error absoluto máximo de simetría: max |a_ij - a_ji| */
  readonly symmetryError: number;
}

/**
 * Representación inmutable de un vector en R^n con metadatos de magnitud.
 */
export interface VectorData {
  /** Componentes del vector en R^4 */
  readonly values: Vector4D;
  /** Dimensión vectorial (siempre 4) */
  readonly dimension: 4;
  /** Norma euclídea (L2): ||v||_2 = sqrt(sum(v_i^2)) */
  readonly normL2: number;
  /** Unidad financiera de las componentes */
  readonly unit: '$K USD';
}

/**
 * Resultados y demostración analítica del Criterio de Sylvester para matrices SPD.
 * Una matriz simétrica A es estrictamente definida positiva (SPD) si y solo si
 * todos sus menores principales dominantes son estrictamente positivos (Delta_k > 0).
 */
export interface SylvesterMinors {
  /** Menor principal dominante de orden 1: det(A_1x1) = a_11 */
  readonly delta1: number;
  /** Menor principal dominante de orden 2: det(A_2x2) */
  readonly delta2: number;
  /** Menor principal dominante de orden 3: det(A_3x3) */
  readonly delta3: number;
  /** Menor principal dominante de orden 4: det(A_4x4) = det(A) */
  readonly delta4: number;
  /** Indicador booleano que certifica que todos los menores principales son > 0 */
  readonly isStrictlyPositiveDefinite: boolean;
  /** Justificación formal paso a paso del determinante y complementos de Schur */
  readonly analyticalSteps: readonly string[];
}

/**
 * Propiedades espectrales de la matriz A (autovalores, polinomio característico y condicionamiento).
 */
export interface SpectralData {
  /**
   * Autovalores reales ordenados de forma ascendente: 0 < lambda_1 <= lambda_2 <= lambda_3 <= lambda_4.
   * Al ser A simétrica y definida positiva (SPD), todos los autovalores son estrictamente positivos y reales.
   */
  readonly eigenvalues: Vector4D;
  /** Autovalor mínimo: lambda_min = lambda_1 */
  readonly lambdaMin: number;
  /** Autovalor máximo: lambda_max = lambda_4 */
  readonly lambdaMax: number;
  /**
   * Número de condición espectral L2: kappa_2(A) = ||A||_2 * ||A^-1||_2 = lambda_max / lambda_min.
   */
  readonly conditionNumber: number;
  /** Coeficientes del polinomio característico p(lambda) = lambda^4 - c3*lambda^3 + c2*lambda^2 - c1*lambda + c0 */
  readonly characteristicPolynomial: readonly [number, number, number, number, number];
  /** Traza de la matriz: tr(A) = sum(a_ii) = sum(lambda_i) */
  readonly trace: number;
  /** Determinante de la matriz: det(A) = prod(lambda_i) = Delta_4 */
  readonly determinant: number;
}

/**
 * Punto de equilibrio analítico y métricas de optimización cuadrática:
 * min Phi(x) = (1/2)*x^T*A*x - b^T*x  =>  A*x = b.
 */
export interface EquilibriumSolution {
  /** Vector de asignaciones presupuestarias óptimas en miles de USD: x* = A^-1 * b */
  readonly optimalAllocation: Vector4D;
  /** Presupuesto total asignado a todas las áreas: sum(x_i*) en $K USD */
  readonly totalBudgetAllocated: number;
  /**
   * Valor de la función objetivo cuadrática en el punto óptimo:
   * Phi(x*) = (1/2)*(x*)^T*A*(x*) - b^T*(x*) = -(1/2)*b^T*(x*)
   */
  readonly optimalObjectiveValue: number;
  /** Residuo analítico exacto de la solución: ||A*x* - b||_2 */
  readonly residualNormExact: number;
}

/**
 * Análisis del impacto del precondicionamiento en la convergencia del algoritmo GCP.
 */
export interface PreconditionerAnalysis {
  /** Tipo de precondicionador aplicado */
  readonly type: 'Jacobi (Diagonal)' | 'Cholesky Incompleto IC(0)' | 'Identidad (Sin Precondicionador)';
  /** Número de condición espectral del sistema precondicionado: kappa_2(M^-1 * A) */
  readonly preconditionedConditionNumber: number;
  /** Factor de reducción del número de condición: kappa(A) / kappa(M^-1 * A) */
  readonly conditionReductionFactor: number;
  /**
   * Factor de contracción teórico por iteración según el Teorema de Suñagua / Luenberger:
   * rho = (sqrt(kappa) - 1) / (sqrt(kappa) + 1)
   */
  readonly theoreticalContractionFactor: number;
  /** Estimación teórica de iteraciones para reducir el error relativo por debajo de 10^-6 */
  readonly theoreticalIterationsToTolerance: number;
  /** Justificación física y matemática del comportamiento del precondicionador */
  readonly technicalExplanation: string;
}

/**
 * Criterio de parada numérico riguroso establecido para el método de Gradientes Conjugados.
 */
export interface StoppingCriterion {
  /** Tolerancia de convergencia relativa: 10^-6 */
  readonly tolerance: number;
  /** Fórmula matemática normalizada del criterio de parada relativo */
  readonly formula: '||r_k||_2 / ||b||_2 < 10^-6';
  /** Norma euclídea del vector de demanda inicial ||b||_2 */
  readonly normB: number;
  /** Umbral de norma residual absoluta requerido para la convergencia: tol * ||b||_2 */
  readonly absoluteThreshold: number;
}

/**
 * Definición completa y fuertemente tipada de un escenario financiero-numérico.
 * Representa la entidad raíz (Aggregate Root) en el dominio financiero del simulador.
 */
export interface FinancialScenario {
  /** Identificador canónico del escenario */
  readonly id: ScenarioId;
  /** Título formal académico del escenario */
  readonly academicTitle: string;
  /** Subtítulo descriptivo del contexto de ingeniería de software */
  readonly subtitle: string;
  /** Contexto y justificación económica/operativa detallada */
  readonly financialContext: string;
  /** Justificación matemática y computacional de la parametrización */
  readonly numericalJustification: string;
  /** Diccionario de variables presupuestarias involucradas */
  readonly variables: readonly FinancialVariable[];
  /** Matriz de rigidez de costos e interdependencias interdepartamentales A (SPD) */
  readonly matrixA: MatrixData;
  /** Vector de demanda presupuestaria neta inicial b */
  readonly vectorB: VectorData;
  /** Demostración del Criterio de Sylvester (Delta_k > 0) */
  readonly sylvester: SylvesterMinors;
  /** Análisis espectral y número de condición kappa_2(A) */
  readonly spectral: SpectralData;
  /** Punto de equilibrio analítico x* que minimiza la función cuadrática Phi(x) */
  readonly equilibrium: EquilibriumSolution;
  /** Impacto y análisis del precondicionamiento (Jacobi e Incomplete Cholesky) */
  readonly preconditioning: PreconditionerAnalysis;
  /** Especificación del criterio de parada */
  readonly stoppingCriterion: StoppingCriterion;
}
