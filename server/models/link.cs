using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Link
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("Linkedin")]
        public string? Linkedin { get; set; }

        [Required]
        [JsonPropertyName("Portfolio")]
        public string? Portfolio { get; set; }

        [Required]
        [JsonPropertyName("Additional")]
        public string? Additional { get; set; }

        [Required]
        [ForeignKey("User")]
        [JsonPropertyName("UserId")]
        public int UserId { get; set; }

        public User? User { get; set; }
    }
}