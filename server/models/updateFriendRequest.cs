using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class UpdateFriendRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber { get; set; }

        [JsonPropertyName("requestId")]
        public int? RequestId { get; set; }
    }
}