using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class AddAdminRequest
    {
        [JsonPropertyName("adminId")]
        public int? AdminId { get; set; }

        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("admin")]
        public string? Admin { get; set; }

    }
}