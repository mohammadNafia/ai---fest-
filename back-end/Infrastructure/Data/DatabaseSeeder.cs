using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Data;

/// <summary>
/// Database seeder for initial data
/// </summary>
public static class DatabaseSeeder
{
    /// <summary>
    /// Seed initial admin user
    /// </summary>
    public static async Task SeedAdminUserAsync(ApplicationDbContext context, ILogger logger)
    {
        try
        {
            // Check if admin user already exists
            var adminExists = await context.Users
                .AnyAsync(u => u.Email == "admin@baghdad-ai-summit.com" && u.Role == UserRole.Admin);

            if (adminExists)
            {
                logger.LogInformation("Admin user already exists, skipping seed");
                return;
            }

            // Create admin user
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@baghdad-ai-summit.com",
                Name = "Administrator",
                PasswordHash = HashPassword("admin123"), // Default password: admin123
                Role = UserRole.Admin,
                IsActive = true,
                EmailVerified = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            logger.LogInformation("Admin user seeded successfully: {Email}", adminUser.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding admin user");
        }
    }

    /// <summary>
    /// Hash password using SHA256 (simplified - in production, use BCrypt or Argon2)
    /// </summary>
    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
