using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Achievement
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("Type")]
        public string? Type { get; set; }

        [Required]
        [JsonPropertyName("Title")]
        public string? Title { get; set; }

        [Required]
        [JsonPropertyName("Link")]
        public string? Link { get; set; }

        [Required]
        [JsonPropertyName("Date")]
        public DateTime? Date { get; set; }

        [Required]
        [ForeignKey("User")]
        [JsonPropertyName("UserId")]
        public int UserId { get; set; }

        public User? User { get; set; }
    }
}