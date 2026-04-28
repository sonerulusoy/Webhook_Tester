using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaaS.Backend.Data;
using SaaS.Backend.Models;
using System.Text.Json;

namespace SaaS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebhookController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WebhookController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("receiver")]
        [HttpGet("receiver")]
        public async Task<IActionResult> ReceiveWebhook()
        {
            var method = Request.Method;
            
            // Extract headers
            var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
            var headersJson = JsonSerializer.Serialize(headers);

            // Extract payload
            string payloadJson = "";
            if (method == "GET")
            {
                var queryParams = Request.Query.ToDictionary(q => q.Key, q => q.Value.ToString());
                payloadJson = JsonSerializer.Serialize(queryParams);
            }
            else
            {
                // Güvenlik 1: İçerik çok büyük mü kontrol et (örn: max 1MB)
                if (Request.ContentLength > 1024 * 1024)
                {
                    return StatusCode(StatusCodes.Status413PayloadTooLarge, "Payload size exceeds limit (1MB).");
                }

                using var reader = new StreamReader(Request.Body);
                payloadJson = await reader.ReadToEndAsync();

                // Güvenlik 2: Boş verileri kaydetme
                if (string.IsNullOrWhiteSpace(payloadJson))
                {
                    payloadJson = "{}";
                }
                
                // Güvenlik 3: Gelen verinin boyutunu 10.000 karakterle sınırla (Kötü niyetli string saldırılarına karşı veritabanını koru)
                if (payloadJson.Length > 10000)
                {
                    payloadJson = payloadJson.Substring(0, 10000) + "... [TRUNCATED]";
                }
            }

            var webhookLog = new WebhookLog
            {
                Method = method,
                Headers = headersJson,
                Payload = payloadJson,
                ReceivedAt = DateTime.UtcNow
            };

            _context.Webhooks.Add(webhookLog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Webhook received successfully" });
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestWebhooks()
        {
            var webhooks = await _context.Webhooks
                .OrderByDescending(w => w.ReceivedAt)
                .Take(10)
                .ToListAsync();

            return Ok(webhooks);
        }
    }
}
