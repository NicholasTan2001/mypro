
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class TranscriptRequest
    {
        [JsonPropertyName("transcript")]
        public string Transcript { get; set; } = string.Empty;

        [JsonPropertyName("language")]
        public string Language { get; set; } = "en";
    }
}
