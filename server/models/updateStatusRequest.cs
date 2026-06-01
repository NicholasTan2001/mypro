using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateStatusRequest
    {
        [JsonPropertyName("IdentityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("Status")]
        public string? Status { get; set; }
    }
}