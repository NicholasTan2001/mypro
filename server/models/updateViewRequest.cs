using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateViewRequest
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

    }
}