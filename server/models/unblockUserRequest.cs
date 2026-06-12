using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UnblockUserRequest
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("admin")]
        public string? Admin { get; set; }

    }
}