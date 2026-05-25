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
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(user);
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

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.Name,
                user.IdentityNumber,
                user.Country
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

}