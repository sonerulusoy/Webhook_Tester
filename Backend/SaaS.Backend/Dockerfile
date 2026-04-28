# =========================================================
# Stage 1: Base Image (Runtime)
# =========================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# =========================================================
# Stage 2: Build Image (SDK)
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj using path relative to root context
COPY ["Backend/SaaS.Backend/SaaS.Backend.csproj", "Backend/SaaS.Backend/"]
RUN dotnet restore "Backend/SaaS.Backend/SaaS.Backend.csproj"

# Copy everything from root context
COPY . .
WORKDIR "/src/Backend/SaaS.Backend"
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

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_HTTP_PORTS=8080

ENTRYPOINT ["dotnet", "SaaS.Backend.dll"]
