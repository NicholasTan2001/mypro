using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Chat
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("Information")]
        public string? Information { get; set; }

        [JsonPropertyName("GuestId")]
        public int? GuestId { get; set; }

        [JsonPropertyName("CreatedAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("BotChat")]
        public bool BotChat { get; set; } = false;
    }
}