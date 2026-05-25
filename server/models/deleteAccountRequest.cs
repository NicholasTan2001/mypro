using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class DeleteAccountRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("password")]
        public string? Password { get; set; }
    }
}