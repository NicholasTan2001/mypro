using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class DeleteAdminRequest
    {
        [JsonPropertyName("adminId")]
        public int? AdminId { get; set; }

        [JsonPropertyName("id")]
        public int? Id { get; set; }
    }
}