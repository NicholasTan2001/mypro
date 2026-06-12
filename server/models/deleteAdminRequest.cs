using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class DeleteAdminRequest
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

    }
}