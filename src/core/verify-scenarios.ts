/**
 * @file verify-scenarios.ts
 * @description Script de verificación matemática y algorítmica para los tres escenarios numéricos.
 * Valida de forma rigurosa:
 * 1. Simetría formal: max |A - A^T| == 0.
 * 2. Criterio de Sylvester: Determinantes de menores principales Delta_k > 0 (SPD estricto).
 * 3. Solución exacta del sistema: ||A*x* - b||_2 < 10^-10.
 * 4. Normas, condicionamiento y criterios de parada.
 */

import { ALL_SCENARIOS } from './constants/scenarios.data';
import { Matrix4x4, Vector4D } from './types/financial-model.types';

/**
 * Calcula el producto matriz-vector: y = A * x.
 */
function multiplyMatrixVector(A: Matrix4x4, x: Vector4D): Vector4D {
  return [
    A[0][0] * x[0] + A[0][1] * x[1] + A[0][2] * x[2] + A[0][3] * x[3],
    A[1][0] * x[0] + A[1][1] * x[1] + A[1][2] * x[2] + A[1][3] * x[3],
    A[2][0] * x[0] + A[2][1] * x[1] + A[2][2] * x[2] + A[2][3] * x[3],
    A[3][0] * x[0] + A[3][1] * x[1] + A[3][2] * x[2] + A[3][3] * x[3]
  ];
}

/**
 * Calcula la norma euclídea (L2) de un vector en R^4.
 */
function normL2(v: Vector4D | readonly number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Calcula el determinante de una submatriz 1x1.
 */
function det1x1(a11: number): number {
  return a11;
}

/**
 * Calcula el determinante de una submatriz 2x2.
 */
function det2x2(a11: number, a12: number, a21: number, a22: number): number {
  return a11 * a22 - a12 * a21;
}

/**
 * Calcula el determinante de una submatriz 3x3 usando regla de Laplace.
 */
function det3x3(A: Matrix4x4): number {
  const [r0, r1, r2] = [A[0], A[1], A[2]];
  return (
    r0[0] * (r1[1] * r2[2] - r1[2] * r2[1]) -
    r0[1] * (r1[0] * r2[2] - r1[2] * r2[0]) +
    r0[2] * (r1[0] * r2[1] - r1[1] * r2[0])
  );
}

/**
 * Calcula el determinante de una matriz 4x4 completa mediante expansión por cofactores.
 */
function det4x4(A: Matrix4x4): number {
  let det = 0;
  for (let col = 0; col < 4; col++) {
    const sign = col % 2 === 0 ? 1 : -1;
    // Submatriz 3x3 excluyendo fila 0 y columna col
    const sub3: number[][] = [];
    for (let r = 1; r < 4; r++) {
      const row3: number[] = [];
      for (let c = 0; c < 4; c++) {
        if (c !== col) row3.push(A[r][c]);
      }
      sub3.push(row3);
    }
    const detSub =
      sub3[0][0] * (sub3[1][1] * sub3[2][2] - sub3[1][2] * sub3[2][1]) -
      sub3[0][1] * (sub3[1][0] * sub3[2][2] - sub3[1][2] * sub3[2][0]) +
      sub3[0][2] * (sub3[1][0] * sub3[2][1] - sub3[1][1] * sub3[2][0]);

    det += sign * A[0][col] * detSub;
  }
  return det;
}

/**
 * Ejecuta la verificación completa de los 3 escenarios.
 */
export function runVerification(): boolean {
  console.log('='.repeat(80));
  console.log(' VERIFICACIÓN FORMAL DE ESCENARIOS NUMÉRICOS - PROYECTO MÉTODOS NUMÉRICOS (UMSA)');
  console.log(' Caso: Asignación Presupuestaria de Categorías TI (Dimensión n = 4, Tol = 10^-6)');
  console.log('='.repeat(80));

  let allPassed = true;

  for (const sc of ALL_SCENARIOS) {
    console.log(`\n>>> [${sc.id.toUpperCase()}] ${sc.academicTitle}`);
    console.log(`    ${sc.subtitle}`);

    // 1. Simetría: max |a_ij - a_ji| == 0
    let maxSymDiff = 0;
    const A = sc.matrixA.data;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const diff = Math.abs(A[i][j] - A[j][i]);
        if (diff > maxSymDiff) maxSymDiff = diff;
      }
    }
    const isSymmetric = maxSymDiff === 0;
    console.log(`    [1] Simetría (A = A^T): ${isSymmetric ? 'APROBADO (max |A - A^T| = 0)' : 'FALLÓ'}`);
    if (!isSymmetric) allPassed = false;

    // 2. Criterio de Sylvester (Menores principales Delta_k > 0)
    const d1 = det1x1(A[0][0]);
    const d2 = det2x2(A[0][0], A[0][1], A[1][0], A[1][1]);
    const d3 = det3x3(A);
    const d4 = det4x4(A);

    const tolDet = 1e-6;
    const matchD1 = Math.abs(d1 - sc.sylvester.delta1) < tolDet;
    const matchD2 = Math.abs(d2 - sc.sylvester.delta2) < tolDet;
    const matchD3 = Math.abs(d3 - sc.sylvester.delta3) < tolDet;
    const matchD4 = Math.abs(d4 - sc.sylvester.delta4) < tolDet;
    const allPositive = d1 > 0 && d2 > 0 && d3 > 0 && d4 > 0;

    console.log(`    [2] Criterio de Sylvester (SPD):`);
    console.log(`        Delta_1 = ${d1.toFixed(4)} (Esperado: ${sc.sylvester.delta1}) -> ${d1 > 0 ? 'OK' : 'ERR'}`);
    console.log(`        Delta_2 = ${d2.toFixed(4)} (Esperado: ${sc.sylvester.delta2}) -> ${d2 > 0 ? 'OK' : 'ERR'}`);
    console.log(`        Delta_3 = ${d3.toFixed(4)} (Esperado: ${sc.sylvester.delta3}) -> ${d3 > 0 ? 'OK' : 'ERR'}`);
    console.log(`        Delta_4 = ${d4.toFixed(4)} (Esperado: ${sc.sylvester.delta4}) -> ${d4 > 0 ? 'OK' : 'ERR'}`);
    console.log(`        Certificación SPD: ${allPositive && matchD1 && matchD2 && matchD3 && matchD4 ? 'APROBADO' : 'FALLÓ'}`);
    if (!allPositive || !matchD1 || !matchD2 || !matchD3 || !matchD4) allPassed = false;

    // 3. Verificación de Solución Analítica: A * x* = b
    const Ax = multiplyMatrixVector(A, sc.equilibrium.optimalAllocation);
    const residualVec: Vector4D = [
      Ax[0] - sc.vectorB.values[0],
      Ax[1] - sc.vectorB.values[1],
      Ax[2] - sc.vectorB.values[2],
      Ax[3] - sc.vectorB.values[3]
    ];
    const residualNorm = normL2(residualVec);
    const isSolutionExact = residualNorm < 1e-10;
    console.log(`    [3] Consistencia Analítica de la Solución (A * x* = b):`);
    console.log(`        x* asignado = [${sc.equilibrium.optimalAllocation.join(', ')}] $K USD`);
    console.log(`        A * x*      = [${Ax.map(v => v.toFixed(2)).join(', ')}]`);
    console.log(`        b original  = [${sc.vectorB.values.join(', ')}]`);
    console.log(`        Norma residual ||A*x* - b||_2 = ${residualNorm.toExponential(4)} -> ${isSolutionExact ? 'APROBADO (Exacto)' : 'FALLÓ'}`);
    if (!isSolutionExact) allPassed = false;

    // 4. Espectro y Condicionamiento
    console.log(`    [4] Espectro y Condicionamiento:`);
    console.log(`        Autovalores: [${sc.spectral.eigenvalues.map(e => e.toFixed(6)).join(', ')}]`);
    console.log(`        kappa_2(A) = ${sc.spectral.conditionNumber.toFixed(4)}`);
    if (sc.id === 'ideal') {
      const condPass = sc.spectral.conditionNumber < 15;
      console.log(`        Verificación kappa(A) < 15: ${condPass ? 'APROBADO' : 'FALLÓ'}`);
      if (!condPass) allPassed = false;
    } else if (sc.id === 'ill_conditioned') {
      const condPass = sc.spectral.conditionNumber > 1000;
      console.log(`        Verificación kappa(A) > 1000: ${condPass ? 'APROBADO' : 'FALLÓ'}`);
      console.log(`        kappa_2(M_Jacobi^-1 * A) = ${sc.preconditioning.preconditionedConditionNumber.toFixed(4)} (Reducción: ${sc.preconditioning.conditionReductionFactor.toFixed(1)}x)`);
      if (!condPass) allPassed = false;
    }

    // 5. Criterio de Parada
    console.log(`    [5] Criterio de Parada Normalizado:`);
    console.log(`        ||b||_2 = ${sc.stoppingCriterion.normB.toFixed(4)} $K USD`);
    console.log(`        Tolerancia: ${sc.stoppingCriterion.tolerance}`);
    console.log(`        Umbral de parada absoluto: ||r_k||_2 < ${sc.stoppingCriterion.absoluteThreshold.toExponential(4)}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(` RESULTADO FINAL: ${allPassed ? 'TODAS LAS PRUEBAS MATEMÁTICAS APROBADAS SATISFACTORIAMENTE [OK]' : 'FALLOS DETECTADOS'}`);
  console.log('='.repeat(80) + '\n');

  return allPassed;
}

// Ejecutar si se invoca directamente
if (require.main === module) {
  const success = runVerification();
  process.exit(success ? 0 : 1);
}
