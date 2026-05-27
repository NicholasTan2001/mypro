using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class ChangePasswordRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("password")]
        public string? Password { get; set; }

        [JsonPropertyName("newPassword")]
        public string? NewPassword { get; set; }
    }
}