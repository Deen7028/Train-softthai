using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // แจ้งให้ระบบรู้ว่าเรามีตาราง SystemManuals
        public DbSet<SystemManual> SystemManuals { get; set; }
    }
}