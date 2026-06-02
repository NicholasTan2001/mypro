using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Student
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("Course")]
        public string? Course { get; set; }

        [Required]
        [JsonPropertyName("Location")]
        public string? Location { get; set; }

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