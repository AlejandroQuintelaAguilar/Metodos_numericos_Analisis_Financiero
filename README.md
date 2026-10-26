# Desafío Académico de Métodos Numéricos — UMSA
## Aplicación del Método de Gradientes Conjugados Precondicionado (GCP) en Problemas Financieros

[![CI/CD - Test & Deploy](https://github.com/usuario/metodos-numericos-gcp/actions/workflows/deploy.yml/badge.svg)](https://github.com/usuario/metodos-numericos-gcp/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.8%20Strict-blue)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)
[![QA Tests: 100% PASS](https://img.shields.io/badge/QA%20Tests-100%25%20PASS-emerald)](https://github.com/)

---

### 1. Información Institucional y Académica
* **Estudiante:** Univ. Alejandro Quintela Aguilar
* **Registro Universitario (R.U.):** 1802408
* **Cédula de Identidad (C.I.):** 6805626
* **Institución:** Universidad Mayor de San Andrés (UMSA)
* **Facultad:** Facultad de Ciencias Puras y Naturales (FCPN)
* **Carrera:** Informática
* **Asignatura:** Métodos Numéricos
* **Mención:** **Desarrollo de Sistemas** (Énfasis en arquitectura de software desacoplada, interfaces web reactivas, validaciones matemáticas defensivas y pruebas funcionales de calidad).
* **Fundamento Teórico Principal:** Artículo científico *«Método de Gradientes Conjugados Precondicionado»* — **Prof. Porfirio Suñagua S.** (*Revista Boliviana de Matemática – UMSA*, Vol. 04, págs. 2–7, 2020).
* **Modalidad:** Individual
* **Año Académico:** 2026

---

## 2. Contexto Financiero y Modelo Matemático (\(n = 4\))

En la gestión estratégica de Tecnologías de la Información (TI), el problema de asignación presupuestaria departamental no es una simple suma lineal, sino un **problema de optimización cuadrática bajo fricción de escala y dependencia cruzada interdepartamental**:

$$\min_{x \in \mathbb{R}^4} \Phi(x) = \frac{1}{2} x^T A x - b^T x \quad \Longleftrightarrow \quad \nabla \Phi(x) = A x - b = 0 \quad \Longleftrightarrow \quad A x = b$$

### 2.1 Definición de las Variables de Decisión (\(x_i\) en miles de USD — $K)
* **\(x_1\): Infraestructura Cloud, DevOps y Plataforma:** Aprovisionamiento de cómputo elástico (AWS, GCP, Azure), clústeres Kubernetes, almacenamiento distribuido y redes.
* **\(x_2\): Ciberseguridad, Auditoría y Cumplimiento Normativo:** Centros de operaciones de seguridad (SOC/SIEM 24/7), arquitecturas Zero-Trust, auditorías PCI-DSS v4.0 e ISO 27001.
* **\(x_3\): Ingeniería de Software Core:** Arquitectura de microservicios, contratos de API (REST/gRPC), frontend SPA y desarrollo de lógica de negocio central.
* **\(x_4\): Aseguramiento de Calidad (QA), Testing Automatizado y Observabilidad:** Suites E2E automatizadas, pruebas de rendimiento/caos y observabilidad distribuida (OpenTelemetry, Prometheus).

### 2.2 Interpretación Económica de Parámetros
* **Vector de Demanda Bruta (\(b \in \mathbb{R}^4\)):** Representa las solicitudes netas iniciales de capital por área. El término lineal \(b^T x\) mide el beneficio o retorno directo generado por financiar dichos proyectos.
* **Matriz de Rigidez de Costes e Interdependencia (\(A \in \mathbb{R}^{4 \times 4}\)):** Actúa como la matriz Hessiana \(\nabla^2 \Phi(x) = A\).
  * **Elementos Diagonales (\(a_{ii} > 0\)):** Fricción interna de absorción de capital y rendimientos marginales decrecientes de cada área técnica.
  * **Elementos Cruzados (\(a_{ij} = a_{ji} \ge 0\)):** Coeficiente de fricción por acoplamiento e interoperabilidad (e.g., expandir el desarrollo en \(x_3\) incrementa la carga inducida sobre la auditoría en \(x_2\) y las suites de pruebas en \(x_4\)).
* **Propiedades Matemáticas Obligatorias:**
  * **Simetría Estricta:** \(A = A^T \iff \max |a_{ij} - a_{ji}| = 0\). La fricción mutua entre dos departamentos es bidireccional y balanceada.
  * **Estrictamente Definida Positiva (SPD):** \(x^T A x > 0, \forall x \neq \mathbf{0}\). Certificada analíticamente mediante el **Criterio de Sylvester** (\(\Delta_1 > 0, \Delta_2 > 0, \Delta_3 > 0, \Delta_4 > 0\)), garantizando que la función \(\Phi(x)\) sea estrictamente convexa y posea un único mínimo global.

---

## 3. Especificación Numérica de los Tres Escenarios Obligatorios

| Métrica / Parámetro | Escenario 1 (Ideal) | Escenario 2 (Bajo Estrés) | Escenario 3 (Mal Condicionado) |
| :--- | :---: | :---: | :---: |
| **Diagnóstico** | Bien condicionado, SPD | Perturbación de demanda y acoplamiento | Rigidez multiescala severa |
| **Matriz \(A\)** | \(\begin{bmatrix} 4.0 & 0.8 & 1.0 & 0.6 \\ 0.8 & 3.5 & 0.7 & 0.4 \\ 1.0 & 0.7 & 5.0 & 1.2 \\ 0.6 & 0.4 & 1.2 & 3.0 \end{bmatrix}\) | \(\begin{bmatrix} 4.8 & 1.8 & 1.2 & 0.7 \\ 1.8 & 4.2 & 0.9 & 0.5 \\ 1.2 & 0.9 & 5.5 & 1.9 \\ 0.7 & 0.5 & 1.9 & 3.6 \end{bmatrix}\) | \(\begin{bmatrix} 120.0 & 8.0 & 3.0 & 0.5 \\ 8.0 & 60.0 & 2.0 & 0.3 \\ 3.0 & 2.0 & 10.0 & 0.4 \\ 0.5 & 0.3 & 0.4 & 0.10 \end{bmatrix}\) |
| **Vector \(b\) ($K)** | \([150.2, 84.3, 221.4, 97.0]^T\) | \([267.5, 185.5, 240.5, 113.0]^T\) | \([3230.0, 1172.0, 421.0, 33.0]^T\) |
| **Menores de Sylvester** | \(\Delta_1 = 4.00, \Delta_2 = 13.36\)<br>\(\Delta_3 = 62.46, \Delta_4 = 166.72\) | \(\Delta_1 = 4.80, \Delta_2 = 16.92\)<br>\(\Delta_3 = 87.01, \Delta_4 = 254.38\) | \(\Delta_1 = 120, \Delta_2 = 7136\)<br>\(\Delta_3 = 70436, \Delta_4 = 5785.29\) |
| **Autovalores \(\lambda_i\)** | \([2.425, 2.912, 3.594, 6.569]\) | \([2.424, 2.672, 4.770, 8.234]\) | \([0.0820, 9.869, 59.004, 121.145]\) |
| **Condición \(\kappa_2(A)\)** | **\(2.71 < 15\)** | **\(3.40 < 15\)** | **\(1477.17 \gg 10^3\)** |
| **Condición con Jacobi** | \(2.36\) | \(3.13\) | **\(2.55\) (Reducción \(580\times\))** |
| **Solución Exacta \(x^*\)** | \([25.0, 10.0, 35.0, 12.0]^T\) | \([40.0, 20.0, 30.0, 5.0]^T\) | \([25.0, 15.0, 30.0, 40.0]^T\) |
| **Presupuesto Total** | \(\$82.0\text{K USD}\) | \(\$95.0\text{K USD}\) | \(\$110.0\text{K USD}\) |

---

## 4. Arquitectura del Software (Mención Desarrollo de Sistemas)

El proyecto fue diseñado aplicando **Clean Architecture**, principios **SOLID** y el patrón **Strategy** para la intercambiabilidad de operadores de precondicionamiento:

```
src/
├── core/                               # NÚCLEO MATEMÁTICO PURO (SIN DEPENDENCIAS UI)
│   ├── types/                          # Interfaces fuertemente tipadas de dominio
│   ├── math/
│   │   ├── linear-algebra.ts           # Álgebra lineal nativa (dot, norm2, solveTriangular)
│   │   └── matrix-errors.ts            # Jerarquía de errores tipados no colapsantes
│   ├── solvers/
│   │   ├── cholesky-solver.ts          # Descomposición A = L*L^T (Solución de referencia)
│   │   ├── conjugate-gradient.ts       # GC simple sin precondicionar (Contraste)
│   │   └── preconditioned-cg.ts        # GCP según algoritmo de Suñagua (2020)
│   ├── preconditioners/
│   │   ├── preconditioner.interface.ts # Contrato formal (Strategy Pattern)
│   │   ├── identity-preconditioner.ts  # M = I
│   │   ├── jacobi-preconditioner.ts    # M = diag(A)
│   │   ├── incomplete-cholesky.ts      # M = L~ * L~^T (IC0)
│   │   └── preconditioner-factory.ts   # Factoría y catálogo
│   └── analysis/
│       └── error-analyzer.ts           # Cálculo de errores Ea, Er, Ep y residuo global
│
├── qa/                                 # MOTOR DE CONTROL DE CALIDAD Y QA ENGINE (SECCIÓN 9)
│   ├── validators/matrix-validator.ts  # Validación defensiva de entradas (SPD, simetría)
│   ├── engine/qa-engine.ts             # Ejecutor de los 4 casos de prueba automatizados
│   └── run-qa-cli.ts                   # Ejecutor CLI de terminal
│
└── ui/                                 # INTERFAZ WEB REACTIVA (REACT 19 + TAILWIND CSS)
    ├── components/                     # 10 Módulos desacoplados de la Sección 7
    ├── App.tsx                         # Ensamblador reactivo con estado memoizado
    └── main.tsx                        # Punto de entrada de renderizado DOM
```

---

## 5. Módulo de Pruebas de Software (QA Engine - Sección 9)

El sistema integra un módulo de aseguramiento de calidad automatizado que evalúa en tiempo de ejecución:

| ID | Nombre del Caso | Entrada | Resultado Esperado | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **QA-01** | **Carga de Escenarios Predefinidos** | Carga secuencial de Escenarios Ideal, Estrés y Mal Condicionado. | Matrices SPD, Cholesky exacto y GCP converge con \(\|r_k\|_2/\|b\|_2 < 10^{-6}\). | SPD certificado. Residuo Cholesky \(< 10^{-12}\). GCP converge en 4 iters en todos los casos. | **PASS** |
| **QA-02** | **Validación de Matriz No Válida** | Inyección de matriz asimétrica (\(A_{01}=5.0 \neq A_{10}=0.8\)) y no SPD (\(A_{00}=-4.0\)). | Validador intercepta sin crash; captura de `MatrixNotSymmetricError` y `MatrixNotPositiveDefiniteError`. | `ERR_ASYMMETRIC_MATRIX` y `ERR_NON_POSITIVE_DIAGONAL` detectados. Aplicación 100% estable. | **PASS** |
| **QA-03** | **Edición Dinámica y Recálculo** | Incremento del \(+50\%\) en demanda de infraestructura (\(b_1\) de \(150.2 \to 225.3 \text{ \$K}\)). | Actualización reactiva de Cholesky y GCP con nueva solución \(x^*\) y tabla de errores. | Solución actualizada a \$45.66K en \(x_1\). GCP converge en 4 iters con residuo \(3.87 \times 10^{-17}\). | **PASS** |
| **QA-04** | **Eficiencia de Precondicionamiento** | Contraste GC Simple vs GCP (Jacobi e IC0) sobre Escenario Mal Condicionado (\(\kappa = 1477.17\)). | \(\text{Iteraciones}_{\text{GCP}} \le \text{Iteraciones}_{\text{GC}}\) alcanzando tolerancia. | GC: 4 iters (res \(10^{-12}\)). Jacobi: 4 iters (res \(10^{-19}\)). IC(0): 1 iter (res \(0.0\)). Aprobado. | **PASS** |

*Tasa de Aprobación QA:* **100.0% (4/4 Casos PASS)**.

---

## 6. Instrucciones de Instalación y Ejecución Local

### Requisitos Previos
* **Node.js:** Versión 18.0 o superior (compatible con Node 20.x y 22.x LTS).
* **NPM:** Versión 9.0 o superior.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/usuario/metodos-numericos-gcp.git
cd metodos-numericos-gcp
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar la Aplicación Web en Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible localmente en `http://localhost:3000` con recarga rápida de módulos (HMR).

### 4. Ejecución de la Suite Completa de Pruebas en Consola
```bash
npm test
```
Ejecuta secuencialmente:
1. `npm run verify`: Verificación analítica del Criterio de Sylvester en los 3 escenarios.
2. `npm run test:solvers`: Benchmarking de Cholesky vs. GC vs. GCP.
3. `npm run test:qa`: Ejecución automatizada de los 4 casos de prueba de calidad de software.

### 5. Compilación para Producción
```bash
npm run build
```
Genera la compilación estática de alto rendimiento en la carpeta `dist/`.

---

## 7. Despliegue en la Nube (CI/CD)

El repositorio incluye automatización para dos plataformas de despliegue público gratuito sin autenticación previa:

### A. GitHub Pages (Mediante GitHub Actions)
El flujo de trabajo en `.github/workflows/deploy.yml` automatiza la integración y entrega continua en cada push a la rama `main`:
1. Checkout del código fuente.
2. Instalación de dependencias mediante `npm ci`.
3. Ejecución obligatoria de la suite de pruebas (`npm test`). Si alguna prueba falla, el pipeline aborta el despliegue.
4. Compilación estática de la UI mediante `npm run build`.
5. Publicación del artefacto `dist/` en GitHub Pages.

### B. Vercel
El archivo de configuración [`vercel.json`](vercel.json) gestiona el enrutamiento para Single Page Applications (SPA):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 8. Referencias Bibliográficas Formales

1. **Suñagua S., P. (2020).** *Método de Gradientes Conjugados Precondicionado*. Revista Boliviana de Matemática – Universidad Mayor de San Andrés (UMSA), Vol. 04, págs. 2–7.
2. **Golub, G. H., & Van Loan, C. F. (2013).** *Matrix Computations* (4th ed.). Johns Hopkins University Press. Baltimore, Maryland, USA.
3. **Saad, Y. (2003).** *Iterative Methods for Sparse Linear Systems* (2nd ed.). SIAM (Society for Industrial and Applied Mathematics). Philadelphia, PA, USA.
