# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites Check
- [ ] .NET 8.0 SDK installed (`dotnet --version`)
- [ ] PostgreSQL installed and running
- [ ] Database `baghdad_ai_summit` created

### Step 1: Configure Database Connection

Edit `API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=baghdad_ai_summit;Username=postgres;Password=your_password"
  }
}
```

### Step 2: Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

### Step 3: Create Database Schema

```bash
cd Baghdad-ai-summit/back-end
dotnet ef migrations add InitialCreate --project Infrastructure --startup-project API
dotnet ef database update --project Infrastructure --startup-project API
```

### Step 4: Run the API

```bash
cd API
dotnet run
```

### Step 5: Test the API

1. Open browser: `https://localhost:5001/swagger`
2. Try the `POST /api/attendees` endpoint
3. Try the `GET /api/attendees` endpoint

## ✅ You're Done!

The API is now running and ready to accept requests.

## 📝 Common Commands

### Build the solution
```bash
dotnet build
```

### Run tests (when added)
```bash
dotnet test
```

### Clean build artifacts
```bash
dotnet clean
```

### Restore packages
```bash
dotnet restore
```

## 🔍 Verify Installation

### Check .NET Version
```bash
dotnet --version
# Should show: 8.0.x or higher
```

### Check PostgreSQL Connection
```bash
psql -U postgres -d baghdad_ai_summit -c "\dt"
# Should list all tables
```

### Check API is Running
```bash
curl https://localhost:5001/swagger/v1/swagger.json
# Should return Swagger JSON
```

## 🐛 Troubleshooting

### Port Already in Use
Change port in `API/Properties/launchSettings.json`:
```json
"applicationUrl": "https://localhost:5002"
```

### Database Connection Failed
- Verify PostgreSQL is running
- Check connection string credentials
- Ensure database exists: `CREATE DATABASE baghdad_ai_summit;`

### Migration Errors
- Ensure database is empty or drop existing tables
- Check connection string is correct
- Verify EF Core tools are installed

## 📚 Next Steps

- Read `README.md` for full documentation
- Check `MIGRATION_GUIDE.md` for database setup
- Review `ASP_NET_IMPLEMENTATION_GUIDE.md` for architecture details
