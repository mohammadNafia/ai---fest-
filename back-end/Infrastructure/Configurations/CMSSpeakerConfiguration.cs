using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

/// <summary>
/// Entity Framework configuration for CMSSpeaker entity
/// </summary>
public class CMSSpeakerConfiguration : IEntityTypeConfiguration<CMSSpeaker>
{
    public void Configure(EntityTypeBuilder<CMSSpeaker> builder)
    {
        // Table name
        builder.ToTable("cms_speakers");

        // Primary key
        builder.HasKey(s => s.Id);

        // Properties
        builder.Property(s => s.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(s => s.Name)
            .HasColumnName("name")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(s => s.NameAr)
            .HasColumnName("name_ar")
            .HasMaxLength(255);

        builder.Property(s => s.Role)
            .HasColumnName("role")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(s => s.RoleAr)
            .HasColumnName("role_ar")
            .HasMaxLength(255);

        builder.Property(s => s.Company)
            .HasColumnName("company")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(s => s.CompanyAr)
            .HasColumnName("company_ar")
            .HasMaxLength(255);

        builder.Property(s => s.Image)
            .HasColumnName("image")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(s => s.Topic)
            .HasColumnName("topic")
            .HasMaxLength(500);

        builder.Property(s => s.TopicAr)
            .HasColumnName("topic_ar")
            .HasMaxLength(500);

        builder.Property(s => s.Bio)
            .HasColumnName("bio")
            .HasColumnType("text");

        builder.Property(s => s.BioAr)
            .HasColumnName("bio_ar")
            .HasColumnType("text");

        builder.Property(s => s.LinkedIn)
            .HasColumnName("linkedin")
            .HasMaxLength(500);

        builder.Property(s => s.Twitter)
            .HasColumnName("twitter")
            .HasMaxLength(500);

        builder.Property(s => s.Website)
            .HasColumnName("website")
            .HasMaxLength(500);

        builder.Property(s => s.IsFeatured)
            .HasColumnName("is_featured")
            .HasDefaultValue(true);

        builder.Property(s => s.OrderIndex)
            .HasColumnName("order_index")
            .HasDefaultValue(0);

        builder.Property(s => s.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        // IAuditable properties
        builder.Property(s => s.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(s => s.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(s => s.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(s => s.UpdatedBy)
            .HasColumnName("updated_by");

        // Indexes
        builder.HasIndex(s => s.IsActive)
            .HasDatabaseName("idx_cms_speaker_active");

        builder.HasIndex(s => s.IsFeatured)
            .HasDatabaseName("idx_cms_speaker_featured");

        builder.HasIndex(s => s.OrderIndex)
            .HasDatabaseName("idx_cms_speaker_order");
    }
}
