/**
 * @file scenarios.data.ts
 * @description Datos numéricos inmutables, metadatos financieros y demostraciones analíticas
 * de los 3 escenarios obligatorios para el Proyecto de Métodos Numéricos (UMSA - Informática).
 * 
 * Basado en la formulación de optimización cuadrática:
 *   min Phi(x) = (1/2) * x^T * A * x - b^T * x  =>  A * x = b
 * 
 * Propiedades matemáticas garantizadas para cada escenario:
 * 1. Simetría estricta: A = A^T  =>  max |A - A^T| = 0.
 * 2. Estrictamente Definida Positiva (SPD): Criterio de Sylvester (Delta_1 > 0, Delta_2 > 0, Delta_3 > 0, Delta_4 > 0).
 * 3. Espectro y Condicionamiento: Autovalores reales positivos lambda_i > 0, kappa_2(A) = lambda_max / lambda_min.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import {
  FinancialScenario,
  FinancialVariable,
  ScenarioId
} from '../types/financial-model.types';

/**
 * Catálogo inmutable de variables presupuestarias de Tecnologías de la Información (TI).
 * Cada variable representa el presupuesto asignado en miles de dólares ($K USD).
 */
export const FINANCIAL_VARIABLES: readonly FinancialVariable[] = Object.freeze([
  Object.freeze({
    key: 'x1',
    index: 1,
    code: 'TI-INFRA',
    name: 'Infraestructura Cloud, DevOps y Plataforma',
    description: 'Aprovisionamiento de cómputo en la nube (AWS/GCP/Azure), clústeres Kubernetes, pipelines CI/CD, almacenamiento elástico y redes de baja latencia.',
    unit: '$K USD'
  }),
  Object.freeze({
    key: 'x2',
    index: 2,
    code: 'TI-CYBERSEC',
    name: 'Ciberseguridad, Auditoría y Cumplimiento Normativo',
    description: 'Gestión de postura de seguridad (CSPM), SIEM/SOC 24/7, auditorías ISO 27001 / PCI-DSS, mitigación de vulnerabilidades y arquitecturas Zero-Trust.',
    unit: '$K USD'
  }),
  Object.freeze({
    key: 'x3',
    index: 3,
    code: 'TI-DEV',
    name: 'Ingeniería de Software Core (Frontend, Backend y APIs)',
    description: 'Desarrollo de microservicios, contratos de API REST/gRPC, aplicaciones SPA/móviles, refactorización de deuda técnica y lógica de negocio central.',
    unit: '$K USD'
  }),
  Object.freeze({
    key: 'x4',
    index: 4,
    code: 'TI-QA',
    name: 'Aseguramiento de Calidad (QA), Testing Automatizado y Observabilidad',
    description: 'Suites de pruebas E2E automatizadas, chaos engineering, monitoreo APM (OpenTelemetry/Prometheus/Grafana) y trazabilidad distribuida.',
    unit: '$K USD'
  })
]);

/**
 * ESCENARIO 1: IDEAL (Sistema Bien Condicionado, kappa(A) < 15)
 * Contexto: Operación corporativa madura, equilibrio interdepartamental e interfaces desacopladas.
 */
export const SCENARIO_IDEAL: FinancialScenario = Object.freeze({
  id: 'ideal' as ScenarioId,
  academicTitle: 'Escenario 1: Asignación Presupuestaria Balanceada e Ideal',
  subtitle: 'Sistema Numérico Bien Condicionado con Estricta Dominancia Diagonal (kappa(A) = 2.7086 < 15)',
  financialContext:
    'Representa una empresa tecnológica de escala media en régimen operativo estable. Las cuatro áreas de TI poseen arquitecturas desacopladas con contratos de interfaz claros. No existen bloqueos críticos entre departamentos: el escalamiento de desarrollo (x3) no genera fricciones desmedidas en infraestructura (x1) ni en aseguramiento de calidad (x4). El vector de demanda b refleja requerimientos de inversión planificados y balanceados para un ciclo fiscal regular.',
  numericalJustification:
    'La matriz A es estrictamente diagonal dominante por filas: a_ii > sum_{j!=i} |a_ij| para todo i in {1,2,3,4}. Los autovalores se encuentran estrechamente agrupados en el intervalo [2.4253, 6.5692], lo que arroja un número de condición espectral kappa_2(A) = 2.7086. Esto garantiza que tanto el Método de Gradientes Conjugados (GC) simple como el Precondicionado (GCP) converjan a la tolerancia de 10^-6 en un número mínimo de iteraciones sin sufrir pérdida de ortogonalidad.',
  variables: FINANCIAL_VARIABLES,
  matrixA: Object.freeze({
    data: [
      [4.0, 0.8, 1.0, 0.6],
      [0.8, 3.5, 0.7, 0.4],
      [1.0, 0.7, 5.0, 1.2],
      [0.6, 0.4, 1.2, 3.0]
    ] as const,
    rows: 4,
    cols: 4,
    isSymmetric: true,
    symmetryError: 0.0
  }),
  vectorB: Object.freeze({
    values: [150.2, 84.3, 221.4, 97.0] as const,
    dimension: 4,
    normL2: 296.805475,
    unit: '$K USD'
  }),
  sylvester: Object.freeze({
    delta1: 4.0,
    delta2: 13.36,
    delta3: 62.46,
    delta4: 166.7156,
    isStrictlyPositiveDefinite: true,
    analyticalSteps: Object.freeze([
      'Delta_1 = det([4.0]) = 4.0000 > 0',
      'Delta_2 = (4.0 * 3.5) - (0.8)^2 = 14.0000 - 0.6400 = 13.3600 > 0',
      'Delta_3 = 4.0*(3.5*5.0 - 0.7^2) - 0.8*(0.8*5.0 - 0.7*1.0) + 1.0*(0.8*0.7 - 3.5*1.0) = 4.0*(17.01) - 0.8*(3.30) + 1.0*(-2.94) = 68.04 - 2.64 - 2.94 = 62.4600 > 0',
      'Delta_4 = det(A) via Complemento de Schur: det(A_3x3) * (a_44 - v^T * A_3x3^-1 * v) = 62.46 * (3.0 - 0.330842) = 166.7156 > 0'
    ])
  }),
  spectral: Object.freeze({
    eigenvalues: [2.42528716, 2.91166699, 3.59383561, 6.56921024] as const,
    lambdaMin: 2.42528716,
    lambdaMax: 6.56921024,
    conditionNumber: 2.708632,
    characteristicPolynomial: [1.0, -15.5, 84.91, -197.766, 166.7156] as const,
    trace: 15.5,
    determinant: 166.7156
  }),
  equilibrium: Object.freeze({
    optimalAllocation: [25.0, 10.0, 35.0, 12.0] as const,
    totalBudgetAllocated: 82.0,
    optimalObjectiveValue: -6755.5,
    residualNormExact: 2.842171e-14
  }),
  preconditioning: Object.freeze({
    type: 'Jacobi (Diagonal)',
    preconditionedConditionNumber: 2.359692,
    conditionReductionFactor: 1.147875,
    theoreticalContractionFactor: 0.244083,
    theoreticalIterationsToTolerance: 10,
    technicalExplanation:
      'Dado que la matriz A1 ya se encuentra excepcionalmente bien balanceada y diagonalmente dominante, el precondicionador diagonal de Jacobi M = diag(A) realiza un escalamiento complementario reduciendo la condición de 2.71 a 2.36. Tanto GC simple como GCP convergen de inmediato.'
  }),
  stoppingCriterion: Object.freeze({
    tolerance: 1e-6,
    formula: '||r_k||_2 / ||b||_2 < 10^-6',
    normB: 296.805475,
    absoluteThreshold: 0.00029681
  })
});

/**
 * ESCENARIO 2: BAJO ESTRÉS FINANCIERO (Shock Operativo e Inflacionario)
 * Contexto: Disrupción imprevista en licenciamiento cloud y exigencias críticas de ciberseguridad.
 */
export const SCENARIO_FINANCIAL_STRESS: FinancialScenario = Object.freeze({
  id: 'financial_stress' as ScenarioId,
  academicTitle: 'Escenario 2: Rebalanceo Presupuestario Bajo Estrés Financiero y Regulatorio',
  subtitle: 'Shock de Demanda en Infraestructura y Seguridad con Interdependencia Acentuada (kappa(A) = 3.3970 < 15)',
  financialContext:
    'La organización enfrenta un doble incidente crítico: un shock inflacionario en tarifas de hiperescaladores cloud (+80%) y la exigencia inmediata de certificación PCI-DSS v4.0 y mitigación de un incidente de día cero. La demanda neta en infraestructura (b1) se incrementa de 150.2 a 267.5 (+78.1%) y la demanda de ciberseguridad (b2) salta de 84.3 a 185.5 (+120.0%). Simultáneamente, la urgencia operativa acentúa la interdependencia entre Cloud y Seguridad (a12 sube a 1.8) y entre Desarrollo y QA (a34 sube a 1.9).',
  numericalJustification:
    'A pesar del severo incremento en las demandas b y el refuerzo de las rigideces diagonales y cruzadas en A2, el espectro de la matriz se mantiene controlado en el rango [2.4240, 8.2343], resultando en kappa_2(A2) = 3.3970. El modelo demuestra matemáticamente la robustez del simulador presupuestario: el sistema converge de manera estable a un nuevo punto de equilibrio x* que prioriza la infraestructura ($40K USD) y la ciberseguridad ($20K USD), mientras contiene o reasigna partidas en desarrollo core ($30K USD) y QA ($5K USD).',
  variables: FINANCIAL_VARIABLES,
  matrixA: Object.freeze({
    data: [
      [4.8, 1.8, 1.2, 0.7],
      [1.8, 4.2, 0.9, 0.5],
      [1.2, 0.9, 5.5, 1.9],
      [0.7, 0.5, 1.9, 3.6]
    ] as const,
    rows: 4,
    cols: 4,
    isSymmetric: true,
    symmetryError: 0.0
  }),
  vectorB: Object.freeze({
    values: [267.5, 185.5, 240.5, 113.0] as const,
    dimension: 4,
    normL2: 420.209174,
    unit: '$K USD'
  }),
  sylvester: Object.freeze({
    delta1: 4.8,
    delta2: 16.92,
    delta3: 87.012,
    delta4: 254.3751,
    isStrictlyPositiveDefinite: true,
    analyticalSteps: Object.freeze([
      'Delta_1 = det([4.8]) = 4.8000 > 0',
      'Delta_2 = (4.8 * 4.2) - (1.8)^2 = 20.1600 - 3.2400 = 16.9200 > 0',
      'Delta_3 = 4.8*(4.2*5.5 - 0.9^2) - 1.8*(1.8*5.5 - 0.9*1.2) + 1.2*(1.8*0.9 - 4.2*1.2) = 4.8*(22.29) - 1.8*(8.82) + 1.2*(-3.42) = 106.992 - 15.876 - 4.104 = 87.0120 > 0',
      'Delta_4 = det(A) via Complemento de Schur: det(A_3x3) * (a_44 - v^T * A_3x3^-1 * v) = 87.012 * (3.6 - 0.676551) = 254.3751 > 0'
    ])
  }),
  spectral: Object.freeze({
    eigenvalues: [2.42402741, 2.67181529, 4.76981992, 8.23433738] as const,
    lambdaMin: 2.42402741,
    lambdaMax: 8.23433738,
    conditionNumber: 3.396965,
    characteristicPolynomial: [1.0, -18.1, 112.02, -284.368, 254.3751] as const,
    trace: 18.1,
    determinant: 254.3751
  }),
  equilibrium: Object.freeze({
    optimalAllocation: [40.0, 20.0, 30.0, 5.0] as const,
    totalBudgetAllocated: 95.0,
    optimalObjectiveValue: -11095.0,
    residualNormExact: 2.842171e-14
  }),
  preconditioning: Object.freeze({
    type: 'Jacobi (Diagonal)',
    preconditionedConditionNumber: 3.133405,
    conditionReductionFactor: 1.084113,
    theoreticalContractionFactor: 0.296539,
    theoreticalIterationsToTolerance: 12,
    technicalExplanation:
      'Bajo estrés operativo, la matriz A2 conserva un condicionamiento excelente (kappa = 3.3970 < 15). El precondicionador diagonal comprime ligeramente el radio espectral efectivo a 3.13, garantizando que el método GC y GCP resuelvan el shock presupuestario con una convergencia casi idéntica y en tiempo real.'
  }),
  stoppingCriterion: Object.freeze({
    tolerance: 1e-6,
    formula: '||r_k||_2 / ||b||_2 < 10^-6',
    normB: 420.209174,
    absoluteThreshold: 0.00042021
  })
});

/**
 * ESCENARIO 3: MAL CONDICIONADO (Rigidez Multiescala y Fuerte Correlación, kappa(A) > 10^3)
 * Contexto: Disparidad masiva de escala de costes y dependencia cruzada asimétrica entre TI central y microservicios.
 */
export const SCENARIO_ILL_CONDITIONED: FinancialScenario = Object.freeze({
  id: 'ill_conditioned' as ScenarioId,
  academicTitle: 'Escenario 3: Sistema Mal Condicionado con Disparidad Multiescala de Costos',
  subtitle: 'Fuerte Dispersión Espectral e Ilustración Crítica de la Aceleración por Precondicionador (kappa(A) = 1477.17 > 10^3)',
  financialContext:
    'Representa una corporación tecnológica con alta deuda técnica heredada y contratos rígidos plurianuales de hiperescalador cloud. La rigidez de infraestructura (a11 = 120.0) y ciberseguridad corporativa (a22 = 60.0) es de dos a tres órdenes de magnitud superior al costo marginal operativo de micro-observabilidad y QA ágil (a44 = 0.10). Esta disparidad extrema en la escala de absorción financiera produce una superficie cuadrática hiper-elipsoidal altamente estirada y excéntrica.',
  numericalJustification:
    'La matriz A3 es estrictamente SPD con menores principales positivos (Delta_1 = 120, Delta_2 = 7136, Delta_3 = 70436, Delta_4 = 5785.29), pero sufre un marcado mal condicionamiento diagonal originando una dispersión espectral severa: lambda_min = 0.082012 frente a lambda_max = 121.144977, con kappa_2(A3) = 1477.1691 >> 10^3. Sin precondicionador, el factor de contracción de GC es rho = 0.9493, requiriendo teóricamente cientos de iteraciones para filtrar las oscilaciones residuales. La aplicación del Precondicionador de Jacobi M = diag(A3) normaliza la energía elástica diagonal, colapsando el número de condición a kappa_2(M^-1 * A3) = 2.5475 (una reducción masiva de 580x), restaurando la convergencia ultrarrápida.',
  variables: FINANCIAL_VARIABLES,
  matrixA: Object.freeze({
    data: [
      [120.0, 8.0, 3.0, 0.5],
      [8.0, 60.0, 2.0, 0.3],
      [3.0, 2.0, 10.0, 0.4],
      [0.5, 0.3, 0.4, 0.10]
    ] as const,
    rows: 4,
    cols: 4,
    isSymmetric: true,
    symmetryError: 0.0
  }),
  vectorB: Object.freeze({
    values: [3230.0, 1172.0, 421.0, 33.0] as const,
    dimension: 4,
    normL2: 3461.909011,
    unit: '$K USD'
  }),
  sylvester: Object.freeze({
    delta1: 120.0,
    delta2: 7136.0,
    delta3: 70436.0,
    delta4: 5785.29,
    isStrictlyPositiveDefinite: true,
    analyticalSteps: Object.freeze([
      'Delta_1 = det([120.0]) = 120.0000 > 0',
      'Delta_2 = (120.0 * 60.0) - (8.0)^2 = 7200.0000 - 64.0000 = 7136.0000 > 0',
      'Delta_3 = 120.0*(60.0*10.0 - 2.0^2) - 8.0*(8.0*10.0 - 2.0*3.0) + 3.0*(8.0*2.0 - 60.0*3.0) = 120.0*(596.0) - 8.0*(74.0) + 3.0*(-164.0) = 71520.0 - 592.0 - 492.0 = 70436.0000 > 0',
      'Delta_4 = det(A) via Complemento de Schur: det(A_3x3) * (a_44 - v^T * A_3x3^-1 * v) = 70436.0 * (0.10 - 1258.31 / 70436.0) = 7043.60 - 1258.31 = 5785.2900 > 0'
    ])
  }),
  spectral: Object.freeze({
    eigenvalues: [0.08201158, 9.86872260, 59.00428852, 121.14497730] as const,
    lambdaMin: 0.08201158,
    lambdaMax: 121.14497730,
    conditionNumber: 1477.16909,
    characteristicPolynomial: [1.0, -190.1, 8941.5, -71274.38, 5785.29] as const,
    trace: 190.1,
    determinant: 5785.29
  }),
  equilibrium: Object.freeze({
    optimalAllocation: [25.0, 15.0, 30.0, 40.0] as const,
    totalBudgetAllocated: 110.0,
    optimalObjectiveValue: -56140.0,
    residualNormExact: 5.684342e-14
  }),
  preconditioning: Object.freeze({
    type: 'Jacobi (Diagonal)',
    preconditionedConditionNumber: 2.547464,
    conditionReductionFactor: 579.8587,
    theoreticalContractionFactor: 0.229607,
    theoreticalIterationsToTolerance: 10,
    technicalExplanation:
      'Demostración del Teorema de Precondicionamiento: El número de condición original kappa(A3) = 1477.17 genera un factor de contracción asintótico rho = 0.9493 en el subespacio de Krylov, provocando que GC simple requiera teóricamente 266 iteraciones bajo aritmética flotante. Al aplicar el precondicionador diagonal de Jacobi M = diag(A3), la matriz precondicionada M^-1 * A3 normaliza el estiramiento elíptico en cada eje, reduciendo el número de condición a solo 2.55 (mejora de 580 veces) y el factor de contracción a rho = 0.2296, colapsando las iteraciones teóricas a tan solo 10.'
  }),
  stoppingCriterion: Object.freeze({
    tolerance: 1e-6,
    formula: '||r_k||_2 / ||b||_2 < 10^-6',
    normB: 3461.909011,
    absoluteThreshold: 0.00346191
  })
});

/**
 * Mapa tipado que indexa los tres escenarios oficiales del Desafío Académico.
 */
export const SCENARIOS_REGISTRY: Readonly<Record<ScenarioId, FinancialScenario>> = Object.freeze({
  ideal: SCENARIO_IDEAL,
  financial_stress: SCENARIO_FINANCIAL_STRESS,
  ill_conditioned: SCENARIO_ILL_CONDITIONED
});

/**
 * Arreglo ordenado inmutable de todos los escenarios para iteración y pruebas de benchmarking.
 */
export const ALL_SCENARIOS: readonly FinancialScenario[] = Object.freeze([
  SCENARIO_IDEAL,
  SCENARIO_FINANCIAL_STRESS,
  SCENARIO_ILL_CONDITIONED
]);
