using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

/// <summary>
/// Entity Framework configuration for AttendeeRegistration entity
/// </summary>
public class AttendeeRegistrationConfiguration : IEntityTypeConfiguration<AttendeeRegistration>
{
    public void Configure(EntityTypeBuilder<AttendeeRegistration> builder)
    {
        // Table name
        builder.ToTable("attendee_registrations");

        // Primary key
        builder.HasKey(a => a.Id);

        // Properties
        builder.Property(a => a.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(a => a.UserId)
            .HasColumnName("user_id");

        builder.Property(a => a.Name)
            .HasColumnName("name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(a => a.Age)
            .HasColumnName("age")
            .IsRequired();

        builder.Property(a => a.Occupation)
            .HasColumnName("occupation")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(a => a.Organization)
            .HasColumnName("organization")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(a => a.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(a => a.Phone)
            .HasColumnName("phone")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(a => a.Motivation)
            .HasColumnName("motivation")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(a => a.Status)
            .HasColumnName("status")
            .HasConversion<int>()
            .IsRequired()
            .HasDefaultValue(SubmissionStatus.Pending);

        builder.Property(a => a.Newsletter)
            .HasColumnName("newsletter")
            .HasDefaultValue(false);

        builder.Property(a => a.ReviewedBy)
            .HasColumnName("reviewed_by");

        builder.Property(a => a.ReviewedAt)
            .HasColumnName("reviewed_at")
            .HasColumnType("timestamp with time zone");

        builder.Property(a => a.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.Property(a => a.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.Property(a => a.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(a => a.UpdatedBy)
            .HasColumnName("updated_by");

        // Indexes
        builder.HasIndex(a => a.Email)
            .HasDatabaseName("idx_attendee_email");

        builder.HasIndex(a => a.Status)
            .HasDatabaseName("idx_attendee_status");

        builder.HasIndex(a => a.CreatedAt)
            .HasDatabaseName("idx_attendee_created");

        // Check constraint for status
        builder.ToTable(t => t.HasCheckConstraint("CK_AttendeeRegistration_Status",
            "status IN (0, 1, 2)"));

        // Foreign keys
        // Note: AttendeeRegistration is deprecated - Users with role=User are attendees
        // This configuration is kept for reference but not actively used
        builder.HasOne(a => a.User)
            .WithMany() // AttendeeRegistrations navigation property removed from User
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.Reviewer)
            .WithMany()
            .HasForeignKey(a => a.ReviewedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
