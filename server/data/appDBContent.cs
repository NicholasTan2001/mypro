using Microsoft.EntityFrameworkCore;
using MyProfile.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Additional> Additionals { get; set; }
}