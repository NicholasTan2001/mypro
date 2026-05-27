using System.Text.Json.Serialization;

namespace MyProfile.Models
{
    public class ForgotPasswordRequest
    {
        [JsonPropertyName("identityNumber")]
        public string? IdentityNumber
        {
            get; set;
        }
    }
}