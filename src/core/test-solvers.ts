/**
 * @file test-solvers.ts
 * @description Suite de validación integral y benchmarking para los solvers numéricos.
 * Prueba y certifica:
 * 1. Solución de referencia exacta mediante Cholesky (A = L * L^T).
 * 2. Manejo robusto de errores para matrices no simétricas y no SPD (Casos QA obligatorios).
 * 3. Ejecución comparativa de GC Simple vs GCP Suñagua (2020) con Jacobi e IC(0).
 * 4. Generación de la Tabla Comparativa Obligatoria (Sección 8 de la consigna UMSA).
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import { ErrorAnalyzer } from './analysis/error-analyzer';
import { ALL_SCENARIOS } from './constants/scenarios.data';
import { assertSymmetry } from './math/linear-algebra';
import {
  MatrixNotPositiveDefiniteError,
  MatrixNotSymmetricError
} from './math/matrix-errors';
import { IncompleteCholeskyPreconditioner } from './preconditioners/incomplete-cholesky';
import { JacobiPreconditioner } from './preconditioners/jacobi-preconditioner';
import { solveCholesky } from './solvers/cholesky-solver';
import { ConjugateGradientSolver } from './solvers/conjugate-gradient';
import { PreconditionedCGSolver } from './solvers/preconditioned-cg';

export function runFullSolversBenchmark(): boolean {
  console.log('='.repeat(95));
  console.log(' BENCHMARK Y VALIDACIÓN DE SOLVERS NUMÉRICOS (Cholesky, GC y GCP Suñagua 2020)');
  console.log(' Desafío Académico de Métodos Numéricos (UMSA - Informática) | Tol = 10^-6');
  console.log('='.repeat(95));

  let allTestsPassed = true;
  const gcSolver = new ConjugateGradientSolver();
  const jacobiPrec = new JacobiPreconditioner();
  const icPrec = new IncompleteCholeskyPreconditioner();

  // =========================================================================
  // PARTE 1: PRUEBAS DE VALIDACIÓN DE ENTRADAS ANÓMALAS (Casos QA 2 Obligatorios)
  // =========================================================================
  console.log('\n>>> [QA TEST 2] Validación de Robustez ante Matrices Inválidas:');

  // Test 1.1: Matriz Asimétrica
  try {
    const asymmetricMatrix = [
      [4.0, 1.5, 0.0, 0.0],
      [0.5, 4.0, 0.0, 0.0], // asimétrico: 1.5 != 0.5
      [0.0, 0.0, 4.0, 0.0],
      [0.0, 0.0, 0.0, 4.0]
    ];
    assertSymmetry(asymmetricMatrix);
    console.log('    [FALLÓ] Matriz asimétrica no fue detectada.');
    allTestsPassed = false;
  } catch (err) {
    if (err instanceof MatrixNotSymmetricError) {
      console.log(`    [APROBADO] Matriz asimétrica capturada exitosamente: "${err.message}"`);
    } else {
      console.log('    [FALLÓ] Error inesperado en matriz asimétrica:', err);
      allTestsPassed = false;
    }
  }

  // Test 1.2: Matriz No Definida Positiva (pivote negativo)
  try {
    const nonSpdMatrix = [
      [1.0, 2.0, 0.0, 0.0],
      [2.0, 1.0, 0.0, 0.0], // pivote: 1.0 - 2^2 = -3.0 <= 0
      [0.0, 0.0, 4.0, 0.0],
      [0.0, 0.0, 0.0, 4.0]
    ];
    solveCholesky(nonSpdMatrix, [1, 1, 1, 1]);
    console.log('    [FALLÓ] Matriz no SPD no fue detectada en Cholesky.');
    allTestsPassed = false;
  } catch (err) {
    if (err instanceof MatrixNotPositiveDefiniteError) {
      console.log(`    [APROBADO] Matriz no SPD capturada en Cholesky: "${err.message}"`);
    } else {
      console.log('    [FALLÓ] Error inesperado en matriz no SPD:', err);
      allTestsPassed = false;
    }
  }

  // =========================================================================
  // PARTE 2: EVALUACIÓN DE LOS TRES ESCENARIOS OFICIALES
  // =========================================================================
  console.log('\n' + '='.repeat(95));
  console.log(' EVALUACIÓN DE ESCENARIOS NUMÉRICOS (MÉTODO DIRECTO vs ITERATIVOS)');
  console.log('='.repeat(95));

  for (const sc of ALL_SCENARIOS) {
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`>>> ESCENARIO: ${sc.academicTitle.toUpperCase()}`);
    console.log(`    kappa_2(A) = ${sc.spectral.conditionNumber.toFixed(4)} | ||b||_2 = ${sc.vectorB.normL2.toFixed(4)} $K`);
    console.log(`--------------------------------------------------------------------------------`);

    const A = sc.matrixA.data;
    const b = sc.vectorB.values;
    const varKeys = sc.variables.map(v => v.key);

    // 1. Solución de Referencia Directa (Cholesky)
    const choleskyRes = solveCholesky(A, b);
    console.log(`  [Cholesky Directo] (Solución Numérica de Referencia / Exacta):`);
    console.log(`    x_ref               = [${choleskyRes.xRef.map(v => v.toFixed(6)).join(', ')}] $K USD`);
    console.log(`    Residuo analítico   = ${choleskyRes.residualNorm.toExponential(4)}`);
    console.log(`    Residuo relativo    = ${choleskyRes.relativeResidual.toExponential(4)}`);
    console.log(`    Tiempo de cómputo   = ${choleskyRes.executionTimeMs.toFixed(3)} ms`);

    const isCholeskyExact = choleskyRes.relativeResidual < 1e-12;
    if (!isCholeskyExact) {
      console.log(`    [ALERTA] Residuo de Cholesky mayor al umbral esperado.`);
      allTestsPassed = false;
    }

    // 2. Gradiente Conjugado Simple (GC sin precondicionar)
    const gcRes = gcSolver.solve(A, b, { tolerance: 1e-6, maxIterations: 100 });
    const gcErrors = ErrorAnalyzer.computeErrorAnalysis(A, b, choleskyRes.xRef, gcRes.x, varKeys);

    console.log(`\n  [GC Simple] (Sin Precondicionar):`);
    console.log(`    x_GC                = [${gcRes.x.map(v => v.toFixed(6)).join(', ')}] $K USD`);
    console.log(`    Iteraciones         = ${gcRes.iterations}`);
    console.log(`    Residuo rel. final  = ${gcRes.finalRelativeResidual.toExponential(4)} (< 1e-6: ${gcRes.converged ? 'SÍ' : 'NO'})`);
    console.log(`    Max Error Absoluto  = ${gcErrors.maxAbsoluteError.toExponential(4)} $K USD`);
    console.log(`    Max Error Relativo  = ${gcErrors.maxRelativeError !== null ? (gcErrors.maxRelativeError * 100).toFixed(6) + '%' : 'N/A'}`);

    // 3. Gradiente Conjugado Precondicionado (GCP Suñagua 2020 con Jacobi)
    const gcpSolverJacobi = new PreconditionedCGSolver(jacobiPrec);
    const gcpResJacobi = gcpSolverJacobi.solve(A, b, { tolerance: 1e-6, maxIterations: 100 });
    const gcpErrorsJacobi = ErrorAnalyzer.computeErrorAnalysis(A, b, choleskyRes.xRef, gcpResJacobi.x, varKeys);
    const comparisonJacobi = ErrorAnalyzer.compareSolvers(gcRes, gcpResJacobi);

    console.log(`\n  [GCP Suñagua 2020 - Jacobi]:`);
    console.log(`    x_GCP               = [${gcpResJacobi.x.map(v => v.toFixed(6)).join(', ')}] $K USD`);
    console.log(`    Iteraciones         = ${gcpResJacobi.iterations}`);
    console.log(`    Residuo rel. final  = ${gcpResJacobi.finalRelativeResidual.toExponential(4)} (< 1e-6: ${gcpResJacobi.converged ? 'SÍ' : 'NO'})`);
    console.log(`    Max Error Absoluto  = ${gcpErrorsJacobi.maxAbsoluteError.toExponential(4)} $K USD`);
    console.log(`    Max Error Porcentual= ${gcpErrorsJacobi.maxPercentageError !== null ? gcpErrorsJacobi.maxPercentageError.toFixed(6) + '%' : 'N/A'}`);
    console.log(`    Efectividad Precond = ${comparisonJacobi.preconditioningEffective ? 'APROBADO' : 'NO ACELERA'}`);

    // 4. GCP Suñagua 2020 con Cholesky Incompleto IC(0)
    const gcpSolverIC = new PreconditionedCGSolver(icPrec);
    const gcpResIC = gcpSolverIC.solve(A, b, { tolerance: 1e-6, maxIterations: 100 });

    console.log(`\n  [GCP Suñagua 2020 - Cholesky Incompleto IC(0)]:`);
    console.log(`    x_GCP (IC0)         = [${gcpResIC.x.map(v => v.toFixed(6)).join(', ')}] $K USD`);
    console.log(`    Iteraciones IC(0)   = ${gcpResIC.iterations}`);
    console.log(`    Residuo rel. final  = ${gcpResIC.finalRelativeResidual.toExponential(4)}`);

    // Validar convergencia obligatoria
    if (!gcRes.converged || !gcpResJacobi.converged || !gcpResIC.converged) {
      console.log(`    [FALLÓ] Algún solver no convergió a la tolerancia 1e-6.`);
      allTestsPassed = false;
    }

    // Tabla de desglose de error por componente
    console.log(`\n    Desglose de Errores por Componente (GCP Jacobi vs Referencia Exacta):`);
    console.log(`    ${'Var'.padEnd(6)} | ${'x_Ref ($K)'.padEnd(12)} | ${'x_GCP ($K)'.padEnd(12)} | ${'E_a ($K)'.padEnd(14)} | ${'E_p (%)'.padEnd(12)}`);
    console.log(`    ${'-'.repeat(65)}`);
    for (const errComp of gcpErrorsJacobi.componentErrors) {
      const pStr = errComp.percentageError !== null ? errComp.percentageError.toFixed(6) + '%' : 'N/A';
      console.log(
        `    ${errComp.variableKey.padEnd(6)} | ` +
        `${errComp.xRef.toFixed(4).padEnd(12)} | ` +
        `${errComp.xApprox.toFixed(4).padEnd(12)} | ` +
        `${errComp.absoluteError.toExponential(4).padEnd(14)} | ` +
        `${pStr.padEnd(12)}`
      );
    }
  }

  // =========================================================================
  // PARTE 3: TABLA COMPARATIVA OFICIAL (Sección 8 de la consigna)
  // =========================================================================
  console.log('\n' + '='.repeat(95));
  console.log(' TABLA COMPARATIVA OBLIGATORIA (SECCIÓN 8 DE LA CONSIGNA UMSA)');
  console.log('='.repeat(95));
  console.log(
    `${'Indicador'.padEnd(35)} | ` +
    `${'Escenario Ideal'.padEnd(26)} | ` +
    `${'Bajo Estrés'.padEnd(26)} | ` +
    `${'Mal Condicionado'.padEnd(26)}`
  );
  console.log('-'.repeat(120));

  const resultsByScenario = ALL_SCENARIOS.map(sc => {
    const A = sc.matrixA.data;
    const b = sc.vectorB.values;
    const chol = solveCholesky(A, b);
    const gc = gcSolver.solve(A, b, { tolerance: 1e-6 });
    const gcp = new PreconditionedCGSolver(jacobiPrec).solve(A, b, { tolerance: 1e-6 });
    const errors = ErrorAnalyzer.computeErrorAnalysis(A, b, chol.xRef, gcp.x);
    return { sc, chol, gc, gcp, errors };
  });

  // Fila: Solución de referencia
  console.log(
    `${'Solución Num. Referencia [x*]'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `[${r.chol.xRef.map(v => v.toFixed(1)).join(', ')}]`.padEnd(26))
      .join(' | ')
  );

  // Fila: Solución GCP
  console.log(
    `${'Solución GCP (Suñagua)'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `[${r.gcp.x.map(v => v.toFixed(1)).join(', ')}]`.padEnd(26))
      .join(' | ')
  );

  // Fila: Max Error Absoluto Ea
  console.log(
    `${'Max Error Absoluto (E_a)'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `${r.errors.maxAbsoluteError.toExponential(2)} $K`.padEnd(26))
      .join(' | ')
  );

  // Fila: Max Error Porcentual Ep
  console.log(
    `${'Max Error Porcentual (E_p)'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `${(r.errors.maxPercentageError ?? 0).toFixed(4)}%`.padEnd(26))
      .join(' | ')
  );

  // Fila: Iteraciones GC Simple
  console.log(
    `${'Iteraciones GC (Simple)'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `${r.gc.iterations} iteraciones`.padEnd(26))
      .join(' | ')
  );

  // Fila: Iteraciones GCP (Suñagua)
  console.log(
    `${'Iteraciones GCP (Precondicionado)'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `${r.gcp.iterations} iteraciones`.padEnd(26))
      .join(' | ')
  );

  // Fila: Condicion kappa(A)
  console.log(
    `${'Número de condición kappa(A)'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `${r.sc.spectral.conditionNumber.toFixed(2)}`.padEnd(26))
      .join(' | ')
  );

  // Fila: Condicion precondicionada kappa(M^-1 A)
  console.log(
    `${'Condición precond. kappa(M^-1 A)'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `${r.sc.preconditioning.preconditionedConditionNumber.toFixed(2)}`.padEnd(26))
      .join(' | ')
  );

  // Fila: Residuo relativo final
  console.log(
    `${'Residuo relativo final GCP'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => `${r.gcp.finalRelativeResidual.toExponential(3)}`.padEnd(26))
      .join(' | ')
  );

  // Fila: ¿Convergió?
  console.log(
    `${'¿Convergió el algoritmo?'.padEnd(35)} | ` +
    resultsByScenario
      .map(r => (r.gcp.converged ? 'SÍ (Tol < 10^-6)' : 'NO').padEnd(26))
      .join(' | ')
  );

  // Fila: Interpretación Financiera
  console.log('-'.repeat(120));
  console.log('Interpretación Financiera Cualitativa:');
  console.log(' - Ideal: Asignación balanceada ($82K USD total), interfaces desacopladas y costo mínimo de coordinación.');
  console.log(' - Estrés Financiero: Rebalanceo por shock de nube y ciberseguridad ($95K USD total), absorbiendo sobrecostos sin desestabilizar.');
  console.log(' - Mal Condicionado: Desproporción extrema de costos entre infraestructura y QA ($110K USD total); el precondicionador normaliza la escala.');
  console.log('='.repeat(95));

  return allTestsPassed;
}

if (require.main === module) {
  const ok = runFullSolversBenchmark();
  process.exit(ok ? 0 : 1);
}
