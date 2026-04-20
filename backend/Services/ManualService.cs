using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Controllers;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ManualService : IManualService
    {
        private readonly AppDbContext _context;

        public ManualService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ManualDto>> GetManualsAsync()
        {
            var query = from manual in _context.Tbmanuals
                        join user in _context.TmUsers on manual.CreatedBy equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        orderby manual.SequenceNumber ascending
                        select new ManualDto
                        {
                            Id = manual.Id,
                            Order = manual.SequenceNumber,
                            Title = manual.ManualName,
                            System = manual.SystemName,
                            Status = manual.IsActive ? "ACTIVE" : "INACTIVE",
                            CreatedBy = manual.CreatedBy,
                            CreatorName = user != null ? user.UserName : "ไม่ระบุ",
                            UpdatedAt = manual.UpdatedAt
                        };
            return await query.ToListAsync();
        }

        public async Task<object?> GetManualByIdAsync(int id)
        {
            var query = from manual in _context.Tbmanuals
                        join user in _context.TmUsers on manual.CreatedBy equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        where manual.Id == id
                        select new ManualDto
                        {
                            Id = manual.Id,
                            Order = manual.SequenceNumber,
                            Title = manual.ManualName,
                            System = manual.SystemName,
                            Status = manual.IsActive ? "ACTIVE" : "INACTIVE",
                            CreatedBy = manual.CreatedBy,
                            CreatorName = user != null ? user.UserName : "ไม่ระบุ",
                            UpdatedAt = manual.UpdatedAt
                        };

            return await query.FirstOrDefaultAsync();
        }

        public async Task<object> CreateManualAsync(string title, string system, string status, int? createdBy, int id)
        {
            int maxSeq = await _context.Tbmanuals.AnyAsync()
                ? await _context.Tbmanuals.MaxAsync(m => m.SequenceNumber)
                : 0;

            var newManual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == id);
            if (newManual == null)
            {
                newManual = new Manuals();
                newManual.SequenceNumber = maxSeq + 1;
                newManual.ManualName = title ?? "";
                newManual.SystemName = system ?? "";
                newManual.IsActive = status == "ACTIVE";
                newManual.CreatedBy = createdBy;
                newManual.CreatedAt = DateTime.Now;
                newManual.UpdatedAt = DateTime.Now;
                _context.Tbmanuals.Add(newManual);
            }
            else
            {
                newManual.ManualName = title ?? "";
                newManual.SystemName = system ?? "";
                newManual.IsActive = status == "ACTIVE";
                newManual.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return new { id = newManual.Id };
        }

        public async Task<object?> UpdateManualAsync(int id, UpdateManual request)
        {
            var manual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == id);

            if (manual == null) return null;

            if (!string.IsNullOrEmpty(request.Title))
                manual.ManualName = request.Title;

            if (!string.IsNullOrEmpty(request.System))
                manual.SystemName = request.System;

            if (!string.IsNullOrEmpty(request.Status))
                manual.IsActive = request.Status.ToUpper() == "ACTIVE";

            if (request.CreatedBy.HasValue)
                manual.CreatedBy = request.CreatedBy.Value;

            manual.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return new ManualDto
            {
                Id = manual.Id,
                Title = manual.ManualName,
                System = manual.SystemName,
                Status = manual.IsActive ? "ACTIVE" : "INACTIVE",
                UpdatedAt = manual.UpdatedAt
            };
        }

        public async Task<bool> DeleteManualAsync(int id)
        {
            var manual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == id);
            if (manual == null) return false;

            _context.Tbmanuals.Remove(manual);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteManualsAsync(List<int> ids)
        {
            var manuals = await _context.Tbmanuals.Where(m => ids.Contains(m.Id)).ToListAsync();
            if (manuals.Count == 0) return false;

            _context.Tbmanuals.RemoveRange(manuals);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ReorderManualsAsync(List<ReorderRequest> items)
        {
            foreach (var item in items)
            {
                var manual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == item.Id);
                if (manual != null)
                {
                    manual.SequenceNumber = item.Order;
                    manual.UpdatedAt = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
