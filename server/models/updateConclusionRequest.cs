using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateConclusionRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("conclusion")]
        public string? Conclusion { get; set; }
    }
}