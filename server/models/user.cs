using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class User
    {
        public int Id { get; set; }

        [JsonPropertyName("IdentityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("Name")]
        public string? Name { get; set; }

        [JsonPropertyName("Age")]
        public int? Age { get; set; }

        [JsonPropertyName("BirthDate")]
        public DateTime? BirthDate { get; set; }

        [JsonPropertyName("Password")]
        public string? Password { get; set; }

        [JsonPropertyName("Country")]
        public string? Country { get; set; }

        [JsonPropertyName("Email")]
        public string? Email { get; set; }

        [JsonPropertyName("PhoneNumber")]
        public string? PhoneNumber { get; set; }

        [JsonPropertyName("Address")]
        public string? Address { get; set; }

        [JsonPropertyName("Sex")]
        public string? Sex { get; set; }

        [JsonPropertyName("Status")]
        public string? Status { get; set; }

        [JsonPropertyName("Verify")]
        public string? Verify { get; set; }

        [JsonPropertyName("Block")]
        public string? Block { get; set; }

        [JsonPropertyName("Admin")]
        public string? Admin { get; set; }

        [JsonPropertyName("BlueTick")]
        public string? BlueTick { get; set; }

        public Additional? Additional { get; set; }

        public Student? Student { get; set; }

        public Organization? Organization { get; set; }

        public Experience? Experience { get; set; }

        public Achievement? Achievement { get; set; }

        public Relationship? Relationship { get; set; }

        public Verification? Verification { get; set; }

        public Link? Link { get; set; }


    }
}