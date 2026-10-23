/**
 * @file index.ts
 * @description Punto de entrada unificado para el núcleo de computación científica de Métodos Numéricos.
 * Arquitectura: Clean Architecture (Domain Layer & Scientific Computing Engine).
 */

// Tipos de dominio
export * from './types/financial-model.types';
export * from './types/solver.types';

// Errores matemáticos tipados
export * from './math/matrix-errors';

// Álgebra lineal nativa
export * from './math/linear-algebra';

// Precondicionadores (Strategy Pattern)
export * from './preconditioners/preconditioner.interface';
export * from './preconditioners/identity-preconditioner';
export * from './preconditioners/jacobi-preconditioner';
export * from './preconditioners/incomplete-cholesky';
export * from './preconditioners/preconditioner-factory';

// Solvers de sistemas lineales
export * from './solvers/cholesky-solver';
export * from './solvers/conjugate-gradient';
export * from './solvers/preconditioned-cg';

// Análisis de errores y benchmarking
export * from './analysis/error-analyzer';

// Datos de escenarios
export * from './constants/scenarios.data';
