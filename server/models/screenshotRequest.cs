using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class ScreenshotRequest
    {
        [JsonPropertyName("Language")]
        public string Language { get; set; } = "en";

        [JsonPropertyName("imageBase64")]
        public string ImageBase64 { get; set; } = string.Empty;

        [JsonPropertyName("GuestId")]
        public int? GuestId { get; set; }
    }
}