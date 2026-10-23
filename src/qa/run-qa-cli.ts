/**
 * @file run-qa-cli.ts
 * @description Ejecutor de consola para la suite de pruebas del Módulo de Aseguramiento de Calidad (QA).
 * Despliega la tabla formal de pruebas conforme al formato estándar de la Sección 9 de la consigna UMSA.
 * 
 * @author Antigravity - Advanced Scientific Computing & Software Architecture
 * @version 1.0.0
 */

import { QAEngine } from './engine/qa-engine';

export function runQACli(): boolean {
  console.log('='.repeat(105));
  console.log(' SUITE DE PRUEBAS DE SOFTWARE AUTOMATIZADAS - MÓDULO QA (SECCIÓN 9)');
  console.log(' Desafío Académico de Métodos Numéricos (UMSA - Informática) | Mención: Desarrollo de Sistemas');
  console.log('='.repeat(105));

  const engine = new QAEngine();
  const report = engine.runAllTests();

  console.log(`\nFecha de ejecución: ${report.timestamp}`);
  console.log(`Pruebas ejecutadas: ${report.totalTests} | Aprobadas: ${report.passedTests} | Fallidas: ${report.failedTests}`);
  console.log(`Tasa de éxito:      ${report.successRate.toFixed(1)}% | Tiempo total: ${report.totalExecutionTimeMs.toFixed(3)} ms`);
  console.log('-'.repeat(105));

  for (let i = 0; i < report.results.length; i++) {
    const test = report.results[i];
    const statusBadge = test.passed ? '[ PASS - APROBADO ]' : '[ FAIL - FALLIDO ]';

    console.log(`\n=========================================================================================`);
    console.log(`CASO DE PRUEBA ${i + 1}: ${test.name}  ${statusBadge}`);
    console.log(`ID: ${test.id} | Tiempo: ${test.executionTimeMs.toFixed(3)} ms`);
    console.log(`=========================================================================================`);
    console.log(`* ENTRADA:`);
    console.log(`  ${test.inputDescription}`);
    console.log(`\n* RESULTADO ESPERADO:`);
    console.log(`  ${test.expectedResult}`);
    console.log(`\n* RESULTADO OBTENIDO:`);
    console.log(`  ${test.actualResult}`);
    console.log(`\n* CONCLUSIÓN:`);
    console.log(`  ${test.conclusion}`);
  }

  // =========================================================================
  // TABLA CONSOLIDADA PARA LA SECCIÓN 9 DE LA PÁGINA WEB
  // =========================================================================
  console.log('\n' + '='.repeat(105));
  console.log(' TABLA CONSOLIDADA DE PRUEBAS DE SOFTWARE (REQUERIDA EN SECCIÓN 9)');
  console.log('='.repeat(105));
  console.log(
    `${'ID'.padEnd(24)} | ` +
    `${'Nombre de la Prueba'.padEnd(36)} | ` +
    `${'Estado'.padEnd(10)} | ` +
    `${'Tiempo'.padEnd(10)}`
  );
  console.log('-'.repeat(105));

  for (const r of report.results) {
    console.log(
      `${r.id.padEnd(24)} | ` +
      `${r.name.slice(0, 34).padEnd(36)} | ` +
      `${(r.passed ? 'PASS' : 'FAIL').padEnd(10)} | ` +
      `${(r.executionTimeMs.toFixed(2) + ' ms').padEnd(10)}`
    );
  }

  console.log('='.repeat(105));
  console.log(`VEREDICTO FINAL: ${report.allPassed ? 'TODOS LOS CASOS DE PRUEBA OBLIGATORIOS FUERON SUPERADOS EXITOSAMENTE [OK]' : 'FALLOS DETECTADOS'}`);
  console.log('='.repeat(105) + '\n');

  return report.allPassed;
}

if (require.main === module) {
  const success = runQACli();
  process.exit(success ? 0 : 1);
}
