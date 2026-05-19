using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using System;

namespace IndustrialTelemetry.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Leemos el token desde la configuración (appsettings.Development.json)
            var githubToken = builder.Configuration["GitHub:Token"];

            // Registramos el servicio como un Singleton o Scoped
            builder.Services.AddSingleton<IIssueReporter>(new GitHubIssueReporter(githubToken));

            var app = builder.Build();

            app.UseCors();

            app.MapPost("/api/telemetry/validate", async (TelemetryRequest request, IIssueReporter issueReporter) =>
            {
                string[] parts = request.Payload.Split(';');
                string sensorId = parts.Length > 0 ? parts[0] : "UNKNOWN";

                // Lógica de validación resiliente
                bool isTempValid = double.TryParse(parts.Length > 1 ? parts[1] : "", out double temperature);
                bool isPressValid = double.TryParse(parts.Length > 2 ? parts[2] : "", out double pressure);
                string status = parts.Length > 3 ? parts[3] : "UNKNOWN";

                if (isTempValid && isPressValid)
                {
                    return Results.Ok(new { SensorId = sensorId, Temperature = temperature, Pressure = pressure, PlcStatus = status, IsCorrupt = false });
                }

                // Registro de incidente para auditoría
                Console.WriteLine($"[CRITICAL] Error en sensor {sensorId}: trama corrupta.");

                // DISPARADOR AGÉNTICO: Aquí reportamos el fallo a GitHub
                await issueReporter.ReportCriticalErrorAsync(sensorId, "Fallo de validación en trama de telemetría.");

                return Results.BadRequest(new
                {
                    SensorId = sensorId,
                    ErrorMessage = "Datos corruptos detectados.",
                    IsCorrupt = true
                });
            });

            app.Run();
        }
    }


}