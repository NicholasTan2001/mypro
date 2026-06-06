using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Experience
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("Position")]
        public string? Position { get; set; }

        [Required]
        [JsonPropertyName("Company")]
        public string? Company { get; set; }

        [Required]
        [JsonPropertyName("Responsible")]
        public string? Responsible { get; set; }

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