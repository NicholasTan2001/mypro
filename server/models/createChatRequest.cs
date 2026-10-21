using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class CreateChatRequest
    {

        [JsonPropertyName("Information")]
        public string? Information { get; set; }

        [JsonPropertyName("GuestId")]
        public int? GuestId { get; set; }

    }
}