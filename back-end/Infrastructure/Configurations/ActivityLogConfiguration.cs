using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

/// <summary>
/// Entity Framework configuration for ActivityLog entity
/// </summary>
public class ActivityLogConfiguration : IEntityTypeConfiguration<ActivityLog>
{
    public void Configure(EntityTypeBuilder<ActivityLog> builder)
    {
        // Table name
        builder.ToTable("activity_logs");

        // Primary key
        builder.HasKey(a => a.Id);

        // Properties
        builder.Property(a => a.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(a => a.UserId)
            .HasColumnName("user_id");

        builder.Property(a => a.EntityType)
            .HasColumnName("entity_type")
            .HasConversion<int>()
            .IsRequired();

        builder.Property(a => a.EntityId)
            .HasColumnName("entity_id")
            .IsRequired();

        builder.Property(a => a.Action)
            .HasColumnName("action")
            .HasConversion<int>()
            .IsRequired();

        builder.Property(a => a.Details)
            .HasColumnName("details")
            .HasColumnType("jsonb");

        builder.Property(a => a.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(a => a.UserAgent)
            .HasColumnName("user_agent")
            .HasColumnType("text");

        builder.Property(a => a.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Indexes
        builder.HasIndex(a => new { a.EntityType, a.EntityId })
            .HasDatabaseName("idx_activity_entity");

        builder.HasIndex(a => a.UserId)
            .HasDatabaseName("idx_activity_user");

        builder.HasIndex(a => a.CreatedAt)
            .HasDatabaseName("idx_activity_created");

        builder.HasIndex(a => a.Action)
            .HasDatabaseName("idx_activity_action");

        // Foreign keys
        builder.HasOne(a => a.User)
            .WithMany(u => u.ActivityLogs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
