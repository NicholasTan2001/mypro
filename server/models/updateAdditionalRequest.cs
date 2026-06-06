using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateAdditionalRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("hobby")]
        public string? Hobby { get; set; }

        [JsonPropertyName("skill")]
        public string? Skill { get; set; }

        [JsonPropertyName("language")]
        public string? Language { get; set; }
    }
}