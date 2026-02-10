using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

/// <summary>
/// Entity Framework configuration for SpeakerApplication entity
/// </summary>
public class SpeakerApplicationConfiguration : IEntityTypeConfiguration<SpeakerApplication>
{
    public void Configure(EntityTypeBuilder<SpeakerApplication> builder)
    {
        // Table name
        builder.ToTable("speaker_applications");

        // Primary key
        builder.HasKey(s => s.Id);

        // Properties
        builder.Property(s => s.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(s => s.UserId)
            .HasColumnName("user_id");

        builder.Property(s => s.Name)
            .HasColumnName("name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(s => s.Occupation)
            .HasColumnName("occupation")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(s => s.Institution)
            .HasColumnName("institution")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(s => s.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(s => s.Phone)
            .HasColumnName("phone")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(s => s.Skills)
            .HasColumnName("skills")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(s => s.Experience)
            .HasColumnName("experience")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(s => s.Topics)
            .HasColumnName("topics")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(s => s.Achievements)
            .HasColumnName("achievements")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(s => s.Status)
            .HasColumnName("status")
            .HasConversion<int>()
            .IsRequired()
            .HasDefaultValue(SubmissionStatus.Pending);

        builder.Property(s => s.ReviewedBy)
            .HasColumnName("reviewed_by");

        builder.Property(s => s.ReviewedAt)
            .HasColumnName("reviewed_at")
            .HasColumnType("timestamp with time zone");

        builder.Property(s => s.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.Property(s => s.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.Property(s => s.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(s => s.UpdatedBy)
            .HasColumnName("updated_by");

        // Indexes
        builder.HasIndex(s => s.Email)
            .HasDatabaseName("idx_speaker_email");

        builder.HasIndex(s => s.Status)
            .HasDatabaseName("idx_speaker_status");

        builder.HasIndex(s => s.CreatedAt)
            .HasDatabaseName("idx_speaker_created");

        // Check constraint for status
        builder.ToTable(t => t.HasCheckConstraint("CK_SpeakerApplication_Status",
            "status IN (0, 1, 2)"));

        // Foreign keys
        builder.HasOne(s => s.User)
            .WithMany(u => u.SpeakerApplications)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(s => s.Reviewer)
            .WithMany()
            .HasForeignKey(s => s.ReviewedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
