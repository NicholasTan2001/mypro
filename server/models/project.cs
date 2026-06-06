using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Project
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("Title")]
        public string? Title { get; set; }

        [Required]
        [JsonPropertyName("Type")]
        public string? Type { get; set; }

        [Required]
        [JsonPropertyName("Feature")]
        public string? Feature { get; set; }

        [Required]
        [JsonPropertyName("StartDate")]
        public DateTime? StartDate { get; set; }

        [Required]
        [JsonPropertyName("EndDate")]
        public DateTime? EndDate { get; set; }

        [Required]
        [ForeignKey("User")]
        [JsonPropertyName("UserId")]
        public int UserId { get; set; }

        public User? User { get; set; }
    }
}