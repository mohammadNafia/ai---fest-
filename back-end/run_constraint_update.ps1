# PowerShell script to update the user role constraint
# This script connects to PostgreSQL and runs the SQL update

$connectionString = "Host=localhost;Port=5432;Database=baghdad_ai_summit;Username=postgres;Password=M10m10m10"

# Extract connection details
$dbHost = "localhost"
$dbPort = "5432"
$database = "baghdad_ai_summit"
$username = "postgres"
$password = "M10m10m10"

Write-Host "Updating user role constraint in PostgreSQL..." -ForegroundColor Cyan

# Try to find psql in common locations
$psqlPath = $null
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "$env:ProgramFiles\PostgreSQL\*\bin\psql.exe"
)

foreach ($path in $possiblePaths) {
    $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
    if ($resolved) {
        $psqlPath = $resolved[0].Path
        break
    }
}

# If psql is in PATH, use it directly
if (-not $psqlPath) {
    $psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
    if ($psqlCmd) {
        $psqlPath = $psqlCmd.Source
    }
}

if (-not $psqlPath) {
    Write-Host "ERROR: psql not found. Please install PostgreSQL or add it to your PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Run the SQL commands manually in pgAdmin or another PostgreSQL client:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ALTER TABLE users DROP CONSTRAINT IF EXISTS `"CK_User_Role`";" -ForegroundColor White
    Write-Host "ALTER TABLE users ADD CONSTRAINT `"CK_User_Role`" CHECK (role IN (0, 1, 2, 3, 4, 5, 6));" -ForegroundColor White
    exit 1
}

Write-Host "Found psql at: $psqlPath" -ForegroundColor Green

# Set password environment variable
$env:PGPASSWORD = $password

# Run the SQL commands
$sqlCommands = @"
ALTER TABLE users DROP CONSTRAINT IF EXISTS "CK_User_Role";
ALTER TABLE users ADD CONSTRAINT "CK_User_Role" CHECK (role IN (0, 1, 2, 3, 4, 5, 6));
"@

try {
    $sqlCommands | & $psqlPath -U $username -d $database -h $dbHost -p $dbPort
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS: User role constraint updated successfully!" -ForegroundColor Green
        Write-Host "The constraint now allows all valid roles: Guest(0), User(1), Admin(2), Staff(3), Reviewer(4), Speaker(5), Partner(6)" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "ERROR: Failed to update constraint. Exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to execute psql: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
