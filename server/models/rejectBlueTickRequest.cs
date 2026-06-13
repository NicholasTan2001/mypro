using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class RejectBlueTickRequest
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

    }
}