using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class AddProjectRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("feature")]
        public string? Feature { get; set; }

        [JsonPropertyName("startDate")]
        public DateTime? StartDate { get; set; }

        [JsonPropertyName("endDate")]
        public DateTime? EndDate { get; set; }
    }
}