using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class AcceptBlueTickRequest
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

    }
}