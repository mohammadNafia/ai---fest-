# Database Setup Guide

## PostgreSQL Connection Configuration

The backend requires PostgreSQL to be running and properly configured. Follow these steps:

### 1. Check PostgreSQL Installation

Ensure PostgreSQL is installed and running on your system.

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*
```

**Linux/Mac:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql
# or
brew services list | grep postgresql
```

### 2. Update Connection String

Edit `API/appsettings.json` and update the `ConnectionStrings:DefaultConnection` with your PostgreSQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=baghdad_ai_summit;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  }
}
```

**Common Connection String Formats:**

- **Default PostgreSQL installation:**
  ```
  Host=localhost;Port=5432;Database=baghdad_ai_summit;Username=postgres;Password=your_password
  ```

- **If using a different port:**
  ```
  Host=localhost;Port=5433;Database=baghdad_ai_summit;Username=postgres;Password=your_password
  ```

- **If using a remote server:**
  ```
  Host=your_server_ip;Port=5432;Database=baghdad_ai_summit;Username=postgres;Password=your_password
  ```

### 3. Create the Database

Connect to PostgreSQL and create the database:

**Using psql command line:**
```bash
psql -U postgres
CREATE DATABASE baghdad_ai_summit;
\q
```

**Using pgAdmin:**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `baghdad_ai_summit`
5. Click "Save"

### 4. Run Migrations

After creating the database, run Entity Framework migrations:

```powershell
cd "Baghdad-ai-summit/back-end/API"
dotnet ef database update
```

**Note:** If you get an error about `dotnet ef` not being installed:

```powershell
dotnet tool install --global dotnet-ef
```

### 5. Verify Connection

Test the connection by running the backend:

```powershell
cd "Baghdad-ai-summit/back-end/API"
dotnet run
```

If the connection is successful, you should see the API start without database errors.

### 6. Troubleshooting

**Error: "password authentication failed"**
- Verify your PostgreSQL username and password
- Check if the user has permission to access the database
- Try resetting the PostgreSQL password:
  ```sql
  ALTER USER postgres WITH PASSWORD 'new_password';
  ```

**Error: "database does not exist"**
- Create the database as shown in step 3
- Verify the database name in the connection string matches the created database

**Error: "connection refused"**
- Ensure PostgreSQL service is running
- Check if PostgreSQL is listening on the correct port (default: 5432)
- Verify firewall settings if connecting to a remote server

### 7. Alternative: Use Docker PostgreSQL

If you don't have PostgreSQL installed, you can use Docker:

```powershell
docker run --name postgres-baghdad -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=baghdad_ai_summit -p 5432:5432 -d postgres:15
```

Then update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=baghdad_ai_summit;Username=postgres;Password=postgres"
  }
}
```

### Current Connection String

The current connection string in `appsettings.json` is:
```
Host=localhost;Port=5432;Database=baghdad_ai_summit;Username=postgres;Password=postgres
```

**Update this with your actual PostgreSQL credentials!**
