using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

/// <summary>
/// Entity Framework configuration for StaffPermissions entity
/// </summary>
public class StaffPermissionsConfiguration : IEntityTypeConfiguration<StaffPermissions>
{
    public void Configure(EntityTypeBuilder<StaffPermissions> builder)
    {
        // Table name
        builder.ToTable("staff_permissions");

        // Primary key
        builder.HasKey(s => s.Id);

        // Properties
        builder.Property(s => s.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(s => s.StaffUserId)
            .HasColumnName("staff_user_id")
            .IsRequired();

        builder.Property(s => s.CanViewAttendees)
            .HasColumnName("can_view_attendees")
            .HasDefaultValue(false);

        builder.Property(s => s.CanManageAttendees)
            .HasColumnName("can_manage_attendees")
            .HasDefaultValue(false);

        builder.Property(s => s.CanViewSpeakers)
            .HasColumnName("can_view_speakers")
            .HasDefaultValue(false);

        builder.Property(s => s.CanManageSpeakers)
            .HasColumnName("can_manage_speakers")
            .HasDefaultValue(false);

        builder.Property(s => s.CanViewPartners)
            .HasColumnName("can_view_partners")
            .HasDefaultValue(false);

        builder.Property(s => s.CanManagePartners)
            .HasColumnName("can_manage_partners")
            .HasDefaultValue(false);

        builder.Property(s => s.CanViewUsers)
            .HasColumnName("can_view_users")
            .HasDefaultValue(false);

        builder.Property(s => s.CanDeleteUsers)
            .HasColumnName("can_delete_users")
            .HasDefaultValue(false);

        builder.Property(s => s.CanExportData)
            .HasColumnName("can_export_data")
            .HasDefaultValue(false);

        builder.Property(s => s.CanViewAnalytics)
            .HasColumnName("can_view_analytics")
            .HasDefaultValue(false);

        builder.Property(s => s.CanManageContent)
            .HasColumnName("can_manage_content")
            .HasDefaultValue(false);

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

        // Foreign keys
        builder.HasOne(s => s.StaffUser)
            .WithMany()
            .HasForeignKey(s => s.StaffUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(s => s.StaffUserId)
            .HasDatabaseName("idx_staff_permissions_user_id")
            .IsUnique();
    }
}
