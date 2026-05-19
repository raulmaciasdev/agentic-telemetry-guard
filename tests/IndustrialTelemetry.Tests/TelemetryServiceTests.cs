
using System;
using Xunit;
using IndustrialTelemetry.Core.Services;

namespace IndustrialTelemetry.Tests
{
    public class TelemetryServiceTests
    {
        private readonly TelemetryService _service;

        public TelemetryServiceTests()
        {
            _service = new TelemetryService();
        }

        [Fact]
        public void ParseSensorPayload_ValidPayload_ReturnsParsedData()
        {
            // Arrange
            string validPayload = "SENSOR_ZONE_A;23.5;1013.2;RUNNING";

            // Act
            var result = _service.ParseSensorPayload(validPayload);

            // Assert
            Assert.Equal("SENSOR_ZONE_A", result.SensorId);
            Assert.Equal(23.5, result.Temperature);
            Assert.Equal(1013.2, result.Pressure);
            Assert.Equal("RUNNING", result.PlcStatus);
        }

        [Fact]
        public void ParseSensorPayload_CorruptPayload_ThrowsFormatException()
        {
            // Arrange
            string corruptPayload = "SENSOR_ZONE_A;23.5;ERROR_VAL;RUNNING";

            // Act & Assert
            // Comprobamos que el parser lanza la excepción que identificaste correctamente
            Assert.Throws<FormatException>(() => _service.ParseSensorPayload(corruptPayload));
        }
    }
}