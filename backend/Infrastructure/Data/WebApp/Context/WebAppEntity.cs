using System;
using System.Collections.Generic;
using Infrastructure.Data.WebApp.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.WebApp.Context;

public partial class WebAppEntity : DbContext
{
    public WebAppEntity(DbContextOptions<WebAppEntity> options)
        : base(options)
    {
    }

    public virtual DbSet<tbLocation> tbLocation { get; set; }

    public virtual DbSet<tbPosts> tbPosts { get; set; }

    public virtual DbSet<tbStatus> tbStatus { get; set; }

    public virtual DbSet<tbTypePost> tbTypePost { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<tbLocation>(entity =>
        {
            entity.HasKey(e => e.nLocationId);

            entity.Property(e => e.nLocationId)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.sLocationName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tbPosts>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__Users__3214EC0791A3F2BC");

            entity.Property(e => e.sNote).HasMaxLength(500);
            entity.Property(e => e.sTitle).HasMaxLength(500);
        });

        modelBuilder.Entity<tbStatus>(entity =>
        {
            entity.HasKey(e => e.nStatusId);
            entity.ToTable("tbStatus");
        });

        modelBuilder.Entity<tbTypePost>(entity =>
        {
            entity.HasKey(e => e.nTypePostId);
            entity.ToTable("tbTypePost");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
