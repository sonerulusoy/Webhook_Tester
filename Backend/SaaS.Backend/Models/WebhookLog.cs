namespace SaaS.Backend.Models
{
    public class WebhookLog
    {
        public int Id { get; set; }
        public string Method { get; set; } = string.Empty;
        public string Headers { get; set; } = string.Empty;
        public string Payload { get; set; } = string.Empty;
        public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;
    }
}
