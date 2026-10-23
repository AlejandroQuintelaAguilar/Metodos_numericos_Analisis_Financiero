/**
 * @file index.ts
 * @description Punto de entrada unificado para el Módulo de Pruebas de Software (QA Engine).
 * Arquitectura: Clean Architecture (Quality Assurance Layer).
 */

export * from './types/qa.types';
export * from './validators/matrix-validator';
export * from './engine/qa-engine';
export * from './run-qa-cli';
