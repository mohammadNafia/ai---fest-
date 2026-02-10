# Database Migration Guide

## Prerequisites

1. **PostgreSQL installed** (local or remote)
2. **Database created**: `baghdad_ai_summit`
3. **Connection string configured** in `API/appsettings.json`

## Step 1: Configure Connection String

Edit `API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=baghdad_ai_summit;Username=postgres;Password=your_password"
  }
}
```

## Step 2: Install EF Core Tools (if not already installed)

```bash
dotnet tool install --global dotnet-ef
```

Or update if already installed:
```bash
dotnet tool update --global dotnet-ef
```

## Step 3: Create Initial Migration

Navigate to the back-end directory:

```bash
cd Baghdad-ai-summit/back-end
```

Create the initial migration:

```bash
dotnet ef migrations add InitialCreate --project Infrastructure --startup-project API
```

This will create a `Migrations` folder in the Infrastructure project with the migration files.

## Step 4: Review Migration

Review the generated migration file in:
```
Infrastructure/Migrations/YYYYMMDDHHMMSS_InitialCreate.cs
```

## Step 5: Apply Migration to Database

Apply the migration to create the database schema:

```bash
dotnet ef database update --project Infrastructure --startup-project API
```

## Step 6: Verify Database

Connect to PostgreSQL and verify tables were created:

```sql
\c baghdad_ai_summit
\dt
```

You should see:
- `users`
- `attendee_registrations`
- `speaker_applications`
- `partner_requests`
- `activity_logs`
- `audit_trails`
- `__EFMigrationsHistory`

## Creating Additional Migrations

When you make changes to entities or configurations:

```bash
dotnet ef migrations add MigrationName --project Infrastructure --startup-project API
dotnet ef database update --project Infrastructure --startup-project API
```

## Rolling Back Migrations

To rollback the last migration:

```bash
dotnet ef database update PreviousMigrationName --project Infrastructure --startup-project API
```

To remove the last migration (without applying):

```bash
dotnet ef migrations remove --project Infrastructure --startup-project API
```

## Troubleshooting

### Error: "No connection string named 'DefaultConnection' was found"
- Ensure `appsettings.json` has the `ConnectionStrings` section
- Check that the connection string key matches exactly

### Error: "Database does not exist"
- Create the database first: `CREATE DATABASE baghdad_ai_summit;`

### Error: "Password authentication failed"
- Verify PostgreSQL credentials in connection string
- Ensure PostgreSQL is running

### Error: "dotnet-ef command not found"
- Install EF Core tools: `dotnet tool install --global dotnet-ef`
- Restart terminal after installation

## Production Deployment

For production, use environment variables:

```bash
export ConnectionStrings__DefaultConnection="Host=prod-server;Port=5432;Database=baghdad_ai_summit;Username=prod_user;Password=secure_password"
```

Then run migrations:
```bash
dotnet ef database update --project Infrastructure --startup-project API
```
