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
            Skill = "",
            Language = "",
            Hobby = ""
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
                user.Status,
                user.BirthDate
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
                user.Status,
                user.BirthDate
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
        if (request.BirthDate != null)
        {
            user.BirthDate = request.BirthDate;
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
        .Include(u => u.Organization)
        .Include(u => u.Student)
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
            user.BirthDate,
            intro = user.Additional!.Intro ?? "",
            conclusion = user.Additional!.Conclusion ?? "",
            hobby = user.Additional!.Hobby ?? "",
            skill = user.Additional!.Skill ?? "",
            language = user.Additional!.Language ?? "",
            position = user.Organization?.Position ?? "",
            course = user.Student?.Course ?? "",
            location = user.Student?.Location ?? "",
            studentStartDate = user.Student?.StartDate ?? null,
            studentEndDate = user.Student?.EndDate ?? null,
            role = user.Organization?.Role ?? "",
            company = user.Organization?.Company ?? "",
            responsible = user.Organization?.Responsible ?? "",
            empStartDate = user.Organization?.StartDate ?? null,
            empEndDate = user.Organization?.EndDate ?? null
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
                conclusion = "",
                hobby = "",
                skill = "",
                language = "",
            });
        }

        return Ok(new
        {
            intro = additional.Intro ?? "",
            conclusion = additional.Conclusion ?? "",
            hobby = additional.Hobby ?? "",
            skill = additional.Skill ?? "",
            language = additional.Language ?? ""

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

    [HttpGet("position/{id}")]
    [Authorize]
    public async Task<ActionResult> GetPosition(int id)
    {
        var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.UserId == id);
        if (organization == null)
        {
            var student = await _context.Students
            .FirstOrDefaultAsync(o => o.UserId == id);
            return Ok(new
            {
                position = "Student",
                course = student?.Course ?? "",
                location = student?.Location ?? "",
                startDate = student?.StartDate ?? null,
                endDate = student?.EndDate ?? null
            });
        }
        return Ok(new
        {
            position = organization.Position ?? "",
            role = organization.Role ?? "",
            company = organization.Company ?? "",
            responsible = organization.Responsible ?? "",
            startDate = organization.StartDate ?? null,
            endDate = organization.EndDate ?? null
        });
    }

    [HttpPut("update-student")]
    [Authorize]
    public async Task<ActionResult> UpdateStudent([FromBody] UpdateStudentRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }
        var existingStudent = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        if (existingStudent == null)
        {
            var newStudent = new Student { UserId = user.Id };
            newStudent.Course = request.Course;
            newStudent.Location = request.Location;
            newStudent.StartDate = request.StartDate;
            newStudent.EndDate = request.EndDate;
            _context.Students.Add(newStudent);
        }
        else
        {
            existingStudent.UserId = user.Id;
            existingStudent.Course = request.Course;
            existingStudent.Location = request.Location;
            existingStudent.StartDate = request.StartDate;
            existingStudent.EndDate = request.EndDate;
            _context.Students.Update(existingStudent);
        }
        var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.UserId == user.Id);
        if (organization != null)
        {
            _context.Organizations.Remove(organization);
        }

        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Student status set successfully.",
            position = "Student"
        });
    }

    [HttpPut("update-organization")]
    [Authorize]
    public async Task<ActionResult> UpdateOrganization([FromBody] UpdateOrganizationRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }
        var existingOrganization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.UserId == user.Id);
        if (existingOrganization == null)
        {
            var newOrganization = new Organization
            {
                UserId = user.Id,
                Position = request.Position,
                Role = request.Role,
                Company = request.Company,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Responsible = request.Responsible
            };
            _context.Organizations.Add(newOrganization);
        }
        else
        {
            existingOrganization.Position = request.Position;
            existingOrganization.Role = request.Role;
            existingOrganization.Company = request.Company;
            existingOrganization.StartDate = request.StartDate;
            existingOrganization.EndDate = request.EndDate;
            existingOrganization.Responsible = request.Responsible;
            _context.Organizations.Update(existingOrganization);
        }
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        if (student != null)
        {
            _context.Students.Remove(student);
        }

        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Organization position updated successfully.",
            position = request.Position
        });
    }

    [HttpGet("experience/{id}")]
    public async Task<ActionResult> GetExperiences(int id)
    {
        var experiences = await _context.Experiences
            .Where(e => e.UserId == id)
            .OrderByDescending(e => e.StartDate)
            .Select(e => new
            {
                e.Id,
                e.Position,
                e.Company,
                e.Responsible,
                e.StartDate,
                e.EndDate
            })
            .ToListAsync();

        return Ok(new { experiences });
    }

    [HttpPost("add-experience")]
    [Authorize]
    public async Task<ActionResult> AddExperience([FromBody] AddExperienceRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var experience = new Experience
        {
            UserId = user.Id,
            Position = request.Position,
            Company = request.Company,
            Responsible = request.Responsible,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };
        _context.Experiences.Add(experience);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Experience added successfully.",
        });
    }

    [HttpDelete("delete-experience/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteExperience(int id)
    {
        var experience = await _context.Experiences
            .FirstOrDefaultAsync(e => e.Id == id);
        if (experience == null)
        {
            return NotFound(new { message = "Experience not found." });
        }
        _context.Experiences.Remove(experience);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Experience deleted successfully." });
    }

    [HttpPost("add-achievement")]
    [Authorize]
    public async Task<ActionResult> AddAchievement([FromBody] AddAchievementRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);

        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var achievement = new Achievement
        {
            UserId = user.Id,
            Type = request.Type,
            Title = request.Title,
            Link = request.Link,
            Date = request.Date
        };

        _context.Achievements.Add(achievement);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Achievement added successfully.",
        });
    }

    [HttpGet("achievement/{id}")]
    public async Task<ActionResult> GetAchievements(int id)
    {
        var achievements = await _context.Achievements
            .Where(a => a.UserId == id)
            .OrderByDescending(a => a.Date)
            .Select(a => new
            {
                a.Id,
                a.Type,
                a.Title,
                a.Link,
                a.Date
            })
            .ToListAsync();

        return Ok(new { achievements });
    }

    [HttpDelete("delete-achievement/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteAchievement(int id)
    {
        var achievement = await _context.Achievements
            .FirstOrDefaultAsync(a => a.Id == id);

        if (achievement == null)
        {
            return NotFound(new { message = "Achievement not found." });
        }

        _context.Achievements.Remove(achievement);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Achievement deleted successfully." });
    }

    [HttpPost("add-project")]
    [Authorize]
    public async Task<ActionResult> AddProject([FromBody] AddProjectRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }
        var project = new Project
        {
            UserId = user.Id,
            Title = request.Title,
            Type = request.Type,
            Feature = request.Feature,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Project added successfully.",
        });
    }

    [HttpGet("project/{id}")]
    public async Task<ActionResult> GetProjects(int id)
    {
        var projects = await _context.Projects
            .Where(p => p.UserId == id)
            .OrderByDescending(p => p.StartDate)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Type,
                p.Feature,
                p.StartDate,
                p.EndDate
            })
            .ToListAsync();

        return Ok(new { projects });
    }

    [HttpDelete("delete-project/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id);
        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Project deleted successfully." });
    }

    [HttpPut("update-additional")]
    [Authorize]
    public async Task<ActionResult> UpdateAdditional([FromBody] UpdateAdditionalRequest request)
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

        if (!string.IsNullOrEmpty(request.Hobby))
            user.Additional.Hobby = request.Hobby;

        if (!string.IsNullOrEmpty(request.Skill))
            user.Additional.Skill = request.Skill;

        if (!string.IsNullOrEmpty(request.Language))
            user.Additional.Language = request.Language;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            hobby = user.Additional.Hobby,
            skill = user.Additional.Skill,
            language = user.Additional.Language
        });
    }

    [HttpPost("add-permission")]
    [Authorize]
    public async Task<ActionResult> AddRelationship([FromBody] AddPermissionRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.IdentityNumber == request.IdentityNumber);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }
        var existingRelationship = await _context.Relationships
            .FirstOrDefaultAsync(r =>
                r.UserId == user.Id &&
                r.Permission == request.Permission);
        if (existingRelationship != null)
        {
            return BadRequest(new
            {
                message = "Permission already exists for this user."
            });
        }
        var relationship = new Relationship
        {
            UserId = user.Id,
            Permission = request.Permission
        };
        _context.Relationships.Add(relationship);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Permission added successfully."
        });
    }

    [HttpGet("relationship/{id}")]
    [Authorize]
    public async Task<ActionResult> GetRelationships(int id)
    {
        Console.WriteLine(id);

        var relationships = await _context.Relationships
            .Where(r => r.UserId == id)
            .Select(r => new
            {
                r.Id,
                r.Permission
            })
            .ToListAsync();

        return Ok(new { relationships });
    }

}