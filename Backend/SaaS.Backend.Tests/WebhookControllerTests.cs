using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaaS.Backend.Controllers;
using SaaS.Backend.Data;
using SaaS.Backend.Models;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace SaaS.Backend.Tests
{
    public class WebhookControllerTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task ReceiveWebhook_ValidPost_SavesToDb()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new WebhookController(context);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = "POST";
            httpContext.Request.Headers["Custom-Header"] = "TestValue";
            
            var payload = "{\"event\":\"test\"}";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(payload));
            httpContext.Request.Body = stream;
            httpContext.Request.ContentLength = stream.Length;

            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

            // Act
            var result = await controller.ReceiveWebhook() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            
            var savedLog = await context.Webhooks.FirstOrDefaultAsync();
            Assert.NotNull(savedLog);
            Assert.Equal("POST", savedLog.Method);
            Assert.Contains("TestValue", savedLog.Headers);
            Assert.Equal(payload, savedLog.Payload);
        }

        [Fact]
        public async Task ReceiveWebhook_PayloadTooLarge_Returns413()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new WebhookController(context);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = "POST";
            httpContext.Request.ContentLength = (1024 * 1024) + 1; // Over 1MB

            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

            // Act
            var result = await controller.ReceiveWebhook() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status413PayloadTooLarge, result.StatusCode);
        }

        [Fact]
        public async Task GetLatestWebhooks_ReturnsTop10()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new WebhookController(context);

            // Add 15 webhooks
            for (int i = 1; i <= 15; i++)
            {
                context.Webhooks.Add(new WebhookLog { Method = "GET", Payload = $"Test {i}", ReceivedAt = System.DateTime.UtcNow.AddMinutes(i) });
            }
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetLatestWebhooks() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            
            var list = result.Value as System.Collections.Generic.IEnumerable<WebhookLog>;
            Assert.NotNull(list);
            
            var items = new System.Collections.Generic.List<WebhookLog>(list);
            Assert.Equal(10, items.Count);
        }
    }
}
