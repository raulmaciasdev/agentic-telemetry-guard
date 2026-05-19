using System;
using System.Globalization;

namespace IndustrialTelemetry.Core.Services
{
    public class TelemetryService
    {
        // Ejemplo de trama esperada de la planta: "SENSOR_ZONE_A;23.5;1013.2;RUNNING"
        public SensorData ParseSensorPayload(string rawPayload)
        {
            if (string.IsNullOrWhiteSpace(rawPayload))
            {
                throw new ArgumentException("La trama del sensor no puede estar vacía.");
            }

            var parts = rawPayload.Split(';');

            if (parts.Length != 4)
            {
                throw new FormatException("Trama de telemetría industrial corrupta o incompleta.");
            }

            return new SensorData
            {
                SensorId = parts[0],
                Temperature = double.Parse(parts[1], CultureInfo.InvariantCulture),
                Pressure = double.Parse(parts[2], CultureInfo.InvariantCulture),
                PlcStatus = parts[3]
            };
        }
    }

    public class SensorData
    {
        public string SensorId { get; set; } = string.Empty;
        public double Temperature { get; set; }
        public double Pressure { get; set; }
        public string PlcStatus { get; set; } = string.Empty;
    }
}