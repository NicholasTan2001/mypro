using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateIntroductionRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("intro")]
        public string? Intro { get; set; }
    }
}