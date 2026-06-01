using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MyProfile.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

[Route("api/users")]
[ApiController]
public class UsersController : ControllerBase
{

    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public UsersController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpGet("malaysia")]
    public async Task<ActionResult> GetUserCount()
    {
        var malaysiaUsers = await _context.Users
       .Where(u => u.Country == "Malaysia")
       .CountAsync();
        return Ok(new { malaysiaUsers });
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> AddUser([FromBody] User user)
    {
        var existingUser = await _context.Users
    .FirstOrDefaultAsync(u => u.IdentityNumber == user.IdentityNumber);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Identity number already registered." });
        }
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        user.Status = "Public";
        user.Additional = new Additional
        {
            Intro = "",
            Conclusion = "",
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Registration successful.",
            user = new
            {
                user.Id,
                user.Name,
                user.IdentityNumber,
                user.Country,
                user.Email,
                user.PhoneNumber,
                user.Address,
                user.Sex,
                user.Status
            }
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] User login)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == login.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);

        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }
        if (login.Country != user.Country)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }
        var token = GenerateJwtToken(user);
        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.Name,
                user.Age,
                user.IdentityNumber,
                user.Country,
                user.Email,
                user.PhoneNumber,
                user.Address,
                user.Sex,
                user.Status
            }
        });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var secret = Encoding.UTF8.GetBytes(jwtSettings["Secret"] ?? "");
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name??""),
            new Claim("IdentityNumber", user.IdentityNumber??"")
        };
        var key = new SymmetricSecurityKey(secret);
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationMinutes"] ?? "")),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("delete-account")]
    [Authorize]
    public async Task<ActionResult> DeleteAccount([FromBody] DeleteAccountRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);

        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Invalid password." });
        }
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Account deleted successfully." });
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid Password." });
        }
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Invalid Password." });
        }
        user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Password changed successfully." });
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);

        if (user == null)
        {
            return BadRequest(new { message = "Identity number not found." });
        }

        string tempPassword = Guid.NewGuid().ToString().Substring(0, 12);

        user.Password = BCrypt.Net.BCrypt.HashPassword(tempPassword);

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        await SendPasswordResetEmail(user, tempPassword);

        return Ok(new { message = "Password reset instructions sent to your email." });
    }

    private async Task SendPasswordResetEmail(User user, string tempPassword)
    {
        try
        {
            using (var client = new System.Net.Mail.SmtpClient("smtp.gmail.com"))
            {
                client.Port = 587;
                client.Credentials = new System.Net.NetworkCredential("nicholastankaejer2001@gmail.com", "tefk njkh merf nwik");
                client.EnableSsl = true;
                var mailMessage = new System.Net.Mail.MailMessage();
                mailMessage.From = new System.Net.Mail.MailAddress(
                    "nicholastankaejer2001@gmail.com",
                    "MyProfile Developer"
                );
                mailMessage.To.Add(user.Email ?? "");
                mailMessage.Subject = "MyProfile - Temporary Password Received";
                mailMessage.Body = $@"
Dear {user.Name},

You requested to reset your MyProfile account password. Here are your account's temporary password.

        Current Password: {tempPassword}

For security purposes, please change your password immediately after logging in with the temporary password.
If you did not request this email, please ignore this email.

Best regards,
MyProfile Team
            ";
                mailMessage.IsBodyHtml = false;
                await client.SendMailAsync(mailMessage);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email sending failed: {ex.Message}");
        }
    }

    [HttpPut("update-profile")]
    [Authorize]
    public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }
        if (!string.IsNullOrEmpty(request.Name))
        {
            user.Name = request.Name;
        }
        if (request.Age.HasValue && request.Age > 0)
        {
            user.Age = request.Age.Value;
        }
        if (!string.IsNullOrEmpty(request.Email))
        {
            user.Email = request.Email;
        }
        if (!string.IsNullOrEmpty(request.PhoneNumber))
        {
            user.PhoneNumber = request.PhoneNumber;

        }
        if (!string.IsNullOrEmpty(request.Country))
        {
            user.Country = request.Country;
        }
        if (!string.IsNullOrEmpty(request.Address))
        {
            user.Address = request.Address;
        }
        if (!string.IsNullOrEmpty(request.Sex))
        {
            user.Sex = request.Sex;
        }
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Profile updated successfully.", user });
    }

    [HttpGet("search")]
    public async Task<ActionResult> SearchUsers([FromQuery] string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new { message = "Search term is required." });
        }

        var users = await _context.Users
        .Include(u => u.Additional)
            .Where(u => u.Name!.ToLower().Contains(name.ToLower()))
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Age,
                u.Email,
                u.Country,
                u.Sex,
                u.Address,
                u.Status,
                intro = u.Additional!.Intro ?? ""
            })
            .ToListAsync();

        return Ok(new { users });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetUserById(int id)
    {
        var user = await _context.Users
        .Include(u => u.Additional)
        .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(new
        {
            user.Id,
            user.Name,
            user.IdentityNumber,
            user.Age,
            user.Email,
            user.PhoneNumber,
            user.Country,
            user.Sex,
            user.Address,
            user.Status,
            intro = user.Additional!.Intro ?? "",
            conclusion = user.Additional!.Conclusion ?? ""

        });
    }

    [HttpGet("additional/{id}")]
    [Authorize]
    public async Task<ActionResult> GetIntro(int id)
    {
        var additional = await _context.Additionals
            .FirstOrDefaultAsync(a => a.UserId == id);

        if (additional == null)
        {
            return Ok(new
            {
                intro = "",
                conclusion = ""
            });
        }

        return Ok(new
        {
            intro = additional.Intro ?? "",
            conclusion = additional.Conclusion ?? ""
        });
    }

    [HttpPut("update-intro")]
    [Authorize]
    public async Task<ActionResult> UpdateIntro([FromBody] UpdateIntroductionRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Additional)
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);

        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        if (user.Additional == null)
        {
            user.Additional = new Additional { UserId = user.Id };
        }

        user.Additional.Intro = request.Intro ?? "";

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Introduction updated successfully." });
    }

    [HttpPut("update-status")]
    [Authorize]
    public async Task<ActionResult> UpdateStatus([FromBody] UpdateStatusRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);

        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        if (request.Status != "Public" && request.Status != "Private")
        {
            return BadRequest(new { message = "Invalid status. Use 'Public' or 'Private'." });
        }

        user.Status = request.Status;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            status = user.Status
        });
    }

    [HttpPut("update-conclusion")]
    [Authorize]
    public async Task<ActionResult> UpdateConclusion([FromBody] UpdateConclusionRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Additional)
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);

        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        if (user.Additional == null)
        {
            user.Additional = new Additional { UserId = user.Id };
        }

        user.Additional.Conclusion = request.Conclusion ?? "";

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Conclusion updated successfully." });
    }

}