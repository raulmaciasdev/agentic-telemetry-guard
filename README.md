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