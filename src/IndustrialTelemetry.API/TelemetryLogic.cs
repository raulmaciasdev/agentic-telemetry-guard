namespace IndustrialTelemetry.Api
{
    public static class TelemetryLogic
    {
        public static IResult Validate(TelemetryRequest request)
        {
            string[] parts = request.Payload.Split(';');
            string sensorId = parts.Length > 0 ? parts[0] : "UNKNOWN";

            bool isTempValid = double.TryParse(parts.Length > 1 ? parts[1] : "", out double temperature);
            bool isPressValid = double.TryParse(parts.Length > 2 ? parts[2] : "", out double pressure);
            string status = parts.Length > 3 ? parts[3] : "UNKNOWN";

            if (isTempValid && isPressValid)
                return Results.Ok(new { SensorId = sensorId, Temperature = temperature, Pressure = pressure, PlcStatus = status, IsCorrupt = false });

            return Results.BadRequest(new { SensorId = sensorId, ErrorMessage = "Datos corruptos.", IsCorrupt = true });
        }
    }
}
