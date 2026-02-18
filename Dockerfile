# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution file first
COPY ["back-end/BaghdadAISummit.sln", "back-end/"]

# Copy project files for dependency restoration
COPY ["back-end/Domain/Domain.csproj", "back-end/Domain/"]
COPY ["back-end/Infrastructure/Infrastructure.csproj", "back-end/Infrastructure/"]
COPY ["back-end/Application/Application.csproj", "back-end/Application/"]
COPY ["back-end/API/API.csproj", "back-end/API/"]

# Restore dependencies
WORKDIR /src/back-end
RUN dotnet restore "BaghdadAISummit.sln"

# Copy remaining source files
COPY ["back-end/", "."]

# Build the solution
WORKDIR "/src/back-end/API"
RUN dotnet build "API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs

# Copy published files
COPY --from=publish /app/publish .

# Expose port
EXPOSE 8080
EXPOSE 8081

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "API.dll"]
