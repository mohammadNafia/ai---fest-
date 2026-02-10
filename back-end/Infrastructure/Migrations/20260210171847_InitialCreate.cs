using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    role = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    avatar_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    email_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    last_login_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                    table.CheckConstraint("CK_User_Role", "role IN (0, 1, 2, 3, 4)");
                });

            migrationBuilder.CreateTable(
                name: "activity_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    entity_type = table.Column<int>(type: "integer", nullable: false),
                    entity_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<int>(type: "integer", nullable: false),
                    details = table.Column<string>(type: "jsonb", nullable: true),
                    ip_address = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activity_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_activity_logs_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "attendee_registrations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    age = table.Column<int>(type: "integer", nullable: false),
                    occupation = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    organization = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    motivation = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    newsletter = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
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

            migrationBuilder.CreateTable(
                name: "audit_trails",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    table_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    record_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<int>(type: "integer", nullable: false),
                    old_values = table.Column<string>(type: "jsonb", nullable: true),
                    new_values = table.Column<string>(type: "jsonb", nullable: true),
                    changed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    changed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_trails", x => x.id);
                    table.ForeignKey(
                        name: "FK_audit_trails_users_changed_by",
                        column: x => x.changed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "partner_requests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    organization = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    requirements = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_partner_requests", x => x.id);
                    table.CheckConstraint("CK_PartnerRequest_Status", "status IN (0, 1, 2)");
                    table.ForeignKey(
                        name: "FK_partner_requests_users_reviewed_by",
                        column: x => x.reviewed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_partner_requests_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "speaker_applications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    occupation = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    institution = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    skills = table.Column<string>(type: "text", nullable: false),
                    experience = table.Column<string>(type: "text", nullable: false),
                    topics = table.Column<string>(type: "text", nullable: false),
                    achievements = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_speaker_applications", x => x.id);
                    table.CheckConstraint("CK_SpeakerApplication_Status", "status IN (0, 1, 2)");
                    table.ForeignKey(
                        name: "FK_speaker_applications_users_reviewed_by",
                        column: x => x.reviewed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_speaker_applications_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "idx_activity_action",
                table: "activity_logs",
                column: "action");

            migrationBuilder.CreateIndex(
                name: "idx_activity_created",
                table: "activity_logs",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_activity_entity",
                table: "activity_logs",
                columns: new[] { "entity_type", "entity_id" });

            migrationBuilder.CreateIndex(
                name: "idx_activity_user",
                table: "activity_logs",
                column: "user_id");

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

            migrationBuilder.CreateIndex(
                name: "idx_audit_changed_at",
                table: "audit_trails",
                column: "changed_at");

            migrationBuilder.CreateIndex(
                name: "idx_audit_table_record",
                table: "audit_trails",
                columns: new[] { "table_name", "record_id" });

            migrationBuilder.CreateIndex(
                name: "IX_audit_trails_changed_by",
                table: "audit_trails",
                column: "changed_by");

            migrationBuilder.CreateIndex(
                name: "idx_partner_category",
                table: "partner_requests",
                column: "category");

            migrationBuilder.CreateIndex(
                name: "idx_partner_created",
                table: "partner_requests",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_partner_email",
                table: "partner_requests",
                column: "email");

            migrationBuilder.CreateIndex(
                name: "idx_partner_status",
                table: "partner_requests",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_partner_requests_reviewed_by",
                table: "partner_requests",
                column: "reviewed_by");

            migrationBuilder.CreateIndex(
                name: "IX_partner_requests_user_id",
                table: "partner_requests",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "idx_speaker_created",
                table: "speaker_applications",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_speaker_email",
                table: "speaker_applications",
                column: "email");

            migrationBuilder.CreateIndex(
                name: "idx_speaker_status",
                table: "speaker_applications",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_speaker_applications_reviewed_by",
                table: "speaker_applications",
                column: "reviewed_by");

            migrationBuilder.CreateIndex(
                name: "IX_speaker_applications_user_id",
                table: "speaker_applications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "idx_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_users_role",
                table: "users",
                column: "role");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "activity_logs");

            migrationBuilder.DropTable(
                name: "attendee_registrations");

            migrationBuilder.DropTable(
                name: "audit_trails");

            migrationBuilder.DropTable(
                name: "partner_requests");

            migrationBuilder.DropTable(
                name: "speaker_applications");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
