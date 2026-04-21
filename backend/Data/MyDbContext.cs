using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.WebApp.Entities;

namespace backend.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }
        public DbSet<tbPosts> tbPosts { get; set; }
    }
}