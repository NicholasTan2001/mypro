using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyProfile.Models;
using BCrypt.Net;

[Route("api/users")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> AddUser([FromBody] User user)
    {

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
            return Unauthorized(new
            {
                message = "Invalid credentials."
            });
        }

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);

        if (!isPasswordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid credentials."
            });
        }

        return Ok(new
        {
            user.Id,
            user.Name,
            user.IdentityNumber,
            user.Country
        });
    }
}

