using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class Relationship
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("Friend")]
        public int? Friend { get; set; }

        [JsonPropertyName("Permission")]
        public int? Permission { get; set; }

        [Required]
        [ForeignKey("User")]
        [JsonPropertyName("UserId")]
        public int? UserId { get; set; }

        public User? User { get; set; }
    }
}