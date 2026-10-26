/**
 * @file App.tsx
 * @description Ensamblador principal reactivo de la aplicación web del Desafío Académico.
 * Conecta los modelos matemáticos, solvers directos, GC, GCP (Suñagua 2020) y el panel QA.
 */

import React, { useState, useMemo } from 'react';
import {
  SCENARIO_IDEAL,
  SCENARIO_FINANCIAL_STRESS,
  SCENARIO_ILL_CONDITIONED
} from '../core/constants/scenarios.data';
import { ScenarioId } from '../core/types/financial-model.types';
import { PreconditionerType } from '../core/preconditioners/preconditioner.interface';
import { PreconditionerFactory } from '../core/preconditioners/preconditioner-factory';
import { solveCholesky } from '../core/solvers/cholesky-solver';
import { ConjugateGradientSolver } from '../core/solvers/conjugate-gradient';
import { PreconditionedCGSolver } from '../core/solvers/preconditioned-cg';
import { ErrorAnalyzer } from '../core/analysis/error-analyzer';
import { MatrixValidator } from '../qa/validators/matrix-validator';
import { deepCloneMatrix, deepCloneVector } from '../core/math/linear-algebra';

// Componentes de interfaz
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FinancialCaseSection } from './components/FinancialCaseSection';
import { MathFormulationSection } from './components/MathFormulationSection';
import { ScenarioButtons } from './components/ScenarioButtons';
import { MatrixEditor } from './components/MatrixEditor';
import { DirectSolutionDisplay } from './components/DirectSolutionDisplay';
import { GcpVsGcSection } from './components/GcpVsGcSection';
import { ErrorAnalysisTable } from './components/ErrorAnalysisTable';
import { ComparativeTable } from './components/ComparativeTable';
import { QAPanel } from './components/QAPanel';
import { ConclusionsSection } from './components/ConclusionsSection';

export const App: React.FC = () => {
  // Estado reactivo principal
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId | 'custom'>('ideal');
  const [matrixA, setMatrixA] = useState<number[][]>(() =>
    deepCloneMatrix(SCENARIO_IDEAL.matrixA.data)
  );
  const [vectorB, setVectorB] = useState<number[]>(() =>
    deepCloneVector(SCENARIO_IDEAL.vectorB.values)
  );
  const [initialGuess, setInitialGuess] = useState<number[]>([0, 0, 0, 0]);
  const [tolerance, setTolerance] = useState<number>(1e-6);
  const [maxIterations, setMaxIterations] = useState<number>(100);
  const [preconditionerType, setPreconditionerType] = useState<PreconditionerType>('jacobi');

  // Solver instances fijas
  const gcSolver = useMemo(() => new ConjugateGradientSolver(), []);

  // 1. Validación defensiva continua de la matriz A y vector b
  const validation = useMemo(() => {
    return MatrixValidator.validateSystem(matrixA, vectorB);
  }, [matrixA, vectorB]);

  // 2. Solución Numérica de Referencia (Método Directo Cholesky A = L*L^T)
  const choleskyResult = useMemo(() => {
    if (!validation.isValid) return null;
    try {
      return solveCholesky(matrixA, vectorB, false);
    } catch {
      return null;
    }
  }, [matrixA, vectorB, validation.isValid]);

  // 3. Resolución iterativa con GC Simple (sin precondicionar)
  const gcResult = useMemo(() => {
    if (!validation.isValid) return null;
    try {
      return gcSolver.solve(matrixA, vectorB, {
        tolerance,
        maxIterations,
        initialGuess
      });
    } catch {
      return null;
    }
  }, [matrixA, vectorB, tolerance, maxIterations, initialGuess, validation.isValid, gcSolver]);

  // 4. Resolución iterativa con GCP (Suñagua 2020)
  const gcpResult = useMemo(() => {
    if (!validation.isValid) return null;
    try {
      const prec = PreconditionerFactory.create(preconditionerType);
      const gcpSolver = new PreconditionedCGSolver(prec);
      return gcpSolver.solve(matrixA, vectorB, {
        tolerance,
        maxIterations,
        initialGuess
      });
    } catch {
      return null;
    }
  }, [matrixA, vectorB, tolerance, maxIterations, initialGuess, preconditionerType, validation.isValid]);

  // 5. Análisis Numérico de Errores (Ea, Er, Ep)
  const errorAnalysis = useMemo(() => {
    if (!validation.isValid || !choleskyResult || !gcpResult) return null;
    return ErrorAnalyzer.computeErrorAnalysis(
      matrixA,
      vectorB,
      choleskyResult.xRef,
      gcpResult.x,
      ['x1', 'x2', 'x3', 'x4']
    );
  }, [matrixA, vectorB, choleskyResult, gcpResult, validation.isValid]);

  // 6. Números de Condición calculados dinámicamente y protegidos ante matrices inválidas
  const conditionNumbers = useMemo(() => {
    if (!validation.isValid) {
      return { condA: NaN, condPrec: NaN };
    }
    try {
      // Condición original κ(A)
      let condA: number;
      if (activeScenarioId === 'ideal') {
        condA = SCENARIO_IDEAL.spectral.conditionNumber;
      } else if (activeScenarioId === 'financial_stress') {
        condA = SCENARIO_FINANCIAL_STRESS.spectral.conditionNumber;
      } else if (activeScenarioId === 'ill_conditioned') {
        condA = SCENARIO_ILL_CONDITIONED.spectral.conditionNumber;
      } else {
        const idPrec = PreconditionerFactory.create('identity', matrixA);
        condA = idPrec.getConditionNumber(matrixA);
      }

      // Condición precondicionada κ(M⁻¹A) según el precondicionador activo
      let condPrec: number;
      if (preconditionerType === 'identity') {
        condPrec = condA;
      } else if (preconditionerType === 'jacobi' && activeScenarioId !== 'custom') {
        if (activeScenarioId === 'ideal') {
          condPrec = SCENARIO_IDEAL.preconditioning.preconditionedConditionNumber;
        } else if (activeScenarioId === 'financial_stress') {
          condPrec = SCENARIO_FINANCIAL_STRESS.preconditioning.preconditionedConditionNumber;
        } else {
          condPrec = SCENARIO_ILL_CONDITIONED.preconditioning.preconditionedConditionNumber;
        }
      } else {
        const prec = PreconditionerFactory.create(preconditionerType, matrixA);
        condPrec = prec.getConditionNumber(matrixA);
      }

      return { condA, condPrec };
    } catch {
      return { condA: NaN, condPrec: NaN };
    }
  }, [activeScenarioId, matrixA, preconditionerType, validation.isValid]);

  // Manejadores de eventos interactivos
  const handleSelectScenario = (id: ScenarioId) => {
    setActiveScenarioId(id);
    let target = SCENARIO_IDEAL;
    if (id === 'financial_stress') target = SCENARIO_FINANCIAL_STRESS;
    if (id === 'ill_conditioned') target = SCENARIO_ILL_CONDITIONED;

    setMatrixA(deepCloneMatrix(target.matrixA.data));
    setVectorB(deepCloneVector(target.vectorB.values));
    setInitialGuess([0, 0, 0, 0]);
  };

  const handleUpdateMatrixA = (r: number, c: number, val: number) => {
    setActiveScenarioId('custom');
    setMatrixA((prev) => {
      const copy = deepCloneMatrix(prev);
      copy[r][c] = val;
      return copy;
    });
  };

  const handleUpdateVectorB = (idx: number, val: number) => {
    setActiveScenarioId('custom');
    setVectorB((prev) => {
      const copy = deepCloneVector(prev);
      copy[idx] = val;
      return copy;
    });
  };

  const handleUpdateInitialGuess = (idx: number, val: number) => {
    setInitialGuess((prev) => {
      const copy = deepCloneVector(prev);
      copy[idx] = val;
      return copy;
    });
  };

  const handleSymmetrize = () => {
    setMatrixA((prev) => {
      const n = prev.length;
      const symm = deepCloneMatrix(prev);
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const avg = (prev[i][j] + prev[j][i]) / 2;
          symm[i][j] = avg;
          symm[j][i] = avg;
        }
      }
      return symm;
    });
  };

  const handleResetCustom = () => {
    handleSelectScenario('ideal');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <HeroSection />

      <FinancialCaseSection />

      <MathFormulationSection
        validation={validation}
        matrixA={matrixA}
        vectorB={vectorB}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Módulo 4: Entrada de Datos, Coeficientes A, b, x0 y Controles */}
        <MatrixEditor
          matrixA={matrixA}
          vectorB={vectorB}
          initialGuess={initialGuess}
          tolerance={tolerance}
          maxIterations={maxIterations}
          preconditionerType={preconditionerType}
          validation={validation}
          onUpdateMatrixA={handleUpdateMatrixA}
          onUpdateVectorB={handleUpdateVectorB}
          onUpdateInitialGuess={handleUpdateInitialGuess}
          onUpdateTolerance={setTolerance}
          onUpdateMaxIterations={setMaxIterations}
          onUpdatePreconditioner={setPreconditionerType}
          onSymmetrize={handleSymmetrize}
        />

        {/* Módulo 5: Tres Escenarios Oficiales (Carga Rápida y Ejecución) */}
        <ScenarioButtons
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          onResetCustom={handleResetCustom}
        />

        {/* Módulo 6: Solución Numérica de Referencia (Cholesky Directo) */}
        <DirectSolutionDisplay choleskyResult={choleskyResult} />

        {/* Contraste GCP vs GC y Gráfico de Convergencia */}
        <GcpVsGcSection
          gcResult={gcResult}
          gcpResult={gcpResult}
          conditionNumberA={conditionNumbers.condA}
          conditionNumberPrec={conditionNumbers.condPrec}
          tolerance={tolerance}
        />

        {/* Análisis Detallado de Errores por Componente */}
        <ErrorAnalysisTable errorAnalysis={errorAnalysis} />

        {/* Tabla Comparativa Oficial Transversal (Sección 8) */}
        <ComparativeTable />

        {/* Panel Interactivo de Pruebas de Software (Módulo QA - Sección 9) */}
        <QAPanel />
      </main>

      <ConclusionsSection />
    </div>
  );
};
export default App;
