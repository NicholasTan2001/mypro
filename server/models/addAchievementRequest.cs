using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class AddAchievementRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("link")]
        public string? Link { get; set; }

        [JsonPropertyName("date")]
        public DateTime? Date { get; set; }

    }
}