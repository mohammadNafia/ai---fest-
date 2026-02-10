using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCMSSpeakersAndStaffPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "attendee_registrations");

            migrationBuilder.DropCheckConstraint(
                name: "CK_User_Role",
                table: "users");

            migrationBuilder.CreateTable(
                name: "cms_speakers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    role = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    role_ar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    company = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    company_ar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    image = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    topic = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    topic_ar = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    bio = table.Column<string>(type: "text", nullable: true),
                    bio_ar = table.Column<string>(type: "text", nullable: true),
                    linkedin = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    twitter = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    is_featured = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    order_index = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cms_speakers", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "staff_permissions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    staff_user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    can_view_attendees = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_manage_attendees = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_view_speakers = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_manage_speakers = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_view_partners = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_manage_partners = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_view_users = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_delete_users = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_export_data = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_view_analytics = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_manage_content = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_staff_permissions", x => x.id);
                    table.ForeignKey(
                        name: "FK_staff_permissions_users_staff_user_id",
                        column: x => x.staff_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_User_Role",
                table: "users",
                sql: "role IN (0, 1, 2, 3, 4, 5, 6)");

            migrationBuilder.CreateIndex(
                name: "idx_cms_speaker_active",
                table: "cms_speakers",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "idx_cms_speaker_featured",
                table: "cms_speakers",
                column: "is_featured");

            migrationBuilder.CreateIndex(
                name: "idx_cms_speaker_order",
                table: "cms_speakers",
                column: "order_index");

            migrationBuilder.CreateIndex(
                name: "idx_staff_permissions_user_id",
                table: "staff_permissions",
                column: "staff_user_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cms_speakers");

            migrationBuilder.DropTable(
                name: "staff_permissions");

            migrationBuilder.DropCheckConstraint(
                name: "CK_User_Role",
                table: "users");

            migrationBuilder.CreateTable(
                name: "attendee_registrations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    age = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    motivation = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    newsletter = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    occupation = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    organization = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_attendee_registrations", x => x.id);
                    table.CheckConstraint("CK_AttendeeRegistration_Status", "status IN (0, 1, 2)");
                    table.ForeignKey(
                        name: "FK_attendee_registrations_users_reviewed_by",
                        column: x => x.reviewed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_attendee_registrations_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_User_Role",
                table: "users",
                sql: "role IN (0, 1, 2, 3, 4)");

            migrationBuilder.CreateIndex(
                name: "idx_attendee_created",
                table: "attendee_registrations",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_attendee_email",
                table: "attendee_registrations",
                column: "email");

            migrationBuilder.CreateIndex(
                name: "idx_attendee_status",
                table: "attendee_registrations",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_attendee_registrations_reviewed_by",
                table: "attendee_registrations",
                column: "reviewed_by");

            migrationBuilder.CreateIndex(
                name: "IX_attendee_registrations_user_id",
                table: "attendee_registrations",
                column: "user_id");
        }
    }
}
