using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdatePendingRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

    }
}