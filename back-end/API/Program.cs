using Application.Interfaces;
using Application.Mappings;
using Application.Services;
using API.Extensions;
using API.Middleware;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Data;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Microsoft.Extensions.Logging;

// Configure Serilog
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

try
{
    Log.Information("Starting Baghdad AI Summit API");

    // Configure port binding for DigitalOcean deployment
    // Use PORT environment variable if set (DigitalOcean provides this), otherwise default to 8080
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    Environment.SetEnvironmentVariable("ASPNETCORE_URLS", $"http://+:{port}");
    Log.Information($"Binding to port: {port}");

    var builder = WebApplication.CreateBuilder(args);

    // Use Serilog for logging
    builder.Host.UseSerilog();

    // Add services to the container
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            // Configure JSON serialization to use camelCase (matching frontend)
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.WriteIndented = true;
            // Serialize enums as strings (case-insensitive) - accepts both "User" and "user"
            options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter(
                System.Text.Json.JsonNamingPolicy.CamelCase, 
                allowIntegerValues: false));
        })
        .ConfigureApiBehaviorOptions(options =>
        {
            // Disable automatic 400 response for invalid model state
            // FluentValidation will handle validation
            options.SuppressModelStateInvalidFilter = true;
        });

    // Configure Entity Framework
    // Handle DATABASE_URL from DigitalOcean (format: postgresql://user:pass@host:port/db?sslmode=require)
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (!string.IsNullOrEmpty(databaseUrl))
    {
        // Parse DATABASE_URL format: postgresql://user:pass@host:port/db?sslmode=require
        try
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            var username = userInfo[0];
            var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
            var host = uri.Host;
            var dbPort = uri.Port > 0 ? uri.Port : 5432;
            var database = uri.AbsolutePath.TrimStart('/').Split('?')[0]; // Remove query params from path
            var sslMode = "require"; // Default for DigitalOcean
            
            // Parse query string manually
            if (!string.IsNullOrEmpty(uri.Query))
            {
                var query = uri.Query.TrimStart('?');
                var queryParts = query.Split('&');
                foreach (var part in queryParts)
                {
                    var keyValue = part.Split('=');
                    if (keyValue.Length == 2 && keyValue[0].Equals("sslmode", StringComparison.OrdinalIgnoreCase))
                    {
                        sslMode = Uri.UnescapeDataString(keyValue[1]);
                        break;
                    }
                }
            }
            
            connectionString = $"Host={host};Port={dbPort};Database={database};Username={username};Password={password};SslMode={sslMode}";
            Log.Information("Using DATABASE_URL connection string");
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "Failed to parse DATABASE_URL, using DefaultConnection instead");
        }
    }
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(
            connectionString,
            npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorCodesToAdd: null);
                // Specify migrations assembly
                npgsqlOptions.MigrationsAssembly("Infrastructure");
            })
        .EnableSensitiveDataLogging(builder.Environment.IsDevelopment())
        .EnableServiceProviderCaching(false)); // Disable caching to allow graceful degradation

    // Ensure database is created
    try
    {
        using (var connection = new NpgsqlConnection(connectionString?.Replace("Database=baghdad_ai_summit", "Database=postgres")))
        {
            await connection.OpenAsync();
            var checkDbCommand = new NpgsqlCommand("SELECT 1 FROM pg_database WHERE datname = 'baghdad_ai_summit'", connection);
            var exists = await checkDbCommand.ExecuteScalarAsync();
            
            if (exists == null)
            {
                var createDbCommand = new NpgsqlCommand("CREATE DATABASE baghdad_ai_summit", connection);
                await createDbCommand.ExecuteNonQueryAsync();
                Log.Information("Database 'baghdad_ai_summit' created successfully");
            }
        }
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Could not create database automatically. Please create it manually or run migrations.");
    }

    // Register repositories
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<ISpeakerRepository, SpeakerRepository>();
    builder.Services.AddScoped<IPartnerRepository, PartnerRepository>();
    builder.Services.AddScoped<IActivityLogRepository, ActivityLogRepository>();

    // Register services
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<ISpeakerService, SpeakerService>();
    builder.Services.AddScoped<IPartnerService, PartnerService>();
    builder.Services.AddScoped<IAdminService, AdminService>();
    builder.Services.AddScoped<ICMSService, CMSService>();

    // AutoMapper
    builder.Services.AddAutoMapper(typeof(MappingProfile));

    // FluentValidation
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddFluentValidationClientsideAdapters();
    builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
    builder.Services.AddValidatorsFromAssembly(typeof(Application.Validators.PromoteUserValidator).Assembly);
    builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
    builder.Services.AddValidatorsFromAssembly(typeof(Application.Validators.RegisterAttendeeValidator).Assembly);

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
    });

    // Response Compression
    builder.Services.AddResponseCompression(options =>
    {
        options.EnableForHttps = true;
    });

    // Health Checks
    builder.Services.AddApplicationHealthChecks(builder.Configuration);

    // Swagger/OpenAPI
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Baghdad AI Summit API",
            Version = "v1",
            Description = "API for Baghdad AI Summit 2026"
        });
        
        // Add security definition for JWT (when implemented)
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });
        
        // Ignore errors during Swagger generation (makes it more resilient)
        c.IgnoreObsoleteActions();
        c.IgnoreObsoleteProperties();
        
        // Include XML comments if available (optional)
        try
        {
            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
            {
                c.IncludeXmlComments(xmlPath);
            }
        }
        catch
        {
            // Ignore if XML comments file doesn't exist
        }
    });

    var app = builder.Build();

    // Configure the HTTP request pipeline

    // Global error handling (must be first)
    app.UseMiddleware<ErrorHandlingMiddleware>();

    // Security headers (must be early in pipeline)
    app.UseMiddleware<SecurityHeadersMiddleware>();

    // Response compression
    app.UseResponseCompression();

    // HTTPS redirection - DISABLED for DigitalOcean deployment
    // DigitalOcean handles SSL termination, so forcing HTTPS causes redirect loops
    // HSTS is also disabled as DigitalOcean manages SSL
    // if (!app.Environment.IsDevelopment())
    // {
    //     app.UseHsts();
    //     app.UseHttpsRedirection();
    // }

    // Handle path base from DigitalOcean routing rules (if any)
    // This allows the app to work with or without path prefixes
    var pathBase = Environment.GetEnvironmentVariable("PATH_BASE");
    if (!string.IsNullOrEmpty(pathBase))
    {
        app.UsePathBase(pathBase);
        Log.Information($"Using path base: {pathBase}");
    }

    // CORS
    app.UseCors("AllowAll");

    // Health checks
    app.UseApplicationHealthChecks();

    // Swagger (enable in development, or always for now)
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "swagger/{documentName}/swagger.json";
    });
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Baghdad AI Summit API v1");
        c.RoutePrefix = "swagger"; // Swagger UI at /swagger
        c.DisplayRequestDuration();
        c.EnableTryItOutByDefault();
    });

    // Authentication & Authorization
    app.UseAuthentication();
    app.UseAuthorization();

    // Controllers
    app.MapControllers();

    // Helper function to return API info
    static object GetApiInfo() => new
    {
        message = "Baghdad AI Summit API",
        version = "v1",
        status = "running",
        documentation = "/swagger",
        health = "/health",
        endpoints = new
        {
            swagger = "/swagger",
            health = "/health",
            api = "/api"
        }
    };

    // Root route - return API information
    app.MapGet("/", () => Results.Json(GetApiInfo()));
    
    // Also handle /baghdad-ai-summit2 path (in case DigitalOcean routing rule is set)
    app.MapGet("/baghdad-ai-summit2", () => Results.Json(GetApiInfo()));
    app.MapGet("/baghdad-ai-summit2/", () => Results.Json(GetApiInfo()));

    // Apply migrations and seed data on startup
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            
            await dbContext.Database.MigrateAsync();
            Log.Information("Database migrations applied successfully");
            
            // Seed admin user
            await DatabaseSeeder.SeedAdminUserAsync(dbContext, logger);
        }
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Could not apply migrations or seed data. Database might not be ready.");
    }

    // Log startup
    Log.Information("Baghdad AI Summit API started successfully");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
