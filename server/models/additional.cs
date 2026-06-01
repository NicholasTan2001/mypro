using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Additional
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        [JsonPropertyName("UserId")]
        public int UserId { get; set; }

        [JsonPropertyName("Intro")]
        public string? Intro { get; set; }

        [JsonPropertyName("Conclusion")]
        public string? Conclusion { get; set; }

        public User? User { get; set; }
    }
}