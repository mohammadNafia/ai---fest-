using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

/// <summary>
/// Entity Framework configuration for PartnerRequest entity
/// </summary>
public class PartnerRequestConfiguration : IEntityTypeConfiguration<PartnerRequest>
{
    public void Configure(EntityTypeBuilder<PartnerRequest> builder)
    {
        // Table name
        builder.ToTable("partner_requests");

        // Primary key
        builder.HasKey(p => p.Id);

        // Properties
        builder.Property(p => p.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(p => p.UserId)
            .HasColumnName("user_id");

        builder.Property(p => p.Organization)
            .HasColumnName("organization")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(p => p.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(p => p.Category)
            .HasColumnName("category")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.Requirements)
            .HasColumnName("requirements")
            .HasColumnType("text");

        builder.Property(p => p.Status)
            .HasColumnName("status")
            .HasConversion<int>()
            .IsRequired()
            .HasDefaultValue(SubmissionStatus.Pending);

        builder.Property(p => p.ReviewedBy)
            .HasColumnName("reviewed_by");

        builder.Property(p => p.ReviewedAt)
            .HasColumnName("reviewed_at")
            .HasColumnType("timestamp with time zone");

        builder.Property(p => p.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.Property(p => p.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(p => p.UpdatedBy)
            .HasColumnName("updated_by");

        // Indexes
        builder.HasIndex(p => p.Email)
            .HasDatabaseName("idx_partner_email");

        builder.HasIndex(p => p.Category)
            .HasDatabaseName("idx_partner_category");

        builder.HasIndex(p => p.Status)
            .HasDatabaseName("idx_partner_status");

        builder.HasIndex(p => p.CreatedAt)
            .HasDatabaseName("idx_partner_created");

        // Check constraint for status
        builder.ToTable(t => t.HasCheckConstraint("CK_PartnerRequest_Status",
            "status IN (0, 1, 2)"));

        // Foreign keys
        builder.HasOne(p => p.User)
            .WithMany(u => u.PartnerRequests)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(p => p.Reviewer)
            .WithMany()
            .HasForeignKey(p => p.ReviewedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
