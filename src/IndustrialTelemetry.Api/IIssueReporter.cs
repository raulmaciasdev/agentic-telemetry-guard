using Octokit;

namespace IndustrialTelemetry.Api
{

    public interface IIssueReporter
    {
        Task ReportCriticalErrorAsync(string sensorId, string details);
    }

    public class GitHubIssueReporter : IIssueReporter
    {
        private readonly GitHubClient _client;
        private const string RepoOwner = "raulmaciasdev"; // Cámbialo por el tuyo
        private const string RepoName = "agentic-telemetry-guard";

        public GitHubIssueReporter(string token)
        {
            _client = new GitHubClient(new ProductHeaderValue("IndustrialTelemetryAPI"));
            _client.Credentials = new Credentials(token);
        }

        public async Task ReportCriticalErrorAsync(string sensorId, string details)
        {
            var newIssue = new NewIssue($"[CRITICAL] Error en Sensor {sensorId}")
            {
                Body = $"Se ha detectado un fallo en la trama de telemetría.\n\nDetalles:\n{details}",
                Labels = { "bug:telemetry" } // Esto dispara automáticamente tu pipeline
            };

            await _client.Issue.Create(RepoOwner, RepoName, newIssue);
        }
    }

}