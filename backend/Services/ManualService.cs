using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Controllers;
using Infrastructure.Data.Context;
using Infrastructure.Data.Entities;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ManualService : IManualService
    {
        private readonly WebAppEntity _context;

        public ManualService(WebAppEntity context)
        {
            _context = context;
        }

        public IEnumerable<ManualDto> GetManuals()
        {
            var query = from manual in _context.Tbmanuals
                        join user in _context.TmUsers on manual.nCreatedBy equals user.nUserId into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        where manual.isDeleted == false
                        orderby manual.nSequence_number ascending
                        select new ManualDto
                        {
                            Id = manual.nId,
                            SequenceNumber = manual.nSequence_number,
                            ManualName = manual.sManualName,
                            SystemName = manual.sSystemName,
                            Status = manual.isActive ? "ACTIVE" : "INACTIVE",
                            CreatedBy = manual.nCreatedBy,
                            CreatorName = user != null ? user.sUserName : "ไม่ระบุ",
                            UpdatedAt = manual.dUpdated_at ?? DateTime.Now
                        };
            return query.ToList();
        }

        public object? GetManualById(int id)
        {
            var query = from manual in _context.Tbmanuals
                        join user in _context.TmUsers on manual.nCreatedBy equals user.nUserId into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        where manual.nId == id && manual.isDeleted == false
                        select new ManualDto
                        {
                            Id = manual.nId,
                            SequenceNumber = manual.nSequence_number,
                            ManualName = manual.sManualName,
                            SystemName = manual.sSystemName,
                            Status = manual.isActive ? "ACTIVE" : "INACTIVE",
                            CreatedBy = manual.nCreatedBy,
                            CreatorName = user != null ? user.sUserName : "ไม่ระบุ",
                            UpdatedAt = manual.dUpdated_at ?? DateTime.Now
                        };

            return query.FirstOrDefault();
        }

        public object CreateManual(string manualName, string systemName, string status, int? createdBy, int id)
        {
            int maxSeq = _context.Tbmanuals.Any()
                ? _context.Tbmanuals.Max(m => m.nSequence_number)
                : 0;

            var newManual = _context.Tbmanuals.FirstOrDefault(m => m.nId == id);
            if (newManual == null)
            {
                newManual = new Tbmanuals();
                newManual.nSequence_number = maxSeq + 1;
                newManual.nCreatedBy = createdBy;
                newManual.dCreated_at = DateTime.Now;
                _context.Tbmanuals.Add(newManual);
            }

            newManual.sManualName = manualName ?? "";
            newManual.sSystemName = systemName ?? "";
            newManual.isActive = status == "ACTIVE";
            newManual.dUpdated_at = DateTime.Now;


            _context.SaveChanges();

            return new { id = newManual.nId };
        }

        public bool DeleteManual(int id)
        {
            var manual = _context.Tbmanuals.FirstOrDefault(m => m.nId == id);
            if (manual == null) return false;

            manual.isDeleted = true; // soft delete: ซ่อนแทนการลบจริง
            _context.SaveChanges();

            return true;
        }

        public bool DeleteManuals(List<int> ids)
        {
            var manuals = _context.Tbmanuals.Where(m => ids.Contains(m.nId)).ToList();
            if (manuals.Count == 0) return false;

            foreach (var manual in manuals)
            {
                manual.isDeleted = true; // soft delete: ซ่อนแทนการลบจริง
            }
            _context.SaveChanges();

            return true;
        }

        public bool ReorderManuals(List<ReorderRequest> items)
        {
            foreach (var item in items)
            {
                var manual = _context.Tbmanuals.FirstOrDefault(m => m.nId == item.Id);
                if (manual != null)
                {
                    manual.nSequence_number = item.Order;
                    manual.dUpdated_at = DateTime.Now;
                }
            }

            _context.SaveChanges();
            return true;
        }
    }
}

