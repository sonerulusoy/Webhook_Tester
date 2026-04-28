using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using SaaS.Backend.Controllers;
using SaaS.Backend.Data;
using SaaS.Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace SaaS.Backend.Tests
{
    public class AuthControllerTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private IConfiguration GetConfiguration()
        {
            var inMemorySettings = new Dictionary<string, string> {
                {"Jwt:Token", "ThisIsAVerySecretKeyForJwtAuthenticationWhichShouldBeLongerThan256BitsSaaSApplication"}
            };
            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();
        }

        [Fact]
        public async Task Register_ValidUser_ReturnsOk()
        {
            // Arrange
            var context = GetDbContext();
            var config = GetConfiguration();
            var controller = new AuthController(context, config);
            var request = new AuthController.UserDto { Email = "test@test.com", Password = "password123", FullName = "Test User" };

            // Act
            var result = await controller.Register(request) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "test@test.com");
            Assert.NotNull(user);
        }

        [Fact]
        public async Task Register_ExistingUser_ReturnsBadRequest()
        {
            // Arrange
            var context = GetDbContext();
            var config = GetConfiguration();
            context.Users.Add(new User { Email = "test@test.com", PasswordHash = "hash", FullName = "Existing" });
            await context.SaveChangesAsync();

            var controller = new AuthController(context, config);
            var request = new AuthController.UserDto { Email = "test@test.com", Password = "newpassword", FullName = "New User" };

            // Act
            var result = await controller.Register(request) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Kullanıcı zaten mevcut.", result.Value);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var context = GetDbContext();
            var config = GetConfiguration();
            var password = "password123";
            var hash = BCrypt.Net.BCrypt.HashPassword(password);
            context.Users.Add(new User { Email = "test@test.com", PasswordHash = hash, FullName = "Test User" });
            await context.SaveChangesAsync();

            var controller = new AuthController(context, config);
            var request = new AuthController.UserDto { Email = "test@test.com", Password = password };

            // Act
            var result = await controller.Login(request) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            
            // Result.Value is an anonymous type, we can check if it has 'token' property
            var valueType = result.Value.GetType();
            var tokenProp = valueType.GetProperty("token");
            Assert.NotNull(tokenProp);
        }

        [Fact]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var context = GetDbContext();
            var config = GetConfiguration();
            context.Users.Add(new User { Email = "test@test.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct_pw"), FullName = "Test User" });
            await context.SaveChangesAsync();

            var controller = new AuthController(context, config);
            var request = new AuthController.UserDto { Email = "test@test.com", Password = "wrong_pw" };

            // Act
            var result = await controller.Login(request) as UnauthorizedObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(401, result.StatusCode);
            Assert.Equal("Geçersiz e-posta veya şifre.", result.Value);
        }
    }
}
