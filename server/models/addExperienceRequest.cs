using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class AddExperienceRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("position")]
        public string? Position { get; set; }

        [JsonPropertyName("company")]
        public string? Company { get; set; }

        [JsonPropertyName("responsible")]
        public string? Responsible { get; set; }

        [JsonPropertyName("startDate")]
        public DateTime? StartDate { get; set; }

        [JsonPropertyName("endDate")]
        public DateTime? EndDate { get; set; }
    }
}