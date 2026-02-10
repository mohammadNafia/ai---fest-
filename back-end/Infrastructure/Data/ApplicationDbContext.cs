using Domain.Entities;
using Infrastructure.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

/// <summary>
/// Main database context for the application
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    // AttendeeRegistration removed - Users table now serves as attendees (role=User)
    public DbSet<SpeakerApplication> SpeakerApplications { get; set; }
    public DbSet<PartnerRequest> PartnerRequests { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<AuditTrail> AuditTrails { get; set; }
    public DbSet<StaffPermissions> StaffPermissions { get; set; }
    public DbSet<CMSSpeaker> CMSSpeakers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply entity configurations
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        // AttendeeRegistrationConfiguration removed - Users table now serves as attendees
        modelBuilder.ApplyConfiguration(new SpeakerApplicationConfiguration());
        modelBuilder.ApplyConfiguration(new PartnerRequestConfiguration());
        modelBuilder.ApplyConfiguration(new ActivityLogConfiguration());
        modelBuilder.ApplyConfiguration(new AuditTrailConfiguration());
        modelBuilder.ApplyConfiguration(new StaffPermissionsConfiguration());
        modelBuilder.ApplyConfiguration(new CMSSpeakerConfiguration());
    }
}
