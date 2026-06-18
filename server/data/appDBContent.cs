using Microsoft.EntityFrameworkCore;
using MyProfile.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Additional> Additionals { get; set; }

    public DbSet<Student> Students { get; set; }

    public DbSet<Organization> Organizations { get; set; }

    public DbSet<Experience> Experiences { get; set; }

    public DbSet<Achievement> Achievements { get; set; }

    public DbSet<Project> Projects { get; set; }

    public DbSet<Relationship> Relationships { get; set; }

    public DbSet<Verification> Verifications { get; set; }

    public DbSet<Link> Links { get; set; }

    public DbSet<Activity> Activities { get; set; }



}