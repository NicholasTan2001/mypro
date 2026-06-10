using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateVerifyRequest
    {
        [JsonPropertyName("IdentityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("Verify")]
        public string? Verify { get; set; }
    }
}