using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class AddAdminRequest
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("admin")]
        public string? Admin { get; set; }

    }
}