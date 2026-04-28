# =========================================================
# Stage 1: Base Image (Runtime)
# =========================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
# Default ASP.NET Core ports
EXPOSE 8080
EXPOSE 8081

# =========================================================
# Stage 2: Build Image (SDK)
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj and restore as distinct layers for better caching
COPY ["SaaS.Backend.csproj", "."]
RUN dotnet restore "SaaS.Backend.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "SaaS.Backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# =========================================================
# Stage 3: Publish Image
# =========================================================
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "SaaS.Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# =========================================================
# Stage 4: Final Runtime Image
# =========================================================
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Environment variables can override appsettings.json
# Example: ConnectionStrings__DefaultConnection
# Example: Jwt__Token
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_HTTP_PORTS=8080

ENTRYPOINT ["dotnet", "SaaS.Backend.dll"]
