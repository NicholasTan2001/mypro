using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateNotificationRequest
    {
        [JsonPropertyName("IdentityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("Notification")]
        public string? Notification { get; set; }
    }
}