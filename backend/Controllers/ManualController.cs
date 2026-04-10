// Controllers/ManualController.cs
using backend.Data;
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

        // 1. GET: api/manual (ดึงข้อมูลทั้งหมดไปโชว์ในตาราง)
        [HttpGet]
        public async Task<IActionResult> GetManuals()
        {
            var manuals = await _context.Tbmanuals
                .OrderBy(m => m.SequenceNumber)
                .ToListAsync();

            // แปลงข้อมูลให้ตรงกับ Interface ของฝั่ง Next.js
            var result = manuals.Select(row => new
            {
                id = row.Id.ToString(),
                order = row.SequenceNumber,
                title = row.ManualName,
                system = row.SystemName,
                status = row.IsActive ? "ACTIVE" : "INACTIVE",
                updatedAt = row.UpdatedAt
            });

            return Ok(result);
        }

        // 2. POST: api/manual (เพิ่มคู่มือใหม่)
        [HttpPost]
        public async Task<IActionResult> CreateManual([FromForm] string title, [FromForm] string system, [FromForm] string status)
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
        public async Task<IActionResult> UpdateManual(int id, [FromForm] string title, [FromForm] string system, [FromForm] string status)
        {
            var manual = await _context.Tbmanuals.FirstOrDefaultAsync(m => m.Id == id);
            if (manual == null) return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

            manual.ManualName = title ?? manual.ManualName;
            manual.SystemName = system ?? manual.SystemName;
            manual.IsActive = status == "ACTIVE";
            manual.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { success = true });
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
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    // สร้าง Class เล็กๆ ไว้รับข้อมูล List จาก Next.js (Id และ Order)
    public class ReorderRequest
    {
        public int Id { get; set; }
        public int Order { get; set; }
    }
}