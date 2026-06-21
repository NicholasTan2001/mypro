using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class LoginRequest
    {
        [JsonPropertyName("IdentityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("Password")]
        public string? Password { get; set; }

        [JsonPropertyName("Country")]
        public string? Country { get; set; }

        [JsonPropertyName("Language")]
        public string? Language { get; set; }

    }
}