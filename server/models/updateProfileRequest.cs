using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateProfileRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("age")]
        public int? Age { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("country")]
        public string? Country { get; set; }

        [JsonPropertyName("phoneNumber")]
        public string? PhoneNumber { get; set; }
    }
}