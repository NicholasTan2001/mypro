using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateLinkRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("linkedin")]
        public string? Linkedin { get; set; }

        [JsonPropertyName("portfolio")]
        public string? Portfolio { get; set; }

        [JsonPropertyName("additional")]
        public string? Additional { get; set; }

    }
}