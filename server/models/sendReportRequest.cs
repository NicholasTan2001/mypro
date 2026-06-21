using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class SendReportRequest
    {
        [JsonPropertyName("language")]
        public string? Language { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("reportThisId")]
        public int? ReportThisId { get; set; }

        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("report")]
        public string? Report { get; set; }
    }
}