using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class AddPermissionRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("permission")]
        public int? Permission { get; set; }
    }
}