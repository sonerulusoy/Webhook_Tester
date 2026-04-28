using Microsoft.EntityFrameworkCore;
using SaaS.Backend.Models;

namespace SaaS.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<WebhookLog> Webhooks { get; set; }
    }
}
