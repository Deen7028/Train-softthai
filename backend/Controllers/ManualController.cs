// Controllers/ManualController.cs
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManualController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ManualController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetManuals()
        {
            var query = from manual in _context.Tbmanuals
                        join user in _context.TmUsers on manual.CreatedBy equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        select new
                        {
                            id = manual.Id,
                            order = manual.SequenceNumber,
                            title = manual.ManualName,
                            system = manual.SystemName,
                            status = manual.IsActive ? "ACTIVE" : "INACTIVE",
                            creatorName = user != null ? user.UserName : "ไม่ระบุ",
                            updatedAt = manual.UpdatedAt
                        };
            var result = await query.ToListAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetManualById(int id)
        {
            var query = from manual in _context.Tbmanuals
                        join user in _context.TmUsers on manual.CreatedBy equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        where manual.Id == id
                        select new
                        {
                            id = manual.Id,
                            order = manual.SequenceNumber,
                            title = manual.ManualName,
                            system = manual.SystemName,
                            status = manual.IsActive ? "ACTIVE" : "INACTIVE",
                            createdBy = manual.CreatedBy,
                            creatorName = user != null ? user.UserName : "ไม่ระบุ",
                            updatedAt = manual.UpdatedAt
                        };

            var result = await query.FirstOrDefaultAsync();

            if (result == null) return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateManual([FromForm] string title, [FromForm] string system, [FromForm] string status, [FromForm] int? createdBy)
        {
            try
            {
                // หาเลขลำดับล่าสุด
                int maxSeq = await _context.Tbmanuals.AnyAsync()
                    ? await _context.Tbmanuals.MaxAsync(m => m.SequenceNumber)
                    : 0;

                var newManual = new SystemManual
                {
                    SequenceNumber = maxSeq + 1,
                    ManualName = title ?? "",
                    SystemName = system ?? "",
                    IsActive = status == "ACTIVE",
                    CreatedBy = createdBy,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Tbmanuals.Add(newManual);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetManuals), new { id = newManual.Id }, new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // 3. PUT: api/manual/{id} (แก้ไขข้อมูล)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateManual(int id, [FromBody] UpdateManual request)
        {
            var manual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == id);

            if (manual == null)
                return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

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

            return Ok(new
            {
                success = true,
                data = new
                {
                    id = manual.Id,
                    title = manual.ManualName,
                    system = manual.SystemName,
                    status = manual.IsActive ? "ACTIVE" : "INACTIVE",
                    updatedAt = manual.UpdatedAt
                }
            });
        }

        // 4. DELETE: api/manual/{id} (ลบข้อมูล)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManual(int id)
        {
            var manual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == id);
            if (manual == null) return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

            _context.Tbmanuals.Remove(manual);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        [HttpPut("reorder")]
        public async Task<IActionResult> ReorderManuals([FromBody] List<ReorderRequest> items)
        {
            try
            {
                foreach (var item in items)
                {
                    // ค้นหาคู่มือตาม ID
                    var manual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == item.Id);
                    if (manual != null)
                    {
                        // อัปเดตเลขลำดับใหม่ (SequenceNumber)
                        manual.SequenceNumber = item.Order;
                        manual.UpdatedAt = DateTime.Now;
                    }
                }

                // บันทึกการเปลี่ยนแปลงทั้งหมดรวดเดียว
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "เกิดข้อผิดพลาดในการดึงข้อมูล: " + ex.Message });
            }
        }
    }

    public class ReorderRequest
    {
        public int Id { get; set; }
        public int Order { get; set; }
    }
}