# 🤖 Agentic Telemetry Guard: Automated Quality Control for Industrial IoT Sensors

[![Industrial Telemetry CI](https://github.com/raulmaciasdev/agentic-telemetry-guard/actions/workflows/dotnet-telemetry-ci.yml/badge.badge.svg)](https://github.com/raulmaciasdev/agentic-telemetry-guard/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Agentic Telemetry Guard** es un ecosistema de porfolio diseñado bajo estándares empresariales que demuestra la convergencia entre la **Telemetría Industrial (IoT)** y la **Gobernanza de Agentes de IA Autónomos** en entornos de producción.


El sistema simula un parser de sensores de planta en **.NET 10** y un panel de monitorización en **React/TypeScript**, gobernados por un flujo de autorreparación (*Self-Healing*) mediante GitHub Actions.

---

## 🛠️ Arquitectura del Sistema & Flujo de Gobernanza

El proyecto está diseñado bajo el principio estricto de **Human-in-the-Loop**, asegurando que la IA actúe como un asistente automatizado en entornos aislados sin autonomía directa sobre la rama de producción.

1. **Ingestión e Incidente:** El sistema procesa tramas de sensores de planta. Si una trama llega corrupta (ej. caracteres alfanuméricos en campos numéricos), el sistema lanza un `FormatException`.
2. **Alerta y Documentación:** Se genera un *Issue* automático en GitHub documentando el fallo del sensor para el cliente.
3. **Activación de la IA (Aislamiento):** GitHub Actions despierta a un agente autónomo de IA en un entorno seguro. El agente analiza el error, reproduce el fallo con un test en `xUnit` y aplica código defensivo en .NET.
4. **Validación y Pull Request:** Si y solo si los tests pasan y el formato es correcto, la IA genera una *Pull Request* automática detallando la solución.
5. **Aprobación Humana:** El Líder Técnico revisa, audita y fusiona manualmente el código corregido.

---

## 📂 Estructura del Proyecto

```text
├── .github/workflows/
│   ├── dotnet-telemetry-ci.yml   # Pipeline de Integración Continua (CI)
│   └── agentic-resolver.yml      # Orquestador del Agente Autónomo de IA
├── src/
│   ├── IndustrialTelemetry.Core/  # Backend en .NET 10 (Lógica de Parseo de Sensores)
│   ├── IndustrialTelemetry.API/   # Backend .NET 10 (Incluye IIssueReporter)
│   └── telemetry-monitor-ui/     # Frontend en React / TypeScript
└── tests/
    └── IndustrialTelemetry.Tests/ # Batería de Tests Unitarios (xUnit)
```

## 🚀 Cómo Ejecutar Localmente
Requisitos Prerrequisitos
.NET 10 SDK

Node.js (versión 18 o superior)

Ejecutar y Validar Tests del Backend
```Bash
dotnet build
dotnet test
```
---

## 🎯 ¿Por qué diseñamos este flujo de trabajo? (Criterio de Arquitectura)

En entornos industriales reales (plantas de fabricación, cadenas de frío, refinerías), los microcortes eléctricos y las interferencias electromagnéticas provocan de manera inevitable que los sensores IoT transmitan tramas de datos corruptas, incompletas o mal formateadas.

### El Enfoque Tradicional vs. El Enfoque Agéntico

| Mantenimiento Tradicional (Frágil) | Enfoque Agentic Telemetry Guard (Resiliente) |
| :--- | :--- |
| El sistema se cae en producción lanzando una excepción (`FormatException`). | El pipeline detecta el fallo de ingesta de forma segura y controlada. |
| El panel visual se congela o muestra datos erróneos de forma indefinida. | Se genera un *Issue* automatizado aislando la trama rota para proteger el negocio. |
| Se requiere despertar a un ingeniero Senior de guardia a las 3:00 AM. | Un Agente Autónomo de IA se despierta en un *sandbox* seguro para diseñar la solución. |
| Horas de inactividad de la planta (*Downtime*) esperando un parche manual. | Se genera una *Pull Request* defensiva con tests en verde en menos de 2 minutos. |

### 🛡️ Gobernanza Estricta: El Principio "Human-in-the-Loop"

Un error crítico en la implementación actual de la IA en las empresas es otorgar autonomía total a los agentes para modificar el código de producción. En este proyecto demostramos cómo mitigar el riesgo tecnológico mediante un diseño estricto de **Gobernanza de IA**:

1. **Aislamiento Absoluto (*Sandboxing*):** El agente de IA opera exclusivamente dentro de una rama efímera e independiente (`agent-fix-telemetry`). Jamás tiene acceso de escritura directo sobre la rama principal (`main`).
2. **Validación por Juez Automatizado:** La propuesta de la IA se somete a la batería de pruebas unitarias (`xUnit` en .NET 10). Si la IA introduce un cambio que rompe otra regla del negocio, el pipeline de GitHub Actions bloquea la propuesta de inmediato.
3. **Auditoría y Autorización Humana:** El sistema está diseñado para que la IA proponga, pero el ingeniero disponga. El código corregido solo se fusionará con la rama de producción tras la revisión, comentarios y aprobación manual del Líder Técnico en la interfaz de GitHub.

---
