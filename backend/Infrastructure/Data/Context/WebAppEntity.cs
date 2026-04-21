using System;
using System.Collections.Generic;
using Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Context;

public partial class WebAppEntity : DbContext
{
    public WebAppEntity(DbContextOptions<WebAppEntity> options)
        : base(options)
    {
    }

    public virtual DbSet<TbData> TbData { get; set; }

    public virtual DbSet<Tbmanuals> Tbmanuals { get; set; }

    public virtual DbSet<TmDataType> TmDataType { get; set; }

    public virtual DbSet<TmUsers> TmUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TbData>(entity =>
        {
            entity.HasKey(e => e.nDataID).HasName("PK_TbData_1");

            entity.Property(e => e.dCreateDate).HasColumnType("datetime");
            entity.Property(e => e.dDate).HasColumnType("datetime");
            entity.Property(e => e.dDeleteDate).HasColumnType("datetime");
            entity.Property(e => e.dUpdateDate).HasColumnType("datetime");
            entity.Property(e => e.sDataName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.sDeleteIP_By)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.sUpdateIP_By)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.nDataType).WithMany(p => p.TbData)
                .HasForeignKey(d => d.nDataTypeID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TbData_TmDataType");
        });

        modelBuilder.Entity<Tbmanuals>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__system_m__3213E83F4317AFB0");

            entity.Property(e => e.dCreated_at)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.dUpdated_at)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.isActive).HasDefaultValue(true);
            entity.Property(e => e.sManualName).HasMaxLength(255);
            entity.Property(e => e.sSystemName).HasMaxLength(255);
        });

        modelBuilder.Entity<TmDataType>(entity =>
        {
            entity.HasKey(e => e.nDataTypeID);

            entity.Property(e => e.nDataTypeID).ValueGeneratedNever();
            entity.Property(e => e.sDataTypeName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TmUsers>(entity =>
        {
            entity.HasKey(e => e.nUserId).HasName("PK_TmUser");

            entity.Property(e => e.isActive).HasDefaultValue(true, "DF_TmUser_isActive");
            entity.Property(e => e.sEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.sUserName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
