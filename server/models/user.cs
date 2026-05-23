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
        public int Age { get; set; }

        [JsonPropertyName("Password")]
        public string? Password { get; set; }

        [JsonPropertyName("Country")]
        public string? Country { get; set; }

    }
}