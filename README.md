# Simulador Financiero con Gradientes Conjugados Precondicionado (GCP)

Aplicación web interactiva desarrollada para el **Desafío Académico de Métodos Numéricos** de la **Carrera de Informática (UMSA)**. 

El proyecto aplica el **Método de Gradientes Conjugados Precondicionado (GCP)** —basado en el artículo científico del **Prof. Porfirio Suñagua S. (2020)**— para resolver y optimizar la asignación de presupuestos entre cuatro áreas de Tecnologías de la Información (TI).

---

## Datos del Estudiante

* **Nombre:** Univ. Alejandro Quintela Aguilar
* **Registro Universitario (R.U.):** 1802408
* **Cédula de Identidad (C.I.):** 6805626
* **Universidad:** Universidad Mayor de San Andrés (UMSA) – Facultad de Ciencias Puras y Naturales
* **Carrera:** Informática
* **Mención:** Desarrollo de Sistemas
* **Materia:** Métodos Numéricos

---

## ¿De qué trata este proyecto?

En una empresa tecnológica, repartir el presupuesto entre distintos departamentos no es tan simple como dividir el dinero en partes iguales, porque el trabajo de un área afecta directamente a las demás. Por ejemplo, si el equipo de **Desarrollo** construye más funciones, el área de **QA (Pruebas)** tendrá más sistemas que testear, **Ciberseguridad** tendrá más código que auditar y **Cloud/DevOps** necesitará más servidores.

Este simulador modela esa relación como un sistema de ecuaciones lineales $Ax = b$ (proveniente de un problema de minimización de costos cuadráticos) con **4 variables ($n = 4$)** expresadas en miles de dólares ($K USD):

1. **$x_1$ — Infraestructura Cloud y DevOps:** Servidores, nube y automatización de despliegues.
2. **$x_2$ — Ciberseguridad y Auditoría:** Protección de datos, monitoreo y cumplimiento normativo.
3. **$x_3$ — Desarrollo de Software Core:** Programación de aplicaciones, backend, frontend y APIs.
4. **$x_4$ — Aseguramiento de Calidad (QA) y Observabilidad:** Pruebas automatizadas y monitoreo de errores.

Para encontrar la asignación óptima de dinero con una precisión de $10^{-6}$, el programa compara tres métodos en tiempo real:
* **Método Directo de Cholesky ($A = L L^T$):** Calcula la solución exacta de referencia.
* **Gradiente Conjugado Simple (GC):** Método iterativo clásico sin precondicionador.
* **Gradiente Conjugado Precondicionado (GCP - Suñagua 2020):** Utiliza precondicionadores (**Jacobi** y **Cholesky Incompleto $IC(0)$**) para acelerar la convergencia, especialmente cuando la matriz está mal condicionada.

---

## Cómo instalar y ejecutar el proyecto en tu computadora

Sigue estos pasos para correr el proyecto localmente desde cero:

### 1. Requisitos previos
Asegúrate de tener instalado **Node.js** (versión 18 o superior). Puedes verificarlo abriendo una terminal y ejecutando:
```bash
node -v
npm -v
```

### 2. Clonar el repositorio
Descarga el proyecto desde Git y entra en la carpeta:
```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto_1
```

### 3. Instalar las dependencias
Instala los paquetes necesarios (React, TypeScript, Tailwind CSS y KaTeX) con el siguiente comando:
```bash
npm install
```

### 4. Iniciar la aplicación web
Arranca el servidor de desarrollo local ejecutando:
```bash
npm run dev
```
Una vez iniciado, abre tu navegador web y entra en:
```text
http://localhost:3000/
```

---

## Otros comandos disponibles

Si deseas ejecutar las verificaciones matemáticas por consola o generar la versión lista para subir a un servidor, puedes usar estos comandos:

| Comando | ¿Para qué sirve? |
| :--- | :--- |
| `npm run dev` | Levanta la página web interactiva en `http://localhost:3000/`. |
| `npm test` | Ejecuta en consola todas las pruebas matemáticas, validación de escenarios y la suite de calidad (QA). |
| `npm run verify` | Verifica por consola que los 3 escenarios cumplan simetría ($A = A^T$) y el Criterio de Sylvester (SPD). |
| `npm run test:solvers` | Ejecuta una comparativa por consola entre Cholesky, GC y GCP. |
| `npm run test:qa` | Ejecuta por consola los 4 casos de prueba obligatorios del módulo QA. |
| `npm run build` | Compila el código TypeScript y genera la carpeta `dist/` lista para producción. |

---

## ¿Cómo usar el simulador web?

La página web está organizada de arriba hacia abajo en **10 módulos interactivos**:

1. **Inicio y Caso Financiero (Módulos 1, 2 y 3):** Presenta el contexto del problema, el significado de las 4 variables, las ecuaciones del sistema $Ax = b$ en vivo y la verificación del **Criterio de Sylvester** (que garantiza que la matriz sea simétrica y definida positiva).
2. **Editor Interactivo de Datos (Módulo 4):**
   * Puedes cambiar manualmente cualquier número de la matriz $A$, del vector de demandas $b$ o del vector inicial $x_0$.
   * Puedes elegir el precondicionador (**Jacobi**, **Cholesky Incompleto $IC(0)$** o **Identidad**) y la tolerancia.
   * Incluye botones para **simular una matriz asimétrica o no definida positiva** y comprobar que el sistema detecta el error y muestra una alerta clara sin bloquear la página.
3. **Tres Escenarios Preconfigurados (Módulo 5):** Con un solo clic puedes cargar y comparar los tres casos obligatorios:
   * **Escenario 1 (Ideal):** Sistema equilibrado y bien condicionado ($\kappa(A) = 2.71$).
   * **Escenario 2 (Bajo Estrés Financiero):** Simula un aumento fuerte en costos de nube y ciberseguridad ($\kappa(A) = 3.40$).
   * **Escenario 3 (Mal Condicionado):** Sistema con alta disparidad de escalas ($\kappa(A) = 1477.17$), donde se observa cómo el precondicionador reduce el número de condición a $2.55$ y acelera drásticamente el cálculo.
4. **Resultados, Gráficas y Errores (Módulos 6, 7 y 8):** Muestra la solución exacta por Cholesky, la gráfica semilogarítmica de convergencia comparando **GCP vs GC**, el historial paso a paso de cada iteración y la tabla de errores absolutos ($E_a$), relativos ($E_r$) y porcentuales ($E_p$) por variable.
5. **Tabla Comparativa y Módulo QA (Sección 8 y Módulo 9):** Resume los tres escenarios lado a lado e incluye el panel de **Pruebas de Software (QA)** donde puedes ejecutar en vivo los 4 casos de prueba automatizados.

---

## Estructura del código (Arquitectura del proyecto)

El código está separado en tres capas claras dentro de la carpeta `src/` para que sea fácil de leer y mantener:

```text
src/
├── core/                  # Motor matemático puro (sin dependencias de la interfaz)
│   ├── constants/         # Datos y justificación de los 3 escenarios financieros
│   ├── math/              # Operaciones matriciales, vectores y determinante de Sylvester
│   ├── preconditioners/   # Precondicionadores: Jacobi, Cholesky Incompleto IC(0) e Identidad
│   ├── solvers/           # Algoritmos: Cholesky directo, GC simple y GCP (Suñagua 2020)
│   └── analysis/          # Cálculo de errores (Ea, Er, Ep) y residuos relativos
│
├── qa/                    # Control de calidad y validación defensiva
│   ├── validators/        # Validador que detecta matrices no simétricas o no definidas positivas
│   └── engine/            # Motor automatizado con los 4 casos de prueba obligatorios
│
└── ui/                    # Interfaz gráfica en React + Tailwind CSS
    ├── components/        # Los 10 módulos visuales, editor matricial, tablas y gráfica SVG
    └── App.tsx            # Conector principal reactivo de la aplicación
```

---

## Referencias Bibliográficas

1. **Suñagua S., P. (2020).** *Método de Gradientes Conjugados Precondicionado*. Revista Boliviana de Matemática – Universidad Mayor de San Andrés (UMSA), Vol. 04, págs. 2–7.
2. **Golub, G. H., & Van Loan, C. F. (2013).** *Matrix Computations* (4th ed.). Johns Hopkins University Press.
3. **Saad, Y. (2003).** *Iterative Methods for Sparse Linear Systems* (2nd ed.). SIAM.
