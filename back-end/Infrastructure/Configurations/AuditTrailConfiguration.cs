using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

/// <summary>
/// Entity Framework configuration for AuditTrail entity
/// </summary>
public class AuditTrailConfiguration : IEntityTypeConfiguration<AuditTrail>
{
    public void Configure(EntityTypeBuilder<AuditTrail> builder)
    {
        // Table name
        builder.ToTable("audit_trails");

        // Primary key
        builder.HasKey(a => a.Id);

        // Properties
        builder.Property(a => a.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(a => a.TableName)
            .HasColumnName("table_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(a => a.RecordId)
            .HasColumnName("record_id")
            .IsRequired();

        builder.Property(a => a.Action)
            .HasColumnName("action")
            .HasConversion<int>()
            .IsRequired();

        builder.Property(a => a.OldValues)
            .HasColumnName("old_values")
            .HasColumnType("jsonb");

        builder.Property(a => a.NewValues)
            .HasColumnName("new_values")
            .HasColumnType("jsonb");

        builder.Property(a => a.ChangedBy)
            .HasColumnName("changed_by");

        builder.Property(a => a.ChangedAt)
            .HasColumnName("changed_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Indexes
        builder.HasIndex(a => new { a.TableName, a.RecordId })
            .HasDatabaseName("idx_audit_table_record");

        builder.HasIndex(a => a.ChangedAt)
            .HasDatabaseName("idx_audit_changed_at");

        // Foreign keys
        builder.HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.ChangedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
